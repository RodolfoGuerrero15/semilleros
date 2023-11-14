const express = require("express");
const db = require('./db') // Módulo para interactuar con MySQL
const app = express();
const port = 3000;
const mqtt = require("mqtt");
// const client= mqtt.connect('mqtt://broker.emqx.io')
 const client = mqtt.connect("mqtt://34.233.122.239",{ 
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
  client.subscribe("gateway/#", (err) => {
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
  const id_topic=parseInt(ultimoCaracter);
  if(topic.startsWith("semilleros")){
    jsonData = JSON.parse(data);
    console.log("jsondata" + jsonData);
    const insertQuery =
      "INSERT INTO mediciones (id_semillero,temperatura, humedad_rel, luminosidad, humedad_suelo) VALUES (?,?, ?, ?, ?)";
    
   

    db.query('SELECT id from semilleros where id_gateway= ? AND id_local= ? ',[jsonData.id_gateway,id_topic],(err,results)=>{
      if(err){
        console.log(err)
      }
      else{
        console.log(results)
        id=results[0].id;
      }
      const values = [
        id,
        jsonData.temperatura,
        jsonData.humedad_rel,
        jsonData.luminosidad,
        jsonData.humedad_suelo,
      ];
      const bat=jsonData.bat;
      db.query(insertQuery, values, (error, results) => {
        if (error) {
          console.error("Error al insertar el JSON:", error);
        } else {
          console.log("JSON insertado exitosamente");
        }
        db.query("UPDATE semilleros SET bateria = ? where id= ?",[bat,values[0]],(error,results)=>{
          if(error){
            console.error("Error al actualizar porcentaje de bateria");
          }
          else{
            console.log("Bateria actualizada satisfactoriamente")
          }
        })
      
      });
    })

    
    
  }
  else if(topic.startsWith("gateway")){
    idgateway=parseInt(message);
    const SelectQuery =
      "SELECT id,hum_limite,temp_lim from semilleros where id_gateway = ?";
      db.query(SelectQuery,idgateway,(err,results)=>{
        if(err){
          console.error("Error al obtener datos");
          console.log(err);
        }
        else{
          
          const cadena=JSON.stringify(results);
          const topicoenvio="setpoints/"+ message;
          console.log(cadena);
          console.log(topicoenvio);
          client.publish(topicoenvio,cadena);
        }    
      })
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
const actualizarSemillerosEncendidos=()=>{
  const obtenerQuery=`SELECT id_semillero, MAX(fecha_hora) AS ultima_fecha_hora
  FROM mediciones
  GROUP BY id_semillero `
  const actualizarQuery='UPDATE semilleros SET estado_semillero= ? where id= ?'
  db.query(obtenerQuery,(err,results)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(results);
      const resWithLocalTime = results.map((item) => {
        if (item.ultima_fecha_hora) {
          dateParsed = new Date(item.ultima_fecha_hora.toString());
          return {
            ...item,
            ultima_fecha_hora: (dateTime = DateTime.fromJSDate(dateParsed).toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )),
          };
        }
        return item;
      });
      resWithLocalTime.forEach((result)=>{
        const id_semillero=result.id_semillero;
        horaActual=new Date();
        horaActualFormateada= DateTime.fromJSDate(horaActual).toFormat(
          "yyyy-MM-dd HH:mm:ss"
        )
        //const diferenciaEnMinutos = horaActualFormateada.diff(result.ultima_fecha_hora, 'minutes').minutes;
        const hora1 = DateTime.fromFormat(result.ultima_fecha_hora, 'yyyy-MM-dd HH:mm:ss');
        const hora2 = DateTime.fromFormat(horaActualFormateada, 'yyyy-MM-dd HH:mm:ss');

// Verificar si una hora es exactamente 10 minutos mayor que la otra
        const diferenciaEnMinutos = hora2.diff(hora1).as('minutes');
        if(diferenciaEnMinutos<10){
          estado_semillero='ON';
        }
        else{
          estado_semillero='OFF'
        }
        db.query(actualizarQuery,[estado_semillero,id_semillero],(err,results)=>{
          if(err){
            console.log(err);
          }
          else{
            console.log("Estado Actualizado")
          }
        })
      })
    }
  })
}
const intervalo = setInterval(actualizarRiego, 60000); // cada minuto
const actualizarEncendido = setInterval(actualizarSemillerosEncendidos, 60000*10); // cada 10 minutos
