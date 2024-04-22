import "./Hero.css";
import duckImage from "../../assets/header-duck-cake.jpeg";
import StartButton from "../start-button/StartButton";

function Hero() {
  return (
    <>
      <div className="hero">
        <img src={duckImage} className="hero-image" alt="Image duck cake" />
        <h1>
          Is it <span className="highlight">(F)ake</span>?!
        </h1>
        <p data-testid="game-description">Beat the models and find the cake!</p>
        <StartButton />
      </div>
    </>
  );
}

export default Hero;
