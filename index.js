const express = require("express");
const mysql = require("mysql2/promise"); // Módulo para interactuar con MySQL
const app = express();
const port = 3000;
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.1.5");

const db = mysql.createPool({
  host: "localhost",
  user: "usuario_semilleros",
  password: "semilleros",
  database: "semillero1",
});

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

      db.end(); // Cerrar el pool de conexiones
    });
  }
});
// Configuración de conexión a la base de datos

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

// Ruta para obtener los últimos 10 datos de la tabla desde la base de datos
app.get("/api/ultimos-datos", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id,temperatura FROM datos_semillero1 ORDER BY id DESC LIMIT 10"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los datos." });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
