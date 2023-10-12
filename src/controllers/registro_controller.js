const db = require("../../db");
const { DateTime } = require("luxon");
const registro = (req, res) => {
    if (req.session.loggedin) {
      res.render("registro");
    } else {
      res.redirect("/login");
    }
  }
const actualizarRegistro= (req, res) => {
    const formData = req.body;
    console.log(formData);
    const id = formData.id;
    const fechaInicio = formData.fechaInicio;
    const fechaFin = formData.fechaFin;
    const sql = `
    SELECT *
    FROM mediciones
    WHERE id_semillero = ? AND fecha_hora BETWEEN ? AND ?
  `;
  
  // Ejecuta la consulta
  db.query(sql, [id, fechaInicio, fechaFin], (error, results) => {
    if (error) {
      console.error('Error en la consulta:', error);
    } else {
      
      const resWithLocalTime = results.map((item) => {
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
    }
  });
    
  }
  module.exports={
    registro,
    actualizarRegistro
  }