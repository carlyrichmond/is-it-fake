const tf = require("@tensorflow/tfjs-node");

const { getAllImages, getFirstNImagesByCategory } = require("./elasticsearch-util");
const { getTensorFromImage, IMAGE_HEIGHT, IMAGE_WIDTH } = require("./tf-util");

const CLASS_NAMES = ["cake", "not cake"];

// Build transfer learning model
run();

async function run() {
  // Get a subset of the cake images
  const cakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0]);
  const cakeTensors = await getTensorsForImageSet(cakesResponse);

  // Get a subset of the unsplash images for not cake images
  const notCakesResponse = await getFirstNImagesByCategory(CLASS_NAMES[0]);
  const notCakeTensors = await getTensorsForImageSet(notCakesResponse);

  const images = cakeTensors.concat(notCakeTensors);
  const singleImageTensor = tf.stack(images)
  const labels = tf.tensor2d(
    Array.from({ length: cakeTensors.length })
      .fill([1, 0])
      .concat(Array.from({ length: notCakeTensors.length }).fill([0, 1]))
  );

  const model = createModel();

  const BATCH_SIZE = 32;
  const NUM_EPOCHS = 10;

  await model.fit(singleImageTensor, labels, {
    batchSize: BATCH_SIZE,
    epochs: NUM_EPOCHS,
    shuffle: true,
  });

  // TODO classify images
  await classifyAllImages(model);

  // Optional saving of model
  const MODEL_DIR = "./model";

  await model.save(`file://${MODEL_DIR}`);
}

/* Functional implementation */
async function getTensorsForImageSet(results) {
  let tensors = [];
  for (result of results.hits.hits) {
    const features = await getResizedImageTensor(
      result._source.image_url
    );
    tensors.push(features);
  }

  return tensors;
}

async function getResizedImageTensor(imageUrl) {
  const decodedImage = await getTensorFromImage(imageUrl);
  const resizedImage = tf.image.resizeBilinear(decodedImage, [
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
  ]);
  return resizedImage;
}

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
        const tensor = await getResizedImageTensor(image.url)
        const results = await model.predict(tensor.expandDims()).data();
        console.log(results);

        const prediction =  Array.from(results).map(function (p, i) {
			return {
				probability: p,
				className:  CLASS_NAMES[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 1);
        //const category = predictions[0] > predictions[1] ? "cake" : "not cake";

        console.log(prediction[0].className);
        //updateDocumentWithClassification(image.id, classifications);
    }
}
