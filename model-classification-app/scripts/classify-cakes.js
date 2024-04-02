const fs = require("fs");
const { exec } = require("child_process");
const { exit } = require("process");

const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const { Client } = require("@elastic/elasticsearch-serverless");
const { firefox } = require("playwright");

const esClient = new Client({
  cloud: { id: process.env.ELASTIC_CLOUD_ID },
  auth: { apiKey: process.env.ELASTIC_API_KEY },
});
const index = "classifications";

let mobileNetModel;
let cocoSsdModel;

// Starting cake server
// Assuming execution from folder model-classification-app
exec("npm run start", (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    exit(1);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

//getCakeImages();
classifyImages();
exit(0);

/* Helper functions */

async function getCakeImages() {
  let browser = await firefox.launch();
  let page = await browser.newPage();

  const cakeSites = loadCakeSites();
  let imageUrls = []

  for (site of cakeSites) {
    console.log(`Extracting image urls for site: ${site.url}`);

    try {
      await page.goto(site.url);
      const currentPageImages = await page.locator('img').evaluateAll((images) => { 
        return images.map((image) => { return image.getAttribute('src') })
          .filter((url) => { return url != null });
    });
      imageUrls = imageUrls.concat(currentPageImages);
    } catch (e) {
      console.error(`Unable to get images for site ${site.url}`);
    }
  }

  const filename = './scripts/cake-image-urls.json';
  fs.writeFile(filename, JSON.stringify(imageUrls), 
    err => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Image URLs successfully written to ${filename}`);
    }
  });
  await browser.close();
}

async function classifyImages() {
  // Get client and remove index (if already created)
  if (!esClient) {
    console.error("Unable to connect to Elasticsearch");
    return;
  }

  await esClient.indices.delete({ index: index });
  await esClient.indices.create({ index: index });

  const cakeImageUrls = loadCakeImageUrls();

  // classify each image and persist to index
  for (url of cakeImageUrls) {
    // Exclude anything containing the word logo and any images that are webp format
    if (url.includes('logo') || url.includes('.webp')) {
      continue;
    }

    console.log(`Processing image: ${url}`);

    try {

        const tensor = await getTensorFromImage(url);

        const mobilenetClassifications = await getMobileNetClassifications(tensor);
        const cocoSsdClassifications = await getCocoSSDPredictions(tensor);

        const imageDocument = {
            image_url: url,
            category: 'cake',
            mobilenet_classifier: mobilenetClassifications,
            coco_ssd_predictions: cocoSsdClassifications,
            my_model_classifier: null,
          };

        await esClient.index({
          index: index,
          document: imageDocument,
        });
      } catch (e) {
      console.error(`Unable to classify image ${url}`);
      continue;
    } 
  }
}

function loadCakeSites() {
  // Assuming execution from folder model-classification-app
  return JSON.parse(fs.readFileSync("./scripts/cake-sites.json"));
}

function loadCakeImageUrls() {
  // Assuming execution from folder model-classification-app
  return JSON.parse(fs.readFileSync("./scripts/cake-image-urls.json"));
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
    const response = await fetch(imageUrl, {
      headers: { Accept: 'application/json' },
  });

  const buffer = response.ok ? new Uint8Array(await response.arrayBuffer()) : null;

  if (!buffer) {
      return;
  }

  return tf.tidy(() => {
      const decode = tf.node.decodeImage(buffer, 3);
      return decode;
  });
  } catch(e) {
    throw Error(`Unable to create tensor for image ${url}`)
  }
}
