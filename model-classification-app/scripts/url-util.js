const fs = require("fs");

function loadCakeSites() {
    // Assuming execution from folder model-classification-app
    return JSON.parse(fs.readFileSync("./scripts/cake-sites.json"));
  }
  
  function loadCakeImageUrls() {
    // Assuming execution from folder model-classification-app
    return JSON.parse(fs.readFileSync("./scripts/cake-image-urls.json"));
  }

  function loadUnsplashImageUrls() {
    // Assuming execution from folder model-classification-app
    return JSON.parse(fs.readFileSync("./scripts/unsplash-image-urls.json"));
  }

  async function writeUrlsToFile(imageUrls, filename) {
    // Assuming execution from folder model-classification-app
    await fs.writeFile(filename, JSON.stringify(imageUrls), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Image URLs successfully written to ${filename}`);
    }
  });
  }

  // Get vanilla image from URL (not for Unsplash)
  async function getImage(imageUrl) {
    try {
    return await fetch(imageUrl);
    }
    catch(e) {
        console.log(response);
    }
  }

  module.exports = { getImage, loadCakeSites, loadCakeImageUrls, loadUnsplashImageUrls, writeUrlsToFile };