import { component$ } from "@builder.io/qwik";
import styles from "./footer.module.css";

export default component$(() => {

  return (
    <footer>
      <div class="container">
        <a href="https://carlyrichmond.com/" target="_blank" class={styles.anchor}>
          <span>Made by Carly Richmond &#x1f951; with &#x1F49C; and  &#x1f375;</span>
        </a>
      </div>
    </footer>
  );
});
