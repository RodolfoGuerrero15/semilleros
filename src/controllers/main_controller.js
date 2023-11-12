const db = require("../../db");
const { DateTime } = require("luxon");

const main= (req, res) => {
    if (req.session.loggedin) {
      res.render("main");
    } else {
      res.redirect("/login");
    }
  }

const obtenerDatos=(req, res) => {
    const numero = req.query.id;
    
    const consulta = 'SELECT * FROM mediciones WHERE id_semillero = ? ORDER BY id DESC LIMIT 5';
  
    // Ejecutar la consulta
    db.query(consulta, [numero], (error, resultados) => {
      if (error) {
        console.error('Error en la consulta a la base de datos: ', error);
        res.status(500).json({ error: 'Error en el servidor' });
        return;
      }
      const resWithLocalTime = resultados.map((item) => {
        if (item.fecha_hora) {
          dateParsed = new Date(item.fecha_hora.toString());
          return {
            ...item,
            fecha_hora: (dateTime = DateTime.fromJSDate(dateParsed).toFormat(
              "yyyy-MM-dd HH:mm:ss"
            )),
          };
        }
        return item;
      });
      
      
      res.json(resWithLocalTime.reverse());
    });
  }
  const programarRiego= (req,res)=>{
      const data=req.body
      id=data.id
      horaRiego=data.fechaHora
      frecuencia=data.frecuencia;
      console.log(frecuencia)
      const sql = 'UPDATE actuadores SET prox_hora_riego = ?, frecuencia = ? WHERE id = ? AND tipo = "riego"';
      db.query(sql, [horaRiego,frecuencia, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la fila:', error);
            res.status(500).json({ message: 'Error en la base de datos' });
        } else {
            console.log('Fila actualizada correctamente');
            res.status(200).json({ message: 'Fila actualizada correctamente' });
        }
    });

  }
  const obtenerDatosRiego=(req,res)=>{
    const numero = req.query.id;
    
    const consulta = 'SELECT prox_hora_riego,frecuencia FROM actuadores WHERE id_semillero = ? AND tipo = "riego" ';
  
    // Ejecutar la consulta
    db.query(consulta, [numero], (error, resultados) => {
      if (error) {
        console.error('Error en la consulta a la base de datos: ', error);
        res.status(500).json({ error: 'Error en el servidor' });
        return;
      }
      const resWithLocalTime = resultados.map((item) => {
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
      console.log(resWithLocalTime)
      res.json(resWithLocalTime);
    });
  }
  const obtenerDatosTemp=(req,res)=>{
    const numero = req.query.id;
    
    const consulta = 'SELECT temp_lim, hum_limite FROM semilleros WHERE id = ?  ';
  
    // Ejecutar la consulta
    db.query(consulta, [numero], (error, resultados) => {
      if (error) {
        console.error('Error en la consulta a la base de datos: ', error);
        res.status(500).json({ error: 'Error en el servidor' });
        return;
      }
      console.log(resultados)
      res.json(resultados);
    });
  }
  const actualizarTemp=(req,res)=>{
      const data=req.body
      id=data.id
      temperatura=data.temperaturalim;
      humedad=data.humedadlim;
      console.log(data)
      const sql = 'UPDATE semilleros SET temp_lim = ? , hum_limite= ? WHERE id = ? ';
      db.query(sql, [temperatura,humedad, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar la fila:', error);
            res.status(500).json({ message: 'Error en la base de datos' });
        } else {
            console.log('Fila actualizada correctamente');
            res.status(200).json({ message: 'Fila actualizada correctamente' });
        }
    });
  }
  module.exports={
    main,
    obtenerDatos,
    programarRiego,
    obtenerDatosRiego,
    actualizarTemp,
    obtenerDatosTemp
  }