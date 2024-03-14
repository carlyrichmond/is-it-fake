import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { routeLoader$, Form, routeAction$ } from '@builder.io/qwik-city';
import { Image } from '@unpic/qwik';
import styles from "./index.css?inline";

export const useImage = routeLoader$(async () => {
    /*const response = await fetch('https://www.tastingtable.com/img/gallery/netflixs-bizarre-new-baking-show-is-it-cake-was-inspired-by-a-viral-meme/intro-1646847618.webp', {
        headers: { Accept: 'application/json' },
    });
    const imageBlob = await response.blob();
    //const url = URL.createObjectURL(imageBlob);*/

    return { url: 'https://www.tastingtable.com/img/gallery/netflixs-bizarre-new-baking-show-is-it-cake-was-inspired-by-a-viral-meme/intro-1646847618.webp' };
});

export const useCakeVoteAction = routeAction$((props) => {
    // Leave it as an exercise for the reader to implement this.
    console.log('VOTE', props);
});

export default component$(() => {
    const imageSignal = useImage();
    const isItCakeAction = useCakeVoteAction();

    useStylesScoped$(styles);

    return (
        <section class="section bright">
            <h1>
                Is it <span class="highlight">(F)ake</span>?!
            </h1>

            <Image src={imageSignal.value.url}/>
            <Form action={isItCakeAction}>
                <button name="vote" value="cake">Cake 👍</button>
                <button name="vote" value="not-cake">Not Cake 👎</button>
            </Form>
        </section>
    );
});