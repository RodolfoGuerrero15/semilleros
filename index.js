const express = require("express");
const mysql = require("mysql2/promise"); // Módulo para interactuar con MySQL
const app = express();
const port = 3000;
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://192.168.1.5");
const bodyParser = require('body-parser');

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

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta de login
app.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
      // Consultar la base de datos para verificar las credenciales
      const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
      const [rows, fields] = await db.execute(query, [username, password]);

      if (rows.length > 0) {
          return res.status(200).json({ message: 'Autenticación exitosa' });
      } else {
          return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
  } catch (error) {
      console.error('Error al consultar la base de datos:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
