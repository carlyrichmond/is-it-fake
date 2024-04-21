import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Start.css";

function Start() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();

  function updateUsername(event) {
    setUsername(event.target.value);
  }

  function onStartClick() {
    navigate(`/play?username=${username}`);
  }

  return (
    <>
      <section className="section bright">
        <h1>
          Is it <span className="highlight">(F)ake</span>?!
        </h1>

        <div className="username-entry">
          <label htmlFor="username-input">Enter username</label>
          <input
            id="username-input"
            data-testid="username-input"
            type="text"
            onKeyUp={updateUsername}
            placeholder="rubberducky84"/>
        </div>
        <button
          data-testid="start-button"
          name="start-game"
          onClick={onStartClick}
        >
          Play!
        </button>
      </section>
    </>
  );
}

export default Start;
