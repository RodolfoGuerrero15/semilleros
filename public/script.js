var server,topic,client;
function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      server=data.mqttServer;
      topic=data.mqttTopic;
      console.log(server)
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}

var client = mqtt.connect("ws://192.168.1.7:9001/mqtt", {
  // Reemplaza "tu_servidor_mqtt" con la URL de tu servidor MQTT
  port: 9001,
  protocol: "ws",
  rejectUnauthorized: false, // Opcionalmente, establece a true si no deseas aceptar certificados no confiables
});
// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);
var temperatureHistoryDiv = document.getElementById("temperature-history");
var humidityHistoryDiv = document.getElementById("humidity-history");
var soilhumidityHistoryDiv = document.getElementById("pressure-history");
var luminosityHistoryDiv = document.getElementById("altitude-history");
// History Data
var temperatureTrace = {
  x: [],
  y: [],
  name: "Temperatura",
  mode: "lines+markers",
  type: "line",
};
var humidityTrace = {
  x: [],
  y: [],
  name: "Humedad Relativa",
  mode: "lines+markers",
  type: "line",
};
var soilhumidityTrace = {
  x: [],
  y: [],
  name: "Humedad de suelo",
  mode: "lines+markers",
  type: "line",
};
var luminosityTrace = {
  x: [],
  y: [],
  name: "Luminosidad",
  mode: "lines+markers",
  type: "line",
};

var temperatureLayout = {
  autosize: true,
  title: {
    text: "Temperatura",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var humidityLayout = {
  autosize: true,
  title: {
    text: "Humedad Relativa",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var soilhumidityLayout = {
  autosize: true,
  title: {
    text: "Humedad de suelo",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var luminosityLayout = {
  autosize: true,
  title: {
    text: "Luminosidad",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };
// Will hold the arrays we receive from our BME280 sensor
// Temperature
let newTempXArray = [];
let newTempYArray = [];
// Humidity
let newHumidityXArray = [];
let newHumidityYArray = [];
// Pressure
let newSoilhumidityXArray = [];
let newSoilhumidityYArray = [];
// Altitude
let newLuminosityXArray = [];
let newLuminosityYArray = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

  let temperature = Number(jsonResponse.temperatura).toFixed(2);
  let humidity = Number(jsonResponse.humedad_rel).toFixed(2);
  let soilhumidity = Number(jsonResponse.humedad_suelo).toFixed(2);
  let luminosity = Number(jsonResponse.luminosidad).toFixed(2);

  updateBoxes(temperature, humidity, soilhumidity, luminosity);
  // Update Temperature Line Chart
  updateCharts(
    temperatureHistoryDiv,
    newTempXArray,
    newTempYArray,
    temperature
  );
  // Update Humidity Line Chart
  updateCharts(
    humidityHistoryDiv,
    newHumidityXArray,
    newHumidityYArray,
    humidity
  );
  // Update Pressure Line Chart
  updateCharts(
    soilhumidityHistoryDiv,
    newSoilhumidityXArray,
    newSoilhumidityYArray,
    soilhumidity
  );

  // Update Altitude Line Chart
  updateCharts(
    luminosityHistoryDiv,
    newLuminosityXArray,
    newLuminosityYArray,
    luminosity
  );
}
function updateBoxes(temperature, humidity, soilHumidity, luminosity) {
  let temperatureDiv = document.getElementById("temperature");
  let humidityDiv = document.getElementById("humidity");
  let soilHumidityDiv = document.getElementById("pressure");
  let luminosityDiv = document.getElementById("altitude");

  temperatureDiv.innerHTML = temperature + " C";
  humidityDiv.innerHTML = humidity + " %";
  soilHumidityDiv.innerHTML = soilHumidity + " %";
  luminosityDiv.innerHTML = luminosity + " lux";
}
function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  var today = new Date();
  var now = today.toLocaleString();
  xArray.push(now);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function ActualizarGrafico(grafico,fecha,variable){
    grafico.data.labels.push(fecha);
    grafico.data.datasets.forEach((dataset) => {
      dataset.data.push(variable);
    });
    grafico.update();
}
// const ctx = document.getElementById("GraficoTemperatura");
// const ctx2 = document.getElementById("GraficoHum_rel");
// const ctx3 = document.getElementById("GraficoHumedad_suelo");
// const ctx4 = document.getElementById("GraficoLuminosidad");
// var graphTemp = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: ["Temperatura"],
//     datasets: [
//       {
//         label: "Temperatura",
//         data: [],
//         borderWidth: 1,
//         borderColor: '#009688',
//         backgroundColor: '#009688'
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
// var graphHumedad_rel = new Chart(ctx2, {
//   type: "line",
//   data: {
//     labels: ["Humedad relativa"],
//     datasets: [
//       {
//         label: "Humedad relativa",
//         data: [],
//         borderWidth: 1,
//         borderColor: '#009688',
//         backgroundColor: '#009688'
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
// var graphHumedad_suelo = new Chart(ctx3, {
//   type: "line",
//   data: {
//     labels: ["Humedad de suelo"],
//     datasets: [
//       {
//         label: "Humedad de suelo",
//         data: [],
//         borderWidth: 1,
//         borderColor: '#009688',
//         backgroundColor: '#009688'
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
// var graphLuminosidad = new Chart(ctx4, {
//   type: "line",
//   data: {
//     labels: ["Luminosidad"],
//     datasets: [
//       {
//         label: "Luminosidad",
//         data: [],
//         borderWidth: 1,
//         borderColor: '#009688',
//         backgroundColor: '#009688'
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
client.on("connect", () => {
  console.log("Conexión MQTT exitosa");
  client.subscribe(topic);
});
client.on("message", (topic, message) => {
  const data = message.toString();
  if (topic == "semillero1") {
    jsonData = JSON.parse(data);
    updateSensorReadings(jsonData);
    let Temperatura = jsonData.temperatura;
    let humedad_relativa = jsonData.humedad_rel;
    let Hum_suelo = jsonData.humedad_suelo;
    let luminosidadrecibida = jsonData.luminosidad;
    var today = new Date();
    var now = today.toLocaleString();
    console.log(now);
    ActualizarGrafico(graphTemp,now,Temperatura);
    ActualizarGrafico(graphHumedad_rel,now,humedad_relativa);
    ActualizarGrafico(graphHumedad_suelo,now,Hum_suelo);
    ActualizarGrafico(graphLuminosidad,now,luminosidadrecibida);

  }
});


document.addEventListener("DOMContentLoaded", () => {
  fetchMQTTConnection();
  const obtenerDatosBtn = document.getElementById("obtenerDatos");
  const listaDatos = document.getElementById("listaDatos");
  Plotly.newPlot(
    temperatureHistoryDiv,
    [temperatureTrace],
    temperatureLayout,
    config
  );
  Plotly.newPlot(humidityHistoryDiv, [humidityTrace], humidityLayout, config);
  Plotly.newPlot(soilhumidityHistoryDiv, [soilhumidityTrace], soilhumidityLayout, config);
  Plotly.newPlot(luminosityHistoryDiv, [luminosityTrace], luminosityLayout, config);
  obtenerDatosBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/ultimos-datos");
      const data = await response.json();
      console.log(data);

      listaDatos.innerHTML = ""; // Limpiar la lista antes de añadir los nuevos datos

      data.forEach((dato) => {
        console.log(dato.fecha_hora)
        const li = document.createElement("li");
        li.textContent = `Fecha_hora: ${dato.fecha_hora},    Valor: ${dato.temperatura}`;
        listaDatos.appendChild(li);
      });
    } catch (error) {
      console.error(error);
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const enviarDatosBtn = document.getElementById("enviarDatos");
  const temperaturaInput = document.getElementById("temperaturaInput");
  const humedadRelInput = document.getElementById("humedadRelInput");
  const humedadSueloInput = document.getElementById("humedadSueloInput");
  const luminosidadInput = document.getElementById("luminosidadInput");

  enviarDatosBtn.addEventListener("click", () => {
    const datos = {
      temperatura: parseFloat(temperaturaInput.value),
      "humedad-rel": parseFloat(humedadRelInput.value),
      "humedad-suelo": parseFloat(humedadSueloInput.value),
      luminosidad: parseFloat(luminosidadInput.value),
    };

    // Publica los datos en el tópico MQTT
    client.publish("datos_semillero1", JSON.stringify(datos));

    // Limpia los inputs después de enviar los datos
    temperaturaInput.value = "";
    humedadRelInput.value = "";
    humedadSueloInput.value = "";
    luminosidadInput.value = "";
  });

  // ... (código para suscribirse y mostrar datos recibidos en la interfaz de usuario)
});
