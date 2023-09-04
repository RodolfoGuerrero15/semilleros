const express = require('express');
const router = express.Router();
const db = require('../../db')
const { DateTime } = require('luxon');
router.get('/', (req, res) => {
    res.redirect('/login');
  });
router.get('/login', (req, res) => {
    res.render('login',{error:''});
  });
  
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // Realiza la consulta a la base de datos para verificar las credenciales
    const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        res.redirect('/login');
        return;
      }
  
      if (results.length === 1) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/main');
      } else {
        res.render('login', { error: 'Usuario o contraseña incorrectos' });
      }
    });
  });
  
  // Ruta para el main.html (requiere autenticación)
  router.get('/main', (req, res) => {
    if (req.session.loggedin) {
      res.render('main');
    } else {
      res.redirect('/login');
    }
  });
  router.get('/registro', (req, res) => {
    if (req.session.loggedin) {
      res.render('registro');
    } else {
      res.redirect('/login');
    }
  });

  
  
  router.get('/api/ultimos-datos', (req, res) => {
    const query = 'SELECT fecha_hora,temperatura FROM datos_semillero1 ORDER BY id DESC LIMIT 10';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los valores' });
      } else {
        console.log(results);
        res.json(results);
      }
    });
  });

  router.post('/registro', (req, res) => {
    const formData = req.body;
    console.log(formData)
    const numero = formData.numero;
    const fecha = formData.fecha;
    const variable = formData.variable;

    const query = `
        SELECT ${variable},fecha_hora 
        FROM datos_semillero${numero} 
        WHERE DATE(fecha_hora) = ?;
    `;

    
        db.query(query, [fecha], (err, results) => {
            
            if (err) {
                console.error('Error al obtener datos:', err);
                res.status(500).json({ error: 'Error al obtener datos' });
                return;
            }
            const resWithLocalTime = results.map(item => {
              if (item.fecha_hora) {
                dateParsed = new Date(item.fecha_hora.toString());
                return { ...item, fecha_hora: dateTime = DateTime.fromJSDate(dateParsed).toFormat("yyyy-MM-dd HH:mm:ss") };
              }
              return item;
            });
            
            console.log(resWithLocalTime)
            res.json(resWithLocalTime);
        });
    ;
});

const convertToPeruTime = (utcDate) => {
  return DateTime.fromISO(utcDate).setZone('America/Lima').toFormat('yyyy-MM-dd HH:mm:ss');
};














module.exports = router;