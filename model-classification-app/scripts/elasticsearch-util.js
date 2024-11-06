const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
    cloud: { id: process.env.ELASTIC_CLOUD_ID },
    auth: { apiKey: process.env.ELASTIC_API_KEY },
  });

const index = "classifications";

async function clearIndex() {
    await esClient.indices.delete({ index: index });
    await esClient.indices.create({ 
      index: index, 
      // Explicitly mapping category to keyword, other fields to be dynamically mapped
      mappings: {
        properties: {
          "category": {
            type: "keyword",
            index: true
          }
        }
      } });
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

async function getFirstNImagesByCategory(category, n) {
  return await esClient.search({
    index: index,
    _source: [ "image_url" ],
    size: n,
    query: {
      match: {
        category: category
      }
    }
  });
}


async function getAllImages(category, n) {
  return await esClient.search({
    index: index,
    _source: [ "image_url" ],
    size: 1000,
    query: {
      match_all: {}
    }
  });
}

async function updateDocumentWithClassification(documentId, category, predictions) {
  const myModelClassifier = { 
    category:  category,
    predictions: predictions
  };
  try {
    const response = await esClient.update(
      {
        index: index,
        id: documentId,
        script: {
          lang: 'painless',
          source: `ctx._source.my_model_classifier = params.classification`,
          params: { classification: myModelClassifier }
        }
      }
    );
    console.log(response);
  } catch(e) {
    console.log(e);
  }
}

async function updateDocumentWithTransferClassification(documentId, category, predictions) {
  const myModelClassifier = { 
    category:  category,
    predictions: predictions
  };
  try {
    await esClient.update(
      {
        index: index,
        id: documentId,
        script: {
          lang: 'painless',
          source: `ctx._source.my_transfer_model_classifier = params.classification`,
          params: { classification: myModelClassifier }
        }
      }
    );
  } catch(e) {
    console.log(e);
  }
}

module.exports = { esClient, clearIndex, addClassifiersToIndex, getAllImages, getFirstNImagesByCategory, updateDocumentWithClassification, updateDocumentWithTransferClassification };