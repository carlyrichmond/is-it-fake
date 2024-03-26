getClassifications();

async function getClassifications() {
    const imageUrl = document.getElementById("mobilenet-image").getAttribute('src');
    
    // Get classifications
    const response = await fetch("/mobilenet/classify", 
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method: "POST",
        body: JSON.stringify({ imageUrl: imageUrl })
    });

    const predictions = response.status === 200 ? await response.json() : [];

    var predictionsContainer = document.getElementById("mobilenet-predictions");

    if (predictions.length > 0) {
        predictionsContainer.innerHTML = predictions.map((prediction) => {
            return `<span class="prediction" key=${prediction.className}>
                <span class="highlight classifer">${prediction.className}</span> probability : ${prediction.probability.toPrecision(4)}</span>`
        }) // Join to remove unnecessary "," characters
        .join(' ');
    } else {
        predictionsContainer.innerHTML = "<span>No predictions available</span>";
    }
}