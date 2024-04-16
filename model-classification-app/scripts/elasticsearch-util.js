const { Client } = require("@elastic/elasticsearch-serverless");

const esClient = new Client({
    cloud: { id: process.env.ELASTIC_CLOUD_ID },
    auth: { apiKey: process.env.ELASTIC_API_KEY },
  });

const index = "classifications";

async function clearIndex() {
    await esClient.indices.delete({ index: index });
    await esClient.indices.create({ index: index });
}
  
async function addClassifiersToIndex(url, category, mobilenetClassifications, cocoSsdClassifications) {
    const imageDocument = {
        image_url: url,
        category: category,
        mobilenet_classifier: mobilenetClassifications,
        coco_ssd_predictions: cocoSsdClassifications,
        my_model_classifier: null,
      };

    return await esClient.index({
      index: index,
      document: imageDocument,
    });
}

module.exports = { esClient, index, clearIndex, addClassifiersToIndex };