var topico;
var idsemillero=0;
var client = mqtt.connect("ws://174.129.115.160:9001/mqtt", {
  // Reemplaza "tu_servidor_mqtt" con la URL de tu servidor MQTT
  username: 'Rodolfo',
  password: 'semilleros',
  port: 9001,
  protocol: "ws",
  rejectUnauthorized: false, // Opcionalmente, establece a true si no deseas aceptar certificados no confiables
});

client.on("connect", () => {
  console.log("Conexión MQTT exitosa");
  client.subscribe("semilleros/#");
});
client.on("message", (topic, message) => {
  const data = message.toString();
  if (topic == topico) {
    jsonData = JSON.parse(data);
    updateSensorReadings(jsonData);
    // let Temperatura = jsonData.temperatura;
    // let humedad_relativa = jsonData.humedad_rel;
    // let Hum_suelo = jsonData.humedad_suelo;
    // let luminosidadrecibida = jsonData.luminosidad;
    // var today = new Date();
    // var now = today.toLocaleString();
    // console.log(now);
    // ActualizarGrafico(graphTemp, now, Temperatura);
    // ActualizarGrafico(graphHumedad_rel, now, humedad_relativa);
    // ActualizarGrafico(graphHumedad_suelo, now, Hum_suelo);
    // ActualizarGrafico(graphLuminosidad, now, luminosidadrecibida);
  }
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
    gridwidth: "2",
    
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

var config = { responsive: true, displayModeBar: true, scrollZoom:true };
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
  // var today = new Date();
  // var now = today.toLocaleString();
  const fechaHoraOriginal = new Date();

// Analiza la cadena en un objeto Date
const fechaHoraObjeto = fechaHoraOriginal.toLocaleString();


// Divide la cadena en fecha y hora
const [fecha, hora] = fechaHoraObjeto.split(', ');

// Divide la fecha en día, mes y año
const [dia, mes, año] = fecha.split('/');

// Reformatea la cadena de fecha y hora en el nuevo formato
const fechaHoraFormateada = `${año}-${mes}-${dia} ${hora}`;

// Formatea la cadena de fecha y hora en el nuevo formato

  xArray.push(fechaHoraFormateada);
  yArray.push(parseFloat(sensorRead));
  console.log(xArray[0])
  console.log(xArray)
  console.log(yArray)
  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function ActualizarGrafico(grafico, fecha, variable) {
  grafico.data.labels.push(fecha);
  grafico.data.datasets.forEach((dataset) => {
    dataset.data.push(variable);
  });
  grafico.update();
}


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
// Obtener una referencia al botón y al input para seleccionar semillero
const semselectionButton = document.getElementById("semselection");
const semilleroInput = document.getElementById("semillero");
function initialize_graphic(lineChartDiv,xArray,yArray){
  var data_update = {
    x: [xArray],
    y: [yArray],
  };
  
  Plotly.update(lineChartDiv, data_update);
}

semselectionButton.addEventListener("click", function () {
  idsemillero=semilleroInput.value
  newTempXArray = [];
  newTempYArray = [];

  newHumidityXArray = [];
  newHumidityYArray = [];

  newSoilhumidityXArray = [];
  newSoilhumidityYArray = [];

  newLuminosityXArray = [];
  newLuminosityYArray = [];
  const semilleroValue = semilleroInput.value.toString();
  topico = "semilleros/" + semilleroValue;
  console.log(topico);
  // Realiza la petición GET usando fetch
  fetch(`/obtenerdatos?id=${semilleroValue}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json(); // o .text() si esperas una respuesta en texto
    })
    .then((data) => {
      // Maneja la respuesta del servidor
      data.forEach(medicion=>{
        newTempYArray.push(medicion.temperatura)
        newHumidityYArray.push(medicion.humedad_rel)
        console.log(medicion.fecha_hora)
        newSoilhumidityYArray.push(medicion.humedad_suelo)
        newLuminosityYArray.push(medicion.luminosidad)
        newTempXArray.push(medicion.fecha_hora)
        newHumidityXArray.push(medicion.fecha_hora)
        newSoilhumidityXArray.push(medicion.fecha_hora)
        newLuminosityXArray.push(medicion.fecha_hora)
      })
      updateBoxes(newTempYArray[0],newHumidityYArray[0],newSoilhumidityYArray[0],newLuminosityYArray[0]);
      initialize_graphic(temperatureHistoryDiv,newTempXArray,newTempYArray);
      initialize_graphic(humidityHistoryDiv,newHumidityXArray,newHumidityYArray);
      initialize_graphic(soilhumidityHistoryDiv,newSoilhumidityXArray,newSoilhumidityYArray);
      initialize_graphic(luminosityHistoryDiv,newLuminosityXArray,newLuminosityYArray);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log("Valor del input:", semilleroValue);
  
});

const riegoForm = document.getElementById("riegoForm");
const frecuenciaHTML= document.getElementById('frecuenciaHTML');
const RiegoHTML= document.getElementById('HoraRiego');
const errorRiego=document.getElementById('errorRiego')

riegoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = idsemillero;
  console.log(id)
  if(idsemillero==0){
    //escribir error
  }
  const fechaHora = document.getElementById("fechaHora").value;
  const frecuencia = document.getElementById("frecuencia").value;
  console.log(fechaHora)
  
  try {
    const response = await fetch("/programarRiego", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, fechaHora,frecuencia }),
    });

    if (response.ok) {
      const responseData = await response.json();
      if(responseData.error){
        errorRiego.innerHTML="La hora seleccionada ya ha pasado"
      }else{
        frecuenciaHTML.innerHTML=frecuencia;
        RiegoHTML.innerHTML=fechaHora;
      }
      
    } else {
      console.error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error en la comunicación con el servidor:", error);
  }
});

const tempForm = document.getElementById("tempForm");


tempForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const id = idsemillero;
  const temperaturalim = document.getElementById("temperaturalim").value;
  const humedadlim = document.getElementById("humedadlim").value;
  const topicotemp='temperatura/'+id.toString();
  const topicohum='humedad/'+id.toString();
  client.publish(topicotemp,temperaturalim);
  client.publish(topicohum,humedadlim);
  temperaturaHTML.innerHTML=temperaturalim;
  humedadHTML.innerHTML=humedadlim;
  try {
    const response = await fetch("/modificarTemp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, temperaturalim,humedadlim }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData.message);
    } else {
      console.error("Error en la respuesta del servidor");
    }
  } catch (error) {
    console.error("Error en la comunicación con el servidor:", error);
  }
});

const refreshButton = document.getElementById('refreshButton');

// Agrega un controlador de eventos al botón que se activará cuando se haga clic.
refreshButton.addEventListener('click', () => {
  // Realiza una solicitud GET a la URL deseada.
  fetch(`/obtenerDatosRiego?id=${idsemillero}`, {
    method: 'GET',
    // Puedes agregar más opciones, como encabezados, según tus necesidades.
  })
  .then(response => {
    if (response.ok) {
      // La solicitud fue exitosa, puedes realizar acciones adicionales aquí si es necesario.
      console.log('Solicitud GET exitosa');
      return response.json();
    } else {
      console.error('Error en la solicitud GET');
    }
  })
  .then((data)=>{
    console.log(data)
    frecuenciaHTML.innerHTML=data[0].frecuencia;
    RiegoHTML.innerHTML=data[0].prox_hora_riego;
  })
  .catch(error => {
    console.error('Error en la solicitud GET:', error);
  });
});
const refreshButton2 = document.getElementById('refreshButton2');
refreshButton2.addEventListener('click', () => {
  // Realiza una solicitud GET a la URL deseada.
  fetch(`/obtenerDatosTemp?id=${idsemillero}`, {
    method: 'GET',
    // Puedes agregar más opciones, como encabezados, según tus necesidades.
  })
  .then(response => {
    if (response.ok) {
      // La solicitud fue exitosa, puedes realizar acciones adicionales aquí si es necesario.
      console.log('Solicitud GET exitosa');
      return response.json();
    } else {
      console.error('Error en la solicitud GET');
    }
  })
  .then((data)=>{
    console.log(data)
    temperaturaHTML.innerHTML=data[0].temp_lim;
    humedadHTML.innerHTML=data[0].hum_limite;
  })
  .catch(error => {
    console.error('Error en la solicitud GET:', error);
  });
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
