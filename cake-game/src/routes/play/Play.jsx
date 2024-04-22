import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import axios from "axios";

import "./Play.css";

function Play() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [username, setUsername] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [expectedCategory, setExpectedCategory] = useState('cake');

  useEffect(() => {
    if (!imageUrl ) {
      getNextRandomImage();
    }

    if (searchParams && !username) {
      setUsername(searchParams.get('username'));
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

  async function castVote(event) {
    const classification = {
      username: username,
      timestamp: new Date().toISOString(),
      image_url: imageUrl,
      expected_category: expectedCategory,
      user_category: event.target.value
    }
    try {
      const response = await axios.post('.netlify/functions/result', classification);
      
      if (response.status !== 200) {
          throw new Error('Unable to get next image');
      }
      
      await getNextRandomImage();
    }
    catch(error) {
      console.log('Unable to get next image');
      navigate('/error');
    }
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
