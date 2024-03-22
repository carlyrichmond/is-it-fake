import { component$, noSerialize, type NoSerialize, useStore, useTask$ } from '@builder.io/qwik';

import tf from '@tensorflow/tfjs-node';
import type { MobileNet } from '@tensorflow-models/mobilenet';
import { load } from '@tensorflow-models/mobilenet';

import styles from "./mobilenet.module.css";

type ImageClassification = {
    model: NoSerialize<MobileNet> | undefined,
    imageTensor: NoSerialize<tf.Tensor3D> | undefined,
    imageUrl: string,
    predictions: { className: string, probability: number }[]
}

export const MobileNetClassification = component$(() => {
    const store = useStore<ImageClassification>({
        model: undefined,
        imageTensor: undefined,
        imageUrl: 'https://images.unsplash.com/photo-1607478900766-efe13248b125',
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
            const expand = tf.expandDims(decode, 0);
            return expand;
        });

        store.imageTensor = noSerialize(tensor as tf.Tensor3D);
    });

    useTask$(async () => {
        const model = await load();
        store.model = noSerialize(model);

        if (store.imageTensor) {
            const predictions = await store.model?.classify(store.imageTensor);
            store.predictions = predictions as [];
        }
    });

    return (
        <section class="section bright">
            <h3>
                MobileNet
            </h3>

            <div class={styles.detail}>
                <div class={styles.description}>
                    <p>MobileNets are small, low-latency, low-power models
                        that can solve a variety of use cases. The are commonly used
                        for classification and detection use cases, as well as for generating
                        feature embeddings for different types of data.</p>

                    <p>For this reason, MobileNet is great for image classification, and can be retrained for your own use case via transfer learning if the out-of-the-box classifications don't suit your needs. It is trained on the
                        <a href="https://image-net.org/"> ImageNet</a> image database.</p>

                    <p>Source: <a href="https://github.com/tensorflow/tfjs-models/tree/master/mobilenet">GitHub</a></p>
                </div>

                <div class={styles.classifications}>
                    <img alt="Cupcakes" class="cake-image" data-testid="cake-image" src={store.imageUrl} width="600" height="400" />
                    <div class={styles.predictions} data-testid="predictions">
                        {
                            store.predictions.length > 0 ? store.predictions.map((prediction) => {
                                return <span class={styles.prediction} key={prediction.className}>
                                    <span class={["highlight", styles.classifer]}>{prediction.className}</span>, probability : {prediction.probability.toPrecision(4)}</span>
                            }) :
                                <span>No predictions available</span>
                        }
                    </div>
                </div>
            </div>
        </section>
    );
});