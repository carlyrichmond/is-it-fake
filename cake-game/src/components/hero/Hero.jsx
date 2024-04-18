import'./Hero.css';
import duckImage from '../../assets/header-duck-cake.jpeg'

function Hero() {

    function startGame() {
        alert('Let\'s begin');
    }

  return (
    <>
      <div className="container">
      <img src={duckImage} className="hero-image" alt="Image duck cake" />
      <h1>
        Is it <span className="highlight">(F)ake</span>?!
      </h1>
      <p data-testid="game-description">Beat the models and find the cake!</p>
      <div className="button-group">
        <button
          onClick={startGame}>
          Play!
        </button>
      </div>
    </div>
    </>
  )
}

export default Hero
