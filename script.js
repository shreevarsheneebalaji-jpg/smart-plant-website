// ===== CONFIG =====
const channelID = "273306227";
const readAPI = "3637PZ8RYHJMV7G1";
const writeAPI = "F261E1E08O9YKNNU";

// ===== ELEMENTS =====
const soilValue = document.getElementById("soil");
const tempValue = document.getElementById("temp");
const humValue = document.getElementById("hum");
const predictionText = document.getElementById("prediction");

let alertShown = false;
let pumpOn = false;

// ===== FETCH DATA =====
async function getData() {
  const res = await fetch(
    `https://api.thingspeak.com/channels/${273306227}/feeds.json?api_key=${F261E1E08O9YKNNU}&results=5`
  );

  const data = await res.json();
  const feeds = data.feeds;
  let latest = feeds[feeds.length - 1];

  let soil = Number(latest.field1);
  let temp = Number(latest.field2);
  let hum = Number(latest.field3);

  soilValue.innerText = soil;
  tempValue.innerText = temp;
  humValue.innerText = hum;

  // HEALTH
  let health = 0;
  if (soil >= 400 && soil <= 700) health += 40;
  if (temp >= 20 && temp <= 35) health += 30;
  if (hum >= 40 && hum <= 70) health += 30;

  document.getElementById("healthScore").innerText = health + "%";

  document.querySelector(".progress-circle").style.background =
    `conic-gradient(#4caf50 ${health}%, #ddd ${health}%)`;

  // BACKGROUND
  if (soil > 700) {
    document.body.style.background =
      "linear-gradient(to right, #ff9a9e, #fecfef)";
  } else if (soil < 400) {
    document.body.style.background =
      "linear-gradient(to right, #a1c4fd, #c2e9fb)";
  } else {
    document.body.style.background =
      "linear-gradient(to right, #d4fc79, #96e6a1)";
  }

  // ALERT
  if (soil > 700 && !alertShown) {
    showAlert("⚠️ Soil is too dry!");
    alertShown = true;
  }
  if (soil <= 700) alertShown = false;

  // PREDICTION
  if (feeds.length >= 3) {
    let trend = Number(feeds[0].field1) - Number(feeds[2].field1);

    if (trend > 50)
      predictionText.innerText = "⚠️ Soil drying fast!";
    else if (trend < -50)
      predictionText.innerText = "💧 Soil getting wet!";
    else
      predictionText.innerText = "✅ Stable condition";
  }
}

// ===== ALERT FUNCTION =====
function showAlert(msg) {
  let box = document.getElementById("customAlert");
  box.innerText = msg;
  box.style.display = "block";
  setTimeout(() => (box.style.display = "none"), 3000);
}

// ===== PUMP CONTROL =====
function togglePump() {
  pumpOn = !pumpOn;

  let btn = document.getElementById("pumpBtn");
  let status = document.getElementById("pumpStatus");

  if (pumpOn) {
    btn.innerText = "Turn OFF";
    btn.classList.remove("off");
    status.innerText = "Status: ON ✅";
    sendPump(1);
  } else {
    btn.innerText = "Turn ON";
    btn.classList.add("off");
    status.innerText = "Status: OFF ❌";
    sendPump(0);
  }
}

function sendPump(val) {
  fetch(
    `https://api.thingspeak.com/update?api_key=${F261E1E08O9YKNNU}&field4=${val}`
  );
}

// ===== AUTO REFRESH =====
setInterval(getData, 10000);
getData();



