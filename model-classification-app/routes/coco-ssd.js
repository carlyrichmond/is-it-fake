var express = require('express');
var tf = require('@tensorflow/tfjs-node');
var cocoSsd = require('@tensorflow-models/coco-ssd');

var router = express.Router();
var model;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Hi COCO-SSD!');
});

router.post('/detect', async function(req, res, next) {
    if (!model) {
        model = await cocoSsd.load()
    }
    
    const tensor = await getTensorFromImage(req.body.imageUrl);
    let predictions = [];

        if (tensor && model) {
            predictions = await model.detect(tensor);
        }

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
        return decode;
    });
}

module.exports = router;
