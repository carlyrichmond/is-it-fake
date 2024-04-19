import { useState } from "react";
import "./Play.css";

function Play() {
  const TEST_URL =
    "https://www.tastingtable.com/img/gallery/netflixs-bizarre-new-baking-show-is-it-cake-was-inspired-by-a-viral-meme/intro-1646847618.webp";
  const [imageUrl, setImageUrl] = useState(TEST_URL);

  function castVote(event) {
    console.log(event.value);
  }

  return (
    <>
      <section className="section bright">
        <h1>
          Is it <span className="highlight">(F)ake</span>?!
        </h1>

        <img
          alt="Random image"
          data-testid="cake-image"
          src={imageUrl}
          width="90vw"
          height="auto"
        />
        <div>
          <button
            data-testid="cake-button"
            name="vote"
            value="cake"
            onClick={castVote}>
            Cake 👍
          </button>
          <button
            data-testid="not-cake-button"
            name="vote"
            value="not-cake"
            onClick={castVote}>
            Not Cake 👎
          </button>
        </div>
      </section>
    </>
  );
}

export default Play;
