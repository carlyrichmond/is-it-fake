import { Link } from "react-router-dom";

import "./Header.css";
import elasticLogo from "../../assets/elastic-logo.png";

function Header() {
  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link data-testid="home-link" to={`/`} title="Elastic">
              <img src={elasticLogo} alt="Elastic logo" />
            </Link>
          </div>
          <ul>
            <li>
              <Link data-testid="play-link" to={`/play`} title="Elastic">
                Play
              </Link>
            </li>
            <li>
              <Link data-testid="rules-link" to={`/`}>
                Rules
              </Link>
            </li>
            <li>
              <a data-testid="github-link"
                href="https://github.com/carlyrichmond/is-it-fake"
                target="_blank">
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}

export default Header;
