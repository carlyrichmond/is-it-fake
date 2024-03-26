getClassifications();

async function getClassifications() {
  const imageUrl = document
    .getElementById("coco-ssd-cake-image")
    .getAttribute("src");

  // Get classifications
  const response = await fetch("/coco-ssd/classify", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ imageUrl: imageUrl }),
  });

  const predictions = response.status === 200 ? await response.json() : [];

  var predictionsContainer = document.getElementById("coco-ssd-predictions");

  if (predictions.length == 0) {
    predictionsContainer.innerHTML =
      predictionsContainer.innerHTML + "<span>No predictions available</span>";
    return;
  }

  for (let n = 0; n < predictions.length; n++) {
    // If we are over 66% sure we are sure we classified it right, draw it!
    if (predictions[n].score > 0.66) {
      const p = document.createElement("p");
      p.setAttribute("class", "highlight");
      p.innerText =
        predictions[n].class +
        " : " +
        Math.round(parseFloat(predictions[n].score) * 100) +
        "% confidence";
      p.style =
        "margin-left: " +
        predictions[n].bbox[0] +
        "px; margin-top: " +
        (predictions[n].bbox[1] - 30) +
        "px; width: " +
        (predictions[n].bbox[2] - 10) +
        "px; top: 0; left: 0;";

      const highlighter = document.createElement("div");
      highlighter.setAttribute("class", "highlighter");
      highlighter.style =
        "left: " +
        predictions[n].bbox[0] +
        "px; top: " +
        (predictions[n].bbox[1] - 30) +
        "px; width: " +
        predictions[n].bbox[2] +
        "px; height: " +
        (predictions[n].bbox[3] + 30) +
        "px;";

      predictionsContainer.appendChild(highlighter);
      predictionsContainer.appendChild(p);
    }
  }
}
