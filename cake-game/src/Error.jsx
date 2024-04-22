import { useRouteError } from "react-router-dom";

import StartButton from "./components/start-button/StartButton";
import "./Error.css";
import Header from "./components/header/Header";

function Error() {
  const error = useRouteError();
  console.error(error);

  return (
    <>
    <Header />
      <div id="error-page">
        <h1>The cake is a <span className="highlight">lie</span>!</h1>
        <p>Sorry, an unexpected error has occurred. Please try again.</p>
        <StartButton />
      </div>
    </>
  );
}

export default Error;
