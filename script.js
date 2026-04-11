// ================= CONFIG =================
const CHANNEL_ID = "YOUR_CHANNEL_ID";
const WRITE_API_KEY = "YOUR_WRITE_API_KEY";

// ================= FETCH DATA =================
async function getData() {
  try {
    let res = await fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json`);
    let data = await res.json();

    let soil = parseInt(data.field1);
    let temp = parseFloat(data.field2);
    let hum = parseFloat(data.field3);

    // Display values
    document.getElementById("soil").innerText = soil;
    document.getElementById("temp").innerText = temp + " °C";
    document.getElementById("hum").innerText = hum + " %";

    // ===== Plant Status =====
    let status = "";
    let condition = "";
    let alertMsg = "";

    if (soil > 700) {
      status = "💧 Needs Water";
      condition = "Dry";
      alertMsg = "⚠️ Soil is too dry!";
    }
    else if (soil >= 400) {
      status = "🌿 Healthy";
      condition = "Good";
      alertMsg = "";
    }
    else {
      status = "⚠️ Overwatered";
      condition = "Too Wet";
      alertMsg = "⚠️ Too much water!";
    }

    document.getElementById("status").innerText = status;
    document.getElementById("condition").innerText = "🌿 Current Condition: " + condition;
    document.getElementById("alertBox").innerText = alertMsg;

    let now = new Date();
    document.getElementById("updated").innerText =
      "⏱ Last Updated: " + now.toLocaleTimeString();

  } catch (error) {
    console.log("Error:", error);
  }
}

// Run continuously
setInterval(getData, 5000);
getData();


// ================= NAVIGATION =================
function goToDetails() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("detailsPage").style.display = "block";
  document.getElementById("controlPage").style.display = "none";
}

function goToControl() {
  document.getElementById("mainPage").style.display = "none";
  document.getElementById("detailsPage").style.display = "none";
  document.getElementById("controlPage").style.display = "block";
}

function goHome() {
  document.getElementById("mainPage").style.display = "block";
  document.getElementById("detailsPage").style.display = "none";
  document.getElementById("controlPage").style.display = "none";
}


// ================= GRAPH + ANALYSIS =================
function showGraph(type) {

  let graph = document.getElementById("graphArea");
  let value = document.getElementById("valueArea");
  let suggestion = document.getElementById("suggestionArea");

  // Reset animation
  graph.classList.remove("fade-in");
  value.classList.remove("fade-in");
  suggestion.classList.remove("fade-in");
  void graph.offsetWidth;

  // ===== SOIL =====
  if (type === "soil") {

    graph.innerHTML = `
      <iframe width="450" height="260"
      src="https://thingspeak.com/channels/${CHANNEL_ID}/charts/1">
      </iframe>
    `;

    let soil = parseInt(document.getElementById("soil").innerText);

    if (soil > 700) {
      value.innerHTML = `🔢 Soil: ${soil} <br> 📍 Status: Dry`;
      suggestion.innerHTML = "💧 Water the plant";
      suggestion.style.background = "#ffcdd2";
    }
    else if (soil >= 400) {
      value.innerHTML = `🔢 Soil: ${soil} <br> 📍 Status: Good`;
      suggestion.innerHTML = "✅ No suggestion needed";
      suggestion.style.background = "#c8e6c9";
    }
    else {
      value.innerHTML = `🔢 Soil: ${soil} <br> 📍 Status: Too Wet`;
      suggestion.innerHTML = "⚠️ Reduce watering";
      suggestion.style.background = "#bbdefb";
    }
  }

  // ===== TEMPERATURE =====
  else if (type === "temp") {

    graph.innerHTML = `
      <iframe width="450" height="260"
      src="https://thingspeak.com/channels/${CHANNEL_ID}/charts/2">
      </iframe>
    `;

    let temp = parseFloat(document.getElementById("temp").innerText);

    if (temp > 35) {
      value.innerHTML = `🔢 Temp: ${temp} °C <br> 📍 Status: Too Hot`;
      suggestion.innerHTML = "🌡 Move plant to shade";
      suggestion.style.background = "#ffcdd2";
    }
    else if (temp >= 20) {
      value.innerHTML = `🔢 Temp: ${temp} °C <br> 📍 Status: Normal`;
      suggestion.innerHTML = "✅ No suggestion needed";
      suggestion.style.background = "#c8e6c9";
    }
    else {
      value.innerHTML = `🔢 Temp: ${temp} °C <br> 📍 Status: Too Cold`;
      suggestion.innerHTML = "❄️ Keep plant warm";
      suggestion.style.background = "#bbdefb";
    }
  }

  // ===== HUMIDITY =====
  else if (type === "hum") {

    graph.innerHTML = `
      <iframe width="450" height="260"
      src="https://thingspeak.com/channels/${CHANNEL_ID}/charts/3">
      </iframe>
    `;

    let hum = parseFloat(document.getElementById("hum").innerText);

    if (hum < 40) {
      value.innerHTML = `🔢 Humidity: ${hum}% <br> 📍 Status: Low`;
      suggestion.innerHTML = "💧 Increase humidity";
      suggestion.style.background = "#ffcdd2";
    }
    else if (hum <= 70) {
      value.innerHTML = `🔢 Humidity: ${hum}% <br> 📍 Status: Normal`;
      suggestion.innerHTML = "✅ No suggestion needed";
      suggestion.style.background = "#c8e6c9";
    }
    else {
      value.innerHTML = `🔢 Humidity: ${hum}% <br> 📍 Status: High`;
      suggestion.innerHTML = "⚠️ Reduce moisture";
      suggestion.style.background = "#bbdefb";
    }
  }

  // ===== OVERALL =====
  else if (type === "health") {

    graph.innerHTML = `<h3>🌿 Overall Plant Status</h3>`;

    let status = document.getElementById("status").innerText;

    value.innerHTML = `📍 Status: ${status}`;

    if (status.includes("Healthy")) {
      suggestion.innerHTML = "✅ No suggestion needed";
      suggestion.style.background = "#c8e6c9";
    }
    else if (status.includes("Water")) {
      suggestion.innerHTML = "💧 Water the plant";
      suggestion.style.background = "#ffcdd2";
    }
    else {
      suggestion.innerHTML = "⚠️ Adjust watering";
      suggestion.style.background = "#bbdefb";
    }
  }

  // Add animation
  graph.classList.add("fade-in");
  value.classList.add("fade-in");
  suggestion.classList.add("fade-in");
}


// ================= PUMP CONTROL =================
function turnPumpOn() {
  fetch(`https://api.thingspeak.com/update?api_key=${WRITE_API_KEY}&field4=1`);
  document.getElementById("pumpStatus").innerText = "Status: ON 💧";
}

function turnPumpOff() {
  fetch(`https://api.thingspeak.com/update?api_key=${WRITE_API_KEY}&field4=0`);
  document.getElementById("pumpStatus").innerText = "Status: OFF ⛔";
}

