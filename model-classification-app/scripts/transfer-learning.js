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

// Build transfer learning model
run();

async function run() {
  // Get a subset of the cake images
  const cakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0], 50);
  const cakeTensors = await getTensorsForImageSet(cakesResponse);

  // Get a subset of the unsplash images for not cake images
  const notCakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0], 50);
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
    // Normalize the image data. Image data is always in the range of 0 to 255, 
    // so you can simply divide resizedTensorFrame by 255 to ensure all values are between 0 and 1 instead as MobileNet expects
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
    metrics: ["accuracy"],
  });

  return myTransferMobileNetModel;
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
