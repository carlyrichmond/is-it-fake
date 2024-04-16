const { createApi } = require("unsplash-js");

const client_id = process.env.UNSPLASH_ACCESS_KEY;
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const queries = [ "cup", "vase"]; /* "candle", "bottle", "plate", "tray",
  "thimble", "flowerpot", "dog", "cat", "hat", "book", "food", "reptile",
  "toy", "shoe", "bag", "purse" ];*/

async function getUnsplashImageUrls() {

  let imageUrls = [];

  for (query of queries) {
    try {
      const response = await unsplash.photos.getRandom({
        count: 10,
        query: query
      });

      const responseUrls = response.response.map((result) => {
        return result.urls.small;
      });
      imageUrls = imageUrls.concat(responseUrls);

    } catch (e) {
      console.log(`Unable to get images for keyword ${query} from Unsplash`);
    }
  }

  return imageUrls;
}

async function getUnsplashImageSource(imageUrl) {
  let response;

  const url = `${imageUrl}?client_id=${client_id}`;
  console.log(`Test url ${url}`);

  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    console.log(response);
  } catch (e) {
    throw Error(`Unable to get image ${imageUrl} from Unsplash`);
  }

  return response;
}

module.exports = { getUnsplashImageUrls, getUnsplashImageSource };