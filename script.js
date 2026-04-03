async function getData() {
  try {
    let response = await fetch("https://api.thingspeak.com/channels/3325239/feeds/last.json");
    let data = await response.json();

    let soil = data.field1;
    let temp = data.field2;
    let hum = data.field3;

    // Show values
    document.getElementById("soil").innerText = soil;
    document.getElementById("temp").innerText = temp + " °C";
    document.getElementById("hum").innerText = hum + " %";

    // 🌱 Plant Status Logic
    let status = "";

    if (soil > 700) {
      status = "💧 Needs Water";
    } else if (soil > 400) {
      status = "🌿 Healthy";
    } else {
      status = "⚠️ Overwatered";
    }

    document.getElementById("status").innerText = status;

  } catch (error) {
    console.log("Error:", error);
  }
}

// Run every 5 seconds
setInterval(getData, 5000);

// Run immediately
getData();
