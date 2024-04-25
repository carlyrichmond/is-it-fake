const tf = require("@tensorflow/tfjs-node");

const {
  getAllImages,
  getFirstNImagesByCategory,
  updateDocumentWithClassification,
} = require("./elasticsearch-util");
const { getResizedImageTensor, getTensorsForImageSet, IMAGE_HEIGHT, IMAGE_WIDTH } = require("./tf-util");

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

  const images = cakeTensors.concat(notCakeTensors);
  const labels = Array.from({ length: cakeTensors.length })
    .fill([1, 0])
    .concat(Array.from({ length: notCakeTensors.length }).fill([0, 1]));

  tf.util.shuffleCombo(images, labels);
  const singleImageTensor = tf.stack(images);
  const labelsTensor = tf.tensor2d(labels);

  const model = createModel();

  const BATCH_SIZE = 32;
  const NUM_EPOCHS = 10;

  await model.fit(singleImageTensor, labelsTensor, {
    batchSize: BATCH_SIZE,
    epochs: NUM_EPOCHS,
    shuffle: true,
  });

  // Classify images
  await classifyAllImages(model);

  // Optional saving of model
  const MODEL_DIR = "./model";

  await model.save(`file://${MODEL_DIR}`);

  // Tidy up
  singleImageTensor.dispose();
  labelsTensor.dispose();
  tf.dispose(cakeTensors);
  tf.dispose(notCakeTensors);
}

/* Functional implementation */

function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, 3],
      filters: 16,
      kernelSize: 3,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(
    tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    })
  );

  model.add(tf.layers.flatten());

  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.dense({
      units: CLASS_NAMES.length,
      activation: "softmax",
    })
  );

  model.compile({
    optimizer: tf.train.adam(),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

async function classifyAllImages(model) {
  const imagesResponse = await getAllImages();
  const images = imagesResponse.hits.hits.flatMap((result) => {
    return { id: result._id, url: result._source.image_url };
  });

  for (image of images) {
    console.log(image.url);
    const tensor = await getResizedImageTensor(image.url);
    const results = await model.predict(tensor.expandDims()).data();

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
    updateDocumentWithClassification(
      image.id,
      predictions[0].className,
      predictions
    );

    tensor.dispose();
  }
}
