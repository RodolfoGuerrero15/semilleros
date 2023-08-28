const express = require("express");
const db = require('./db') // Módulo para interactuar con MySQL
const app = express();
const port = 3000;
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.1.7");
const bodyParser = require('body-parser');
const session= require('express-session')
const path= require('path')
const ejs= require('ejs')

client.on("connect", () => {
  client.subscribe("Temperatura", (err) => {
    if (!err) {
      client.publish("Temperatura", "Hello mqtt");
    }
  });
  client.subscribe("semillero1", (err) => {
    if (err) {
      console.log("error al suscribirse");
    }
  });
});

client.on("message", (topic, message) => {
  // message is Buffer
  const data = message.toString();
  console.log("Mensaje recibido: " + data + "del tópico " + topic);
  if (topic == "semillero1") {
    jsonData = JSON.parse(data);
    console.log("jsondata" + jsonData);
    const insertQuery =
      "INSERT INTO datos_semillero1 (temperatura, humedad_rel, luminosidad, humedad_suelo) VALUES (?, ?, ?, ?)";

    const values = [
      jsonData.temperatura,
      jsonData.humedad_rel,
      jsonData.luminosidad,
      jsonData.humedad_suelo,
    ];

    db.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error("Error al insertar el JSON:", error);
      } else {
        console.log("JSON insertado exitosamente");
      }

      
    });
  }
});
// Configuración de conexión a la base de datos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname,'src', 'views'));
app.set('view engine', 'ejs');
app.use(session({ secret: 'secreto', resave: true, saveUninitialized: true }));
//rutas
app.use(require('./src/routes/app'));
// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
