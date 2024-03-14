import { component$, useSignal } from "@builder.io/qwik";
import styles from "./rules.module.css";

export const GETTING_STARTED_STEPS = [
  {
    message: "You have 2 minutes to classify as many images as you can.",
  },
  {
    message:
      "For each image shown select the <b>Cake</b> button if you think it shows a cake, or the <b>Not Cake</b> button if it does not.",
      hint: "<img></img>",
  },
  {
    message:
      "Hit <b>Play!</b> above to start."
  }
];

export default component$(() => {
  const gettingStartedStep = useSignal(0);

  return (
    <div class="container container-purple container-center">
      <h2 data-testid="rules-title">
        How to
        <span class="highlight"> play</span>!
      </h2>
      <div class={styles.gettingstarted}>
        <div
          class={styles.intro}
          data-testid="rules-step-message"
          dangerouslySetInnerHTML={
            GETTING_STARTED_STEPS[gettingStartedStep.value].message
          }
        />
        <span
          class={styles.hint}
          dangerouslySetInnerHTML={
            GETTING_STARTED_STEPS[gettingStartedStep.value].hint
          }
        />
      </div>
      {gettingStartedStep.value + 1 < GETTING_STARTED_STEPS.length ? (
        <button data-testid="next-step-button" class="button-dark" onClick$={() => gettingStartedStep.value++}>
          Continue with Step {gettingStartedStep.value + 2} /{""}
          {GETTING_STARTED_STEPS.length}
        </button>
      ) : (
        <button
          data-testid="restart-button"
          class="button-dark"
          onClick$={() => (gettingStartedStep.value = 0)}
        >
          Re-Start
        </button>
        
      )}
    </div>
  );
});
