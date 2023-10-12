const express = require("express");
const router = express.Router();
const db = require("../../db");
const login_controllers = require("../controllers/login_controller");
const semilleros_controllers = require("../controllers/semilleros_controller");
const registro_controllers = require("../controllers/registro_controller");
const main_controllers = require("../controllers/main_controller");
const { DateTime } = require("luxon");

router.get("/", (req, res) => {
  res.redirect("/login");
});

//Rutas para login y logout
router.get("/login", login_controllers.login);
router.post("/login", login_controllers.login_post);
router.post("/logout", login_controllers.logout);

// Ruta para paginas relacionadas a la gestion de semilleros
router.get("/semilleros", semilleros_controllers.semilleros);
router.get("/agregar-semillero/", semilleros_controllers.agregar_semillero);
router.post(
  "/agregar-semillero",
  semilleros_controllers.agregar_semillero_post
);
router.get(
  "/modificar-semillero/:id",
  semilleros_controllers.modificar_semillero
);
router.post(
  "/modificar-semillero/:id",
  semilleros_controllers.modificar_semillero_post
);
router.post(
  "/eliminar-semillero/:id",
  semilleros_controllers.eliminar_semillero
);
//Rutas para el dashboard
router.get("/main", main_controllers.main);

router.get('/obtenerdatos', main_controllers.obtenerDatos);
//Rutas para el registro
router.get("/registro", registro_controllers.registro);
router.post("/registro2", registro_controllers.actualizarRegistro);



router.get("/api/ultimos-datos", (req, res) => {
  const query =
    "SELECT fecha_hora,temperatura FROM datos_semillero1 ORDER BY id DESC LIMIT 10";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener los valores" });
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

router.post("/registro", (req, res) => {
  const formData = req.body;
  console.log(formData);
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
      console.error("Error al obtener datos:", err);
      res.status(500).json({ error: "Error al obtener datos" });
      return;
    }
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

    console.log(resWithLocalTime);
    res.json(resWithLocalTime);
  });
});

module.exports = router;
