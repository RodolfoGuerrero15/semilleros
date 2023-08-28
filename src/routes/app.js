const express = require('express');
const router = express.Router();
const db = require('../../db')
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















module.exports = router;