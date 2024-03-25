import { component$, noSerialize, type NoSerialize, useStore, useTask$ } from '@builder.io/qwik';

import tf from '@tensorflow/tfjs-node';
import type { ObjectDetection } from '@tensorflow-models/coco-ssd';
import { load } from '@tensorflow-models/coco-ssd';

import styles from "./coco-ssd.module.css";

type ImageClassification = {
    model: NoSerialize<ObjectDetection> | undefined,
    imageTensor: NoSerialize<tf.Tensor3D> | undefined,
    imageUrl: string,
    predictions: { class: string, bbox: number[], score: number }[]
}

export const CocoSsdClassification = component$(() => {
    const store = useStore<ImageClassification>({
        model: undefined,
        imageTensor: undefined,
        imageUrl: 'https://images.unsplash.com/photo-1552689486-f6773047d19f?q=80&w=600&auto=format&fit=crop',
        predictions: []
    });

    useTask$(async () => {
        const response = await fetch(store.imageUrl, {
            headers: { Accept: 'application/json' },
        });

        const buffer = response.ok ? new Uint8Array(await response.arrayBuffer()) : null;

        if (!buffer) {
            return;
        }

        const tensor = tf.tidy(() => {
            const decode = tf.node.decodeImage(buffer, 3);
            return decode;
        });

        store.imageTensor = noSerialize(tensor as tf.Tensor3D);
    });

    useTask$(async () => {
        const model = await load();
        store.model = noSerialize(model);

        if (store.imageTensor) {
            const predictions = await store.model?.detect(store.imageTensor);
            store.predictions = predictions as [];
        }
    });

    return (
        <section class="section bright">
            <h3>
                COCO-SSD
            </h3>

            <div class={styles.detail}>
                <div class={styles.description}>
                    <p>COCO-SSD is an object detection model available as part of the default model 
                        set for TensorFlow.js. SSD, or Single Shot MultiBox Detection, is a type of model 
                        that can identify multiple objects in an image.</p>

                    <p>COCO-SSD is able to detect 80 different classes of objects based on the 
                        <a href="https://cocodataset.org/#home"> Common Objects in Context, or COCO</a>, dataset.</p>

                    <p>Source: <a href="https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd">GitHub</a></p>
                </div>

                <div class={styles.classifications}>
                    <div class={styles.predictions} data-testid="predictions">
                    <img alt="Cupcakes" class="cake-image" data-testid="cake-image" src={store.imageUrl} width="600" height="400" />
                        {
                            store.predictions.length > 0 ? store.predictions.map((prediction) => {
                                if (prediction.score < 0.66) {
                                    return '';
                                }

                                const predictionBoxStyle = {
                                    left: `${prediction.bbox[0]}px`,
                                    top: `${prediction.bbox[1] - 30}px`,
                                    width: `${prediction.bbox[2]}px`,
                                    height: `${prediction.bbox[3] + 30}px`,
                                };

                                const predictionStyle = {
                                    width: `${prediction.bbox[2] - 10}px`,
                                    top: -20,
                                    left: 0
                                };

                                return <div class={styles.highlighter} style={predictionBoxStyle} key={prediction.class}>
                                    <p class={styles.highlight} style={predictionStyle}>{prediction.class + ' with ' + Math.round(prediction.score * 100) + '%'}</p>
                                </div>
                            }) :
                                <p>No predictions available</p>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
});