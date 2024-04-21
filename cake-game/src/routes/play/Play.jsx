import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import axios from "axios";

import "./Play.css";

function Play() {
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState();
  const [expectedCategory, setExpectedCategory] = useState('cake');

  useEffect(() => {
    if (!imageUrl ) {
      getNextRandomImage();
    }
  }, [imageUrl]);

  async function getNextRandomImage() {
    try {
        const response = await axios.get('.netlify/functions/image');
        
        if (response.status !== 200) {
            throw new Error('Unable to get next image');
        }
        
        const imageUrl = response.data.image_url;
        const category = response.data.category;
        
        setImageUrl(imageUrl);
        setExpectedCategory(category);
      }
      catch(error) {
        console.log('Unable to get next image');
        navigate('/error');
      }
  }

  function castVote(event) {
    console.log(event.target.value);
  }

  return (
    <>
      <section className="section bright">
        <h1>
          Is it <span className="highlight">(F)ake</span>?!
        </h1>

        <img
          className="classifier-image"
          alt="Random image"
          data-testid="cake-image"
          src={imageUrl}
        />
        <div className="voting-buttons">
          <button
            data-testid="cake-button"
            name="vote"
            value="cake"
            onClick={castVote}
          >
            Cake 👍
          </button>
          <button
            data-testid="not-cake-button"
            name="vote"
            value="not-cake"
            onClick={castVote}
          >
            Not Cake 👎
          </button>
        </div>
      </section>
    </>
  );
}

export default Play;
