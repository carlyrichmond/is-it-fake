var express = require('express');
var tf = require('@tensorflow/tfjs-node');
var mobilenet = require('@tensorflow-models/mobilenet');

var router = express.Router();
var model;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hi MobileNet!');
});

router.post('/classify', async function(req, res, next) {
    if (!model) {
        model = await mobilenet.load()
    }
    
    const tensor = await getTensorFromImage(req.body.imageUrl);
    let predictions = [];

        if (tensor && model) {
            predictions = await model.classify(tensor);
        }

    //const predictions = [{ className: 'cup', probability: 0.987656478 }];
    res.send(JSON.stringify(predictions));
  });

async function getTensorFromImage(imageUrl) {
    const response = await fetch(imageUrl, {
        headers: { Accept: 'application/json' },
    });

    const buffer = response.ok ? new Uint8Array(await response.arrayBuffer()) : null;

    if (!buffer) {
        return;
    }

    return tf.tidy(() => {
        const decode = tf.node.decodeImage(buffer, 3);
        const expand = tf.expandDims(decode, 0);
        return expand;
    });
}

module.exports = router;
