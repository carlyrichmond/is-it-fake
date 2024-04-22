import { useNavigate } from 'react-router-dom';

import'./StartButton.css';

function StartButton() {
  const navigate = useNavigate();

    function startGame() {
        navigate('/start');
    }

  return (
    <>
        <button
          onClick={startGame}>
          Play!
        </button>
    </>
  )
}

export default StartButton
