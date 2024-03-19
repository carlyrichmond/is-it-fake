# Is it (F)ake?!

## Image Classification using TensorFlow.js and Elasticsearch

This repo documents my exciting journey into learning machine learning practices for the web. It is featured in the talk of the same name at [Devoxx UK 2024](https://www.devoxx.co.uk/speaker-details/?id=4606).

### Structure

This repo contains two applications:

1. [Is it (F)ake?!](./cake-app/) game, located in the `cake-app` folder where players can guess if the image is cake or not. This application is written using [Qwik](https://qwik.dev/).
2. The [Model [Playground](./model-playground/) is written in vanilla JavaScript, HTML and CSS. It is present in the `model-playground` folder and contains samples using the COCO-SD model on a sample image.

### How to run

See below for how to run the applications and tests.

#### `cake-app`

Start the application on `http://localhost:5173/`:

```
cd ./cake-app
npm install
npm run start
```

Run E2E tests using Playwright:

```
cd ./cake-app
npm install
npm run test.e2e
```

Execute the unit tests:

```
cd ./cake-app
npm install
npm run test.unit
```

#### `model-playground`

To start the model application on `http://localhost:8080`:

```
cd ./model-playground
npm install
node server
```