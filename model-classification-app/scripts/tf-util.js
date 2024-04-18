const tf = require("@tensorflow/tfjs-node");

const { getUnsplashImageSource } = require("./unsplash-util");
const { getImage } = require("./url-util");

const IMAGE_WIDTH = 224;
const IMAGE_HEIGHT = 224;

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
        const decodedImage = tf.node.decodeImage(buffer, 3);
        return decodedImage;
      });
    } catch (e) {
      throw Error(`Unable to create tensor for image ${url}`);
    }
  }

  async function getTensorsForImageSet(results) {
    let tensors = [];
    for (result of results.hits.hits) {
      const features = await getResizedImageTensor(result._source.image_url);
      tensors.push(features);
    }
  
    return tensors;
  }
  
  async function getResizedImageTensor(imageUrl) {
    const decodedImage = await getTensorFromImage(imageUrl);
    const resizedImage = tf.image.resizeBilinear(decodedImage, [
      IMAGE_WIDTH,
      IMAGE_HEIGHT
    ], true);
    return resizedImage;
  }

module.exports = { getResizedImageTensor, getTensorFromImage, getTensorsForImageSet, IMAGE_HEIGHT, IMAGE_WIDTH };