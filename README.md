# Is it (F)ake?!

## Image Classification using TensorFlow.js and Elasticsearch

This repo documents my exciting journey into learning machine learning practices for the web. It is featured in the talk of the same name at [Devoxx UK 2024](https://www.devoxx.co.uk/speaker-details/?id=4606) and [HalfStack London 2024](https://halfstackconf.com/london#carly-richmond).

![](./slides/screenshots/game/game-cake-page.png)

You can play the game and pit yourself against the models at [https://is-it-fake.netlify.app/](https://is-it-fake.netlify.app/).

### Structure

This repo contains two applications:

1. [Is it (F)ake?!](./cake-app/) game, located in the `cake-app` folder where players can guess if the image is cake or not cake. This application is written using [React](https://react.dev/), [Elasticsearch Serverless Node.js client](https://github.com/elastic/elasticsearch-serverless-js) and [Netlify functions](https://www.netlify.com/platform/core/functions/).
2. The [Model Classification](./model-classification-app/) application is written in vanilla JavaScript, HTML and CSS. It is present in the `model-playground` folder and contains several useful elements:
 * A sample webpage showing predictions generated using the COCO-SD and MobileNet model on a sample image.
 * The [`classify-images.js`](./model-classification-app/scripts/classify-images.js) script includes a Node.js implementation generating image classifications of a set of source images for MobileNet and COCO-SSD. These results are persisted in Elasticsearch.
 * A custom sequential image classification model is created and executed in [`custom-model.js`](./model-classification-app/scripts/custom-model.js). These results are also persisted in Elasticsearch, and the model is saved in the [`model`](./model-classification-app/model/) folder.
 * The script [`transfer-learning.js`](./model-classification-app/scripts/transfer-learning.js) includes an example approach combining MobileNet with an additional classification head to determine the presence of cake in our image set. Just like our other scripts, the generated classifications are persisted in Elasticsearch.

### How to run

See below for how to run the applications and tests.

#### `cake-game`

Start the application on `http://localhost:5173/`, ensuring you have [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed:

```
cd ./cake-game
npm install
npm install netlify-cli -g
netlify dev
```

Execute the component tests:

```
cd ./cake-game
npm install
npm run test-ct
```

#### `model-classification-app`

To start the model application on `http://localhost:3000`:

```
cd ./model-classification-app
npm install
npm run start
```

Each of the scripts for performing different types of image classification should be executed from the `model-classification-app` folder. To persist the classifications please ensure you have a simple Elasticsearch cluster available to persist the results, with environment variables `ELASTIC_CLOUD_ID` and `ELASTIC_API_KEY` exposed to your service.

Once the Elasticsearch prerequisite has been met you can run the scripts in turn similar to the below:

```
cd ./model-classification-app
npm install
node scripts/classify-images.js
node scripts/custom-model.js
node scripts/transfer-learning.js
```

Alternatively, to persist your results to an alternative store you need to override the respective functions in [`elasticsearch-util.js`](./model-classification-app/scripts/elasticsearch-util.js) to send your classifications to the right place.

## Learning Resources

1. [TensorFlow.js API Reference](https://js.tensorflow.org/api/4.17.0/)
2. [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet)
3. [COCO-SSD](https://github.com/tensorflow/tfjs-models/blob/master/coco-ssd/README.md)
4. [Kaggle Models](https://www.kaggle.com/models?datatype=14102&publisher=google)

## Machine Learning Explained

1. [IBM: What are convolutional neural networks?](https://www.ibm.com/topics/convolutional-neural-networks)
2. [Kaggle: Basic Terminologies of Convolutional Neural Networks](https://www.kaggle.com/discussions/general/463431)
3. [National High Magnetic Field Laboratory: Convolution Kernels](https://micro.magnet.fsu.edu/primer/java/digitalimaging/processing/convolutionkernels/index.html)
4. [Deeplizard: Max Pooling in Convolutional Neural Networks](https://deeplizard.com/learn/video/ZjM_XQa5s6s)
5. [Govinda Dumane: Introduction to Convolutional Neural Network (CNN) using Tensorflow](https://towardsdatascience.com/introduction-to-convolutional-neural-network-cnn-de73f69c5b83)
5. [AI Wiki: Accuracy and Loss](https://machine-learning.paperspace.com/wiki/accuracy-and-loss)

## Tutorials

1. [Classification Model On Custom Dataset Using Tensorflow.js Made Simple: Here's What You Need to Know | Garima Nisha](https://medium.com/analytics-vidhya/classification-model-on-custom-dataset-using-tensorflow-js-9458da5f2301)
2. [Machine Learning for Web Developers (WebML) | Google for Developers](https://www.youtube.com/playlist?list=PLOU2XLYxmsILr3HQpqjLAUkIPa5EaZiui)
3. [Training an image model with TensorFlow in Node.js | ????](https://dev.to/atordvairn/training-an-image-model-with-tenserflow-in-nodejs-18em)
4. [TensorFlow.js: Make your own "Teachable Machine" using transfer learning with TensorFlow.js | Google Codelab](https://codelabs.developers.google.com/tensorflowjs-transfer-learning-teachable-machine#0)
5. [Google: Google AI for JavaScript developers with TensorFlow.js](https://www.edx.org/learn/javascript/google-google-ai-for-javascript-developers-with-tensorflow-js)

### Common Issues

1. [CORS Issue with TensorFlow.js](https://stackoverflow.com/questions/61519550/cant-load-trained-model-with-tensorflow-js)
2. [TensorFlow incorrect tensor shape sample error](https://stackoverflow.com/questions/60331012/tensorflow-js-valueerror-error-when-checking-expected-dense-dense1-input-to)
3. [Tensor has disposed](https://stackoverflow.com/questions/67642621/tensor-has-disposed)
4. [TensorFlow.js TypeError: Cannot read property 'backend' of undefined](https://github.com/tensorflow/tfjs/issues/4296)
5. [TensorFlow.js Cannot read property 'backend' of undefined in NodeJS](https://stackoverflow.com/questions/76352278/tensorflowjs-cannot-read-property-backend-of-undefined-in-nodejs)
6. [TensorFlow.js TypeError: Cannot read property 'backend' of undefined - tensor is already disposed when moveData is called](https://github.com/tensorflow/tfjs/issues/4237)

## Sources

Thanks go to the fantastic bakers out there making hyper-realistic cakes that inspired this talk and have given me great family memories. Specific thanks go to these bakers whose images I used for training and classification:

1. https://www.thelondonbaker.com
2. https://hemussweetsensation.com
3. https://www.everythingjustbaked.com/
4. https://ninamariacharles.com
5. https://www.thesugardreams.net
6. https://juliemcallistercakes.com
7. https://www.thesweetstopofrva.com

Thanks also to [Unsplash](https://unsplash.com/) and their amazing contributors who allowed me to find non-cake images through the [JavaScript wrapper unsplash-js](https://www.npmjs.com/package/unsplash-js) of the [Unsplash API](https://unsplash.com/documentation). 
