async function getData() {
  try {
    let response = await fetch("https://api.thingspeak.com/channels/273306227/feeds/last.json");
    let data = await response.json();

    let soil = data.field1;
    let temp = data.field2;
    let hum = data.field3;

    // Display values
    document.getElementById("soil").innerText = soil;
    document.getElementById("temp").innerText = temp + " °C";
    document.getElementById("hum").innerText = hum + " %";

    // 🌿 Plant Status Logic
    let status = "";
    let condition = "";
    let alertMsg = "";

  if (soil > 700) {
  suggestion.innerHTML = "💧 Soil is dry → Water the plant";
  suggestion.style.background = "#ffcdd2";  // light red
  suggestion.style.color = "#b71c1c";       // dark red
} 
else if (soil > 400) {
  suggestion.innerHTML = "🌿 Soil is healthy → No action needed";
  suggestion.style.background = "#c8e6c9";  // light green
  suggestion.style.color = "#1b5e20";       // dark green
} 
else {
  suggestion.innerHTML = "⚠️ Too much water → Reduce watering";
  suggestion.style.background = "#bbdefb";  // light blue
  suggestion.style.color = "#0d47a1";       // dark blue
}


    // Show status
    document.getElementById("status").innerText = status;

    // Show insight
    document.getElementById("condition").innerText = "🌿 Current Condition: " + condition;

    // Show alert
    document.getElementById("alertBox").innerText = alertMsg;

    // Show last updated time
    let now = new Date();
    document.getElementById("updated").innerText =
      "⏱ Last Updated: " + now.toLocaleTimeString();

  } catch (error) {
    console.log("Error:", error);
  }
}

// Run every 5 seconds
setInterval(getData, 5000);

// Run once
getData();
function goToDetails() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("detailsPage").style.display = "block";
}

function goHome() {
  document.getElementById("mainPage").style.display = "block";
  document.getElementById("detailsPage").style.display = "none";
}
function showGraph(type) {
  let graph = document.getElementById("graphArea");

  if (type === "soil") {
    graph.innerHTML = `
      <iframe width="450" height="260"
      src="https://thingspeak.com/channels/273306227/charts/1">
      </iframe>
    `;
  }
}


