import'./Header.css';
import elasticLogo from '../../assets/elastic-logo.png'

function Header() {
  return (
    <>
      <header className="header">
      <div className="header-container">
        <div className="logo">
          <a href="/" title="Elastic">
          <img src={elasticLogo} alt="Elastic logo" />
          </a>
        </div>
        <ul>
        <li>
            <a
              href="/play"
              target="_blank">
              Play
            </a>
          </li>
          <li>
            <a
              href="/rules"
              target="_blank">
              Rules
            </a>
          </li>
          <li>
            <a
              href="https://github.com/carlyrichmond/is-it-fake"
              target="_blank">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </header>
    </>
  )
}

export default Header
