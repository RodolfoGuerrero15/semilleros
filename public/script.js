var client = mqtt.connect("ws://192.168.1.5:9001/mqtt", {
  // Reemplaza "tu_servidor_mqtt" con la URL de tu servidor MQTT
  port: 9001,
  protocol: "ws",
  rejectUnauthorized: false, // Opcionalmente, establece a true si no deseas aceptar certificados no confiables
});
function ActualizarGrafico(grafico,fecha,variable){
    grafico.data.labels.push(fecha);
    grafico.data.datasets.forEach((dataset) => {
      dataset.data.push(variable);
    });
    grafico.update();
}
const ctx = document.getElementById("GraficoTemperatura");
const ctx2 = document.getElementById("GraficoHum_rel");
const ctx3 = document.getElementById("GraficoHumedad_suelo");
const ctx4 = document.getElementById("GraficoLuminosidad");
var graphTemp = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Temperatura"],
    datasets: [
      {
        label: "Temperatura",
        data: [],
        borderWidth: 1,
        borderColor: '#009688',
        backgroundColor: '#009688'
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
var graphHumedad_rel = new Chart(ctx2, {
  type: "line",
  data: {
    labels: ["Humedad relativa"],
    datasets: [
      {
        label: "Humedad relativa",
        data: [],
        borderWidth: 1,
        borderColor: '#009688',
        backgroundColor: '#009688'
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
var graphHumedad_suelo = new Chart(ctx3, {
  type: "line",
  data: {
    labels: ["Humedad de suelo"],
    datasets: [
      {
        label: "Humedad de suelo",
        data: [],
        borderWidth: 1,
        borderColor: '#009688',
        backgroundColor: '#009688'
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
var graphLuminosidad = new Chart(ctx4, {
  type: "line",
  data: {
    labels: ["Luminosidad"],
    datasets: [
      {
        label: "Luminosidad",
        data: [],
        borderWidth: 1,
        borderColor: '#009688',
        backgroundColor: '#009688'
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
client.on("connect", () => {
  console.log("Conexión MQTT exitosa");
  client.subscribe("semillero1");
});
client.on("message", (topic, message) => {
  const data = message.toString();
  if (topic == "semillero1") {
    jsonData = JSON.parse(data);

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
  const obtenerDatosBtn = document.getElementById("obtenerDatos");
  const listaDatos = document.getElementById("listaDatos");

  obtenerDatosBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/ultimos-datos");
      const data = await response.json();
      console.log(data);

      listaDatos.innerHTML = ""; // Limpiar la lista antes de añadir los nuevos datos

      data.forEach((dato) => {
        const li = document.createElement("li");
        li.textContent = `ID: ${dato.id}, Valor: ${dato.temperatura}`;
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
