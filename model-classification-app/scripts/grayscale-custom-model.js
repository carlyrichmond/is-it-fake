const tf = require("@tensorflow/tfjs-node");

const {
  getAllImages,
  getFirstNImagesByCategory,
  updateDocumentWithGrayscaleClassification,
} = require("./elasticsearch-util");
const { getGrayscaleImageTensor, getGrayscaleTensorsForImageSet, IMAGE_HEIGHT, IMAGE_WIDTH } = require("./tf-util");

const CLASS_NAMES = ["cake", "not cake"];

// Build custom model
run();

async function run() {
  // Get a subset of the cake images
  const cakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0], 50);
  const cakeTensors = await getGrayscaleTensorsForImageSet(cakesResponse);

  // Get a subset of the unsplash images for not cake images
  const notCakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[1], 50);
  const notCakeTensors = await getGrayscaleTensorsForImageSet(notCakesResponse);

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
    batchSize: BATCH_SIZE, // Number of samples to work through before updating the internal model parameters
    epochs: NUM_EPOCHS, // Number of passes through the dataset
    shuffle: true, // Shuffle data before each pass
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

  console.log('Classification complete!');
}

/* Functional implementation */
// Convolutional Neural Network (CNN) example
function createModel() {
  const model = tf.sequential();

  /* Creates a 2d convolution layer. 
  * Concept from computer vision where a filter (or kernel or matrix) is applied and moves 
  through the image by the specified strides to identify features of interest in the image 
  See https://www.kaggle.com/discussions/general/463431
  */
  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, 1], // 1 = Grayscale
      filters: 16, // dimensions of the output space
      kernelSize: 3, // 3x3 matrix
      activation: "relu", //f(x)=max(0,x)
    })
  );

  /* Max pooling reduces the dimensionality of images by reducing the number of pixels in the output from the 
   * previous convolutional layer.
   * Used to reduce computational load going forward and reduce overfitting
   * See https://deeplizard.com/learn/video/ZjM_XQa5s6s
  */
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

  // Flattens the inputs to 1D, making the outputs 2D
  model.add(tf.layers.flatten());

  /* Dense Layer is simple layer of neurons in which each neuron receives input from all the neurons of previous layer, 
   * thus called as dense. Dense Layer is used to classify image based on output from convolutional layers. 
   see https://towardsdatascience.com/introduction-to-convolutional-neural-network-cnn-de*/
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
    })
  );

  model.add(
    tf.layers.dense({
      units: CLASS_NAMES.length,
      activation: "softmax", // turns a vector of K real values into a vector of K real values that sum to 1
    })
  );

  model.compile({
    optimizer: tf.train.adam(), // Stochastic Optimization method
    loss: "binaryCrossentropy",
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
    const tensor = await getGrayscaleImageTensor(image.url);
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
    updateDocumentWithGrayscaleClassification(
      image.id,
      predictions[0].className,
      predictions
    );

    tensor.dispose();
  }
}
