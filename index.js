const express = require("express");
const db = require('./db') // Módulo para interactuar con MySQL
const app = express();
const port = 3000;
const mqtt = require("mqtt");
// const client= mqtt.connect('mqtt://broker.emqx.io')
 const client = mqtt.connect("mqtt://3.90.250.198",{ 
   username: 'Rodolfo',
   password: 'semilleros'
 });
const bodyParser = require('body-parser');
const session= require('express-session')
const path= require('path')
const ejs= require('ejs')
const { DateTime } = require("luxon");

client.on("connect", () => {
  console.log("Conectado");
  client.subscribe("semilleros/#", (err) => {
    if (err) {
      console.log("error al suscribirse");
    }
  });
  
});

client.on("message", (topic, message) => {
  // message is Buffer
  const data = message.toString();
  console.log("Mensaje recibido: " + data + "del tópico " + topic);
  const ultimoCaracter = topic.charAt(topic.length - 1);
  const id=parseInt(ultimoCaracter);
  
    jsonData = JSON.parse(data);
    console.log("jsondata" + jsonData);
    const insertQuery =
      "INSERT INTO mediciones (id_semillero,temperatura, humedad_rel, luminosidad, humedad_suelo) VALUES (?,?, ?, ?, ?)";

    const values = [
      id,
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

function actualizarRiego(){
  const sql = `
    SELECT *
    FROM actuadores
    WHERE tipo="riego"
  `;
  const actualizarhora= 'UPDATE actuadores SET prox_hora_riego = ? WHERE id = ? AND tipo = "riego"'
  db.query(sql, (error, results) => {
    if (error) {
        console.error('Error', error);
        
    } else {
        const resWithLocalTime = results.map((item) => {
          if (item.prox_hora_riego) {
            dateParsed = new Date(item.prox_hora_riego.toString());
            return {
              ...item,
              prox_hora_riego: (dateTime = DateTime.fromJSDate(dateParsed).toFormat(
                "yyyy-MM-dd HH:mm:ss"
              )),
            };
          }
          return item;
        });
        horaActual=new Date();
        horaActualFormateada= DateTime.fromJSDate(horaActual).toFormat(
          "yyyy-MM-dd HH:mm:ss"
        )
        resWithLocalTime.forEach((dato)=>{
          if(dato.prox_hora_riego<horaActualFormateada){
            id=dato.id_semillero;
            topico_riego="riego/"+id.toString();
            client.publish(topico_riego,"1");
            console.log(`Regando en semillero ${id}`);
            variable=new Date(dato.prox_hora_riego);
            frecuencia=parseInt(dato.frecuencia);
            variable.setHours(variable.getHours() +frecuencia)
            console.log(`Nueva hora de riego: ${variable}`);
            db.query(actualizarhora, [variable, id], (error, results) => {
              if (error) {
                  console.error('Error al actualizar la fila:', error);
                  
              } else {
                  console.log('Hora de riego actualizada correctamente');
                  
              }
          });
          }
        })
        
        
        
    }
});
}

const intervalo = setInterval(actualizarRiego, 60000); // cada minuto
