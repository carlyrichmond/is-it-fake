import { component$ } from "@builder.io/qwik";
import ElasticLogo from "../../media/elastic-logo.png?jsx";
import styles from "./header.module.css";

export const Header = component$(() => {
  return (
    <header class={styles.header}>
      <div class={["container", styles.wrapper]}>
        <div class={styles.logo}>
          <a href="/" title="Elastic">
            <ElasticLogo/>
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
          <li>
            <a
              href="/playground"
              target="_blank">
              Model Playground
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
