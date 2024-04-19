const tf = require("@tensorflow/tfjs-node");

const {
  getAllImages,
  getFirstNImagesByCategory,
  updateDocumentWithTransferClassification,
} = require("./elasticsearch-util");
const {
  getResizedImageTensor,
  getTensorsForImageSet,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
} = require("./tf-util");

const CLASS_NAMES = ["cake", "not cake"];

let trainingDataInputs;
let trainingDataOutputs;

// Build transfer learning model
run();

async function run() {
  // Get a subset of the cake images
  const cakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0]);
  const cakeTensors = await getTensorsForImageSet(cakesResponse);

  // Get a subset of the unsplash images for not cake images
  const notCakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0]);
  const notCakeTensors = await getTensorsForImageSet(notCakesResponse);

  // Process
  const images = cakeTensors.concat(notCakeTensors);
  const labels = Array.from({ length: cakeTensors.length })
    .fill([1, 0])
    .concat(Array.from({ length: notCakeTensors.length }).fill([0, 1]));

  // Initialize both models
  const mobileNetModel = await getMobileNetFeatureModel();
  const myTransferMobileNetModel = getTransferClassificationModel();

  // Get features from MobileNet
  const mobileNetFeatures = images.map((image) => {
    const normalizedImageTensor = image.div(255);
    return mobileNetModel.predict(normalizedImageTensor.expandDims()).squeeze();
  });

  // Train new model using MobileNet features
  tf.util.shuffleCombo(mobileNetFeatures, labels);
  const singleImageTensor = tf.stack(mobileNetFeatures);
  const labelsTensor = tf.tensor2d(labels);

  await myTransferMobileNetModel.fit(singleImageTensor, labelsTensor, {
    shuffle: true,
    batchSize: 5,
    epochs: 10,
    callbacks: { onEpochEnd: logProgress },
  });

  await classifyAllImages(mobileNetModel, myTransferMobileNetModel);
}

/* Functional implementation */

async function getMobileNetFeatureModel() {
  const URL =
    "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1";

  const mobileNetModel = await tf.loadGraphModel(URL, { fromTFHub: true });

  // Warm up the model
  tf.tidy(() => {
    // 3 for RGB images
    mobileNetModel.predict(tf.zeros([1, IMAGE_HEIGHT, IMAGE_WIDTH, 3]));
  });

  return mobileNetModel;
}

function getTransferClassificationModel() {
  // Alternative model classification head
  const myTransferMobileNetModel = tf.sequential();
  myTransferMobileNetModel.add(
    tf.layers.dense({ inputShape: [1024], units: 128, activation: "relu" })
  );
  myTransferMobileNetModel.add(
    tf.layers.dense({ units: CLASS_NAMES.length, activation: "softmax" })
  );

  myTransferMobileNetModel.summary();

  // Compile the model with the defined optimizer and specify a loss function to use.
  myTransferMobileNetModel.compile({
    // Adam changes the learning rate over time which is useful.
    optimizer: "adam",
    // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
    // Else categoricalCrossentropy is used if more than 2 classes.
    loss:
      CLASS_NAMES.length === 2
        ? "binaryCrossentropy"
        : "categoricalCrossentropy",
    // As this is a classification problem you can record accuracy in the logs too!
    metrics: ["accuracy"],
  });

  return myTransferMobileNetModel;
}

async function getMobileNetFeaturesForImage(imageUrl) {
  const decodedImage = await getTensorFromImage(imageUrl);
  let predictions;
  tf.tidy(() => {
    const resizedImage = tf.image.resizeBilinear(decodedImage, [
      IMAGE_WIDTH,
      IMAGE_HEIGHT,
    ]);
    const normalizedImageTensor = resizedImage.div(255); // TODO Does fromImage also support 255 like frompixels?

    predictions = mobileNetModel
      //.predict(normalizedImageTensor.expandDims())
      .predict(resizedImage.expandDims())
      .squeeze(); // Squash to 1d tensor
  });

  return predictions;
}

async function trainAndPredict() {
  /*tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
  const outputsAsTensor = tf.tensor1d(trainingDataOutputs, "int32");
  const oneHotOutputs = tf.oneHot(outputsAsTensor, CLASS_NAMES.length);*/

  console.log(`Before ${tf.getBackend()}`);
  await tf.setBackend("tensorflow");
  console.log(`After ${tf.getBackend()}`);

  //const inputsAsTensor = tf.stack(trainingDataInputs);
  let results;

  tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
  const outputsAsTensor = tf.tensor1d(trainingDataOutputs, "int32");
  const oneHotOutputs = tf.oneHot(outputsAsTensor, CLASS_NAMES.length);

  const inputs = tf.data.array(trainingDataInputs);
  const labels = tf.data.array(oneHotOutputs);

  // We zip the data and labels together, shuffle and batch 32 samples at a time.
  const dataset = tf.data.zip({ inputs, labels }).shuffle(10).batch(5);

  results = await myTransferMobileNetModel.fit(
    trainingDataInputs,
    oneHotOutputs,
    {
      shuffle: true,
      batchSize: 5,
      epochs: 10,
      callbacks: { onEpochEnd: logProgress },
    }
  );
  /*results = await myTransferMobileNetModel.fitDataset(dataset, {
      epochs: 10,
      callbacks: { onEpochEnd: logProgress },
    });*/

  outputsAsTensor.dispose();
  oneHotOutputs.dispose();
  inputsAsTensor.dispose();

  return results;
}

async function classifyAllImages(mobileNetModel, model) {
  const imagesResponse = await getAllImages();
  const images = imagesResponse.hits.hits.flatMap((result) => {
    return { id: result._id, url: result._source.image_url };
  });

  for (image of images) {
    console.log(image.url);
    const tensor = await getResizedImageTensor(image.url);
    const normalizedImageTensor = tensor.div(255);
    const features = mobileNetModel.predict(normalizedImageTensor.expandDims()).squeeze();

    const results = await model.predict(features.expandDims()).squeeze().data();
    
    console.log(results);

    const predictions = Array.from(results)
      .map(function (p, i) {
        return {
          probability: p,
          className: CLASS_NAMES[i], // we are selecting the value from the obj
        };
      })
      .sort(function (a, b) {
        return b.probability - a.probability;
      })
      .slice(0, 2);

    console.log(predictions);
    updateDocumentWithTransferClassification(
      image.id,
      predictions[0].className,
      predictions
    );
  }
}

/**
 * Log training progress.
 **/
function logProgress(epoch, logs) {
  console.log("Data for epoch " + epoch, logs);
}