import { useEffect, useState } from "react"; //TO DO should I use useMemo to get results and classifications
import { useNavigate, useSearchParams } from "react-router-dom";

import axios from "axios";

import "./End.css";
import ClassifierTableRow from "../../components/classifier-table-row/ClassifierTableRow";
import StartButton from "../../components/start-button/StartButton";

function End() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [username, setUsername] = useState();
  const [gameId, setGameId] = useState();

  const [results, setResults] = useState();

  useEffect(() => {
    if (searchParams && !gameId) {
      const user = searchParams.get("username");
      const game = searchParams.get("game_id");

      setUsername(user);
      setGameId(game);

      getGameResults(user, game);
    }
  }, [username, gameId]);

  async function getGameResults(user, game) {
    const gameMetadata = { username: user, game_id: game };

    try {
      const response = await axios.post(
        ".netlify/functions/game_results",
        gameMetadata
      );

      if (response.status !== 200) {
        throw new Error("Unable to get game results");
      }

      const gameResults = response.data;
      setResults(gameResults);
    } catch (error) {
      console.log("Unable to get game results");
      setResults([]);
    }
  }

  return (
    <>
      <section className="section bright">
        <h1>
          Were they <span className="highlight">(F)ake</span>?!
        </h1>

        <p>
          Did you find the cake? Check out how you fared against our models
          below.
        </p>

        {results && results.length > 0 ? (
          <table>
            <thead className="table-header">
              <tr className="header-row">
                <th>Image</th>
                <th>Match</th>
                <th>Expected</th>
                <th>You</th>
                <th>MobileNet</th>
                <th>COCO-SSD</th>
                <th>MobileNet Transfer Classifier</th>
                <th>Carly Model</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                return <ClassifierTableRow key={index} rowNumber={index} result={result} />;
              })}
            </tbody>
          </table>
        ) : (
          <p>No results available!</p>
        )}
        <p>Want to try again?</p>
        <StartButton />
      </section>
    </>
  );
}

export default End;
