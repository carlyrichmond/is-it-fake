import { useState } from 'react'

import'./Rules.css';

const GETTING_STARTED_STEPS = [
  {
    message: "Classify the 10 provided images as quickly as you can.",
  },
  {
    message:
      "For each image shown select the <b>Cake</b> button if you think it shows a cake, or the <b>Not Cake</b> button if it does not.",
      hint: "<img></img>", // TODO get screenshot when built
  },
  {
    message:
      "Hit <b>Play!</b> above to start."
  }
];

function Rules() {
  const [gettingStartedStep, setGettingStartedStep] = useState(0)

  return (
    <>
      <div className="container container-purple container-center">
      <h2 data-testid="rules-title">
        How to
        <span className="highlight"> play</span>!
      </h2>
      <div className="gettingstarted">
        <div
          className="intro"
          data-testid="rules-step-message"
          dangerouslySetInnerHTML={
            { __html: GETTING_STARTED_STEPS[gettingStartedStep].message }
          }
        />
        <span
          className="hint"
          dangerouslySetInnerHTML={
            { __html: GETTING_STARTED_STEPS[gettingStartedStep].hint }
          }
        />
      </div>
      {gettingStartedStep + 1 < GETTING_STARTED_STEPS.length ? (
        <button data-testid="next-step-button" className="button-dark" onClick={() => setGettingStartedStep(gettingStartedStep + 1)}>
          Continue with Step {gettingStartedStep + 2} /{""}
          {GETTING_STARTED_STEPS.length}
        </button>
      ) : (
        <button
          data-testid="restart-button"
          className="button-dark"
          onClick={() => (setGettingStartedStep(0))}>
          Re-Start
        </button>
        
      )}
    </div>
    </>
  )
}

export default Rules
