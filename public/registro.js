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
  line: {color: '#CB4335'}
};
var humidityTrace = {
  x: [],
  y: [],
  name: "Humedad Relativa",
  mode: "lines+markers",
  type: "line",
  line: {color: '#2874A6'}
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
  line: {color: '#D68910'}
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
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
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

document.addEventListener("DOMContentLoaded", () => {
  Plotly.newPlot(
    temperatureHistoryDiv,
    [temperatureTrace],
    temperatureLayout,
    config
  );
  Plotly.newPlot(humidityHistoryDiv, [humidityTrace], humidityLayout, config);
  Plotly.newPlot(
    soilhumidityHistoryDiv,
    [soilhumidityTrace],
    soilhumidityLayout,
    config
  );
  Plotly.newPlot(
    luminosityHistoryDiv,
    [luminosityTrace],
    luminosityLayout,
    config
  );
});
function initialize_graphic(lineChartDiv,xArray,yArray){
    var data_update = {
      x: [xArray],
      y: [yArray],
    };
    
    Plotly.update(lineChartDiv, data_update);
  }
const dataForm = document.getElementById("formularioRegistro");

dataForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  newTempXArray = [];
  newTempYArray = [];

  newHumidityXArray = [];
  newHumidityYArray = [];

  newSoilhumidityXArray = [];
  newSoilhumidityYArray = [];

  newLuminosityXArray = [];
  newLuminosityYArray = [];

  const id = document.getElementById("id").value;
  const fechaInicio = document.getElementById("fechaHoraInicio").value;
  const fechaFin = document.getElementById("fechaHoraFin").value;
 const mediatemphtml=document.getElementById("mediatempHTML");
 const mediahumrelhtml=document.getElementById("mediahumrelHTML");
 const mediahumhtml=document.getElementById("mediahumHTML");
 const medialumhtml=document.getElementById("medialumHTML");
 const mintemphtml=document.getElementById("mintempHTML");
 const minhumrelhtml=document.getElementById("minhumrelHTML");
 const minhumhtml=document.getElementById("minhumHTML");
 const minlumhtml=document.getElementById("minlumHTML");
 const maxtemphtml=document.getElementById("maxtempHTML");
 const maxhumrelhtml=document.getElementById("maxhumrelHTML");
 const maxhumhtml=document.getElementById("maxhumHTML");
 const maxlumhtml=document.getElementById("maxlumHTML");
  try {
    const response = await fetch("/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, fechaInicio, fechaFin }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      responseData.forEach(medicion=>{
        newTempYArray.push(medicion.temperatura)
        newHumidityYArray.push(medicion.humedad_rel)
        newSoilhumidityYArray.push(medicion.humedad_suelo)
        newLuminosityYArray.push(medicion.luminosidad)
        newTempXArray.push(medicion.fecha_hora)
        newHumidityXArray.push(medicion.fecha_hora)
        newSoilhumidityXArray.push(medicion.fecha_hora)
        newLuminosityXArray.push(medicion.fecha_hora)
      })
      initialize_graphic(temperatureHistoryDiv,newTempXArray,newTempYArray);
      initialize_graphic(humidityHistoryDiv,newHumidityXArray,newHumidityYArray);
      initialize_graphic(soilhumidityHistoryDiv,newSoilhumidityXArray,newSoilhumidityYArray);
      initialize_graphic(luminosityHistoryDiv,newLuminosityXArray,newLuminosityYArray);
      mediaTemp=math.mean(newTempYArray).toFixed(3);
      mediahumrel=math.mean(newHumidityYArray).toFixed(3);
      mediahum=math.mean(newSoilhumidityYArray).toFixed(3);
      medialum=math.mean(newLuminosityYArray).toFixed(3);
      minTemp=math.min(newTempYArray).toFixed(3);
      minhumrel=math.min(newHumidityYArray).toFixed(3);
      minhum=math.min(newSoilhumidityYArray).toFixed(3);
      minlum=math.min(newLuminosityYArray).toFixed(3);
      maxTemp=math.max(newTempYArray).toFixed(3);
      maxhumrel=math.max(newHumidityYArray).toFixed(3);
      maxhum=math.max(newSoilhumidityYArray).toFixed(3);
      maxlum=math.max(newLuminosityYArray).toFixed(3);
      mediatemphtml.innerHTML=mediaTemp+"°C"
      mediahumrelhtml.innerHTML=mediahumrel+"%"
      mediahumhtml.innerHTML=mediahum+"%"
      medialumhtml.innerHTML=medialum+"lux"
      mintemphtml.innerHTML=minTemp+"°C"
      minhumrelhtml.innerHTML=minhumrel+"%"
      minhumhtml.innerHTML=minhum+"%"
      minlumhtml.innerHTML=minlum+"lux"
      maxtemphtml.innerHTML=maxTemp+"°C"
      maxhumrelhtml.innerHTML=maxhumrel+"%"
      maxhumhtml.innerHTML=maxhum+"%"
      maxlumhtml.innerHTML=maxlum+"lux"
      console.log(mediaTemp)
    } else {
      console.error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error en la comunicación con el servidor:", error);
  }
});

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}
