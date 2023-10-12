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
    console.log(numero)
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
      
      res.json(resWithLocalTime);
    });
  }

  module.exports={
    main,
    obtenerDatos
  }