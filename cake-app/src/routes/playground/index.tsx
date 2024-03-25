import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { MobileNetClassification } from '~/components/models/mobilenet/mobilenet';
import { CocoSsdClassification } from '~/components/models/coco-ssd/coco-ssd';

import styles from "./index.css?inline";

export default component$(() => {
    useStylesScoped$(styles);

    return (
        <section class="section bright">
            <h1>
                Is it <span class="highlight">(F)ake</span>?!
            </h1>

            <p>Check out the models that you can play against in your quest to find the cake!</p>

            <MobileNetClassification/>

            <CocoSsdClassification/>

        </section>
    );
});