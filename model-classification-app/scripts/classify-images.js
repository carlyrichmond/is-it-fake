const { exec } = require("child_process");
const { exit } = require("process");

const tf = require("@tensorflow/tfjs-node");
const mobilenet = require("@tensorflow-models/mobilenet");
const cocoSsd = require("@tensorflow-models/coco-ssd");

const { firefox } = require("playwright");

const {
  addClassifiersToIndex,
  esClient,
  clearIndex,
} = require("./elasticsearch-util");
const {
  getUnsplashImageUrls,
  getUnsplashImageSource,
} = require("./unsplash-util");
const {
  getImage,
  loadCakeImageUrls,
  loadCakeSites,
  loadUnsplashImageUrls,
  writeUrlsToFile,
} = require("./url-util");

let mobileNetModel;
let cocoSsdModel;

// Starting cake server
// Assuming execution from folder model-classification-app
run();

async function run() {
  exec("npm run start", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      exit(1);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  // Reset index (uncomment if regenerating)
  //clearIndex();

  getCakeImages();
  const cakeImageUrls = loadCakeImageUrls();
  await classifyImages('cake', cakeImageUrls);

  const objectImageUrls = await getUnsplashImageUrls();
  await classifyImages("not cake", objectImageUrls);
}

/* Helper functions */

async function getCakeImages() {
  let browser = await firefox.launch();
  let page = await browser.newPage();

  const cakeSites = loadCakeSites();
  let imageUrls = [];

  for (site of cakeSites) {
    console.log(`Extracting image urls for site: ${site.url}`);

    try {
      await page.goto(site.url);
      const currentPageImages = await page
        .locator("img")
        .evaluateAll((images) => {
          return images
            .map((image) => {
              return image.getAttribute("src");
            })
            .filter((url) => {
              return url != null;
            });
        });
      imageUrls = imageUrls.concat(currentPageImages);
    } catch (e) {
      console.error(`Unable to get images for site ${site.url}`);
    }
  }

  await writeUrlsToFile(imageUrls, "./scripts/cake-image-urls.json");
  await browser.close();
}

async function classifyImages(category, imageUrls) {
  // classify each image and persist to index
  for (url of imageUrls) {
    // Exclude anything containing the word logo and any images that are webp format
    if (url.includes("logo") || url.includes(".webp")) {
      continue;
    }

    console.log(`Processing image: ${url}`);

    try {
      const tensor = await getTensorFromImage(url);

      const mobilenetClassifications = await getMobileNetClassifications(
        tensor
      );
      const cocoSsdClassifications = await getCocoSSDPredictions(tensor);

      addClassifiersToIndex(
        url,
        category,
        mobilenetClassifications,
        cocoSsdClassifications
      );
    } catch (e) {
      console.error(`Unable to classify image ${url}`);
      continue;
    }
  }
}

async function getMobileNetClassifications(tensor) {
  if (!mobileNetModel) {
    mobileNetModel = await mobilenet.load();
  }

  if (tensor && mobileNetModel) {
    predictions = await mobileNetModel.classify(tensor);
  }

  return predictions;
}

async function getCocoSSDPredictions(tensor) {
  if (!cocoSsdModel) {
    cocoSsdModel = await cocoSsd.load();
  }

  if (tensor && cocoSsdModel) {
    predictions = await cocoSsdModel.detect(tensor);
  }

  return predictions;
}

async function getTensorFromImage(imageUrl) {
  try {
    let response;

    if (imageUrl.includes("unsplash")) {
      response = await getUnsplashImageSource(imageUrl);
    } else {
      response = await getImage(imageUrl);
    }

    const buffer = response.ok
      ? new Uint8Array(await response.arrayBuffer())
      : null;

    if (!buffer) {
      return;
    }

    return tf.tidy(() => {
      const decode = tf.node.decodeImage(buffer, 3);
      return decode;
    });
  } catch (e) {
    throw Error(`Unable to create tensor for image ${url}`);
  }
}
