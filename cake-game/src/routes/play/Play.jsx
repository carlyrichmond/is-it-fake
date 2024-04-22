import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';

import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';

import "./Play.css";

function Play() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // UUID is 
  const gameId = useState(uuidv4());

  const [username, setUsername] = useState();
  const [imageCount, setImageCount] = useState(0);
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
      game_id: gameId[0],
      username: username,
      timestamp: new Date().toISOString(),
      image_url: imageUrl,
      expected_category: expectedCategory,
      user_category: event.target.value
    };

    triggerConfetti(event.target.value);

    try {
      const response = await axios.post('.netlify/functions/result', classification);
      
      if (response.status !== 200) {
          throw new Error('Unable to get next image');
      }
      
      setImageCount(imageCount + 1);
      if (imageCount < 9) {
        await getNextRandomImage();
      } else {
        navigate(`/end?username=${username}&game_id=${classification.game_id}`);
      }
    }
    catch(error) {
      console.log('Unable to get next image');
      navigate('/error');
    }
  }

  function triggerConfetti(vote) {
    const baseOptions = { origin: { x: 0.5, y: 0.8 }, particleCount: 200, spread: 180 };

    if (vote === expectedCategory) {
      confetti(baseOptions);
    } else {
      const scalar = 2;
      const cross = confetti.shapeFromText({ text: '❌', scalar });
      confetti({ shapes: [cross], scalar: scalar, ...baseOptions });
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
            value="not cake"
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
