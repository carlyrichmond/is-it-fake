import { component$, noSerialize, type NoSerialize, useStore, useStylesScoped$, useTask$, useOnDocument, useVisibleTask$, $ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$ } from '@builder.io/qwik-city';

import '@tensorflow/tfjs-node';
import mobilenet from '@tensorflow-models/mobilenet'

import styles from "./index.css?inline";
import tf from '@tensorflow/tfjs-node';

type ImageClassification = {
    model: NoSerialize<mobilenet.MobileNet> | undefined,
    predictions: any[]; // TODO refine type
}

export const useImage = routeLoader$(async () => {
    const url = 'https://images.unsplash.com/photo-1607478900766-efe13248b125';
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });
    //const imageBlob = await response.blob;
    const buffer = response && response.ok ? new Uint8Array(await response.arrayBuffer()) : null;

    if (!buffer) {
        return { imageTensor: null, url: undefined };
    }

    const tensor = tf.tidy(() => {
        const decode = tf.node.decodeImage(buffer, 3);
        const expand = tf.expandDims(decode, 0);
        return expand;
    });

    return { imageTensor: noSerialize(tensor), url: url };
});

export const useCakeVoteAction = routeAction$((props) => {
    // Leave it as an exercise for the reader to implement this.
    console.log('VOTE', props);
});

export default component$(() => {
    const imageUrlSignal = useImage();
    const isItCakeAction = useCakeVoteAction();

    const store = useStore<ImageClassification>({
        model: undefined,
        predictions: []
    });

    useTask$(async () => {
        const model = await mobilenet.load();
        store.model = noSerialize(model);

        if (imageUrlSignal.value.imageTensor){
            const predictions = await store?.model?.classify(imageUrlSignal.value.imageTensor);
            store.predictions = predictions as unknown as any[];
        }
    });

    useStylesScoped$(styles);

    return (
        <section class="section bright">
            <h1>
                Is it <span class="highlight">(F)ake</span>?!
            </h1>

            <img alt="Cupcakes" data-testid="cake-image" src={imageUrlSignal.value.url} width="90vw" height="auto"/>
            <Form action={isItCakeAction}>
                <button data-testid="cake-button" name="vote" value="cake">Cake 👍</button>
                <button data-testid="not-cake-button" name="vote" value="not-cake">Not Cake 👎</button>
            </Form>

            {
                store.predictions.length > 0 ? store.predictions.map((prediction) => {
                    return <span>{prediction.className} with {prediction.probability}</span>
                }) : 
                <span>No predictions available</span>
            }
        </section>
    );
});