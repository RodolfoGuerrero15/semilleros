const express = require("express");
const router = express.Router();
const db = require("../../db");
const login_controllers = require("../controllers/login_controller");
const semilleros_controllers = require("../controllers/semilleros_controller");
const registro_controllers = require("../controllers/registro_controller");
const main_controllers = require("../controllers/main_controller");
const gateways_controllers = require("../controllers/gateways_controller");
const login_middleware= require("../middleware/login");
const semilleros_middleware= require("../middleware/semilleros");
const { DateTime } = require("luxon");

router.get("/", (req, res) => {
  res.redirect("/login");
});

//Rutas para login y logout
router.get("/login", login_controllers.login);
router.post("/login",login_middleware.validacionLogin, login_controllers.login_post);
router.post("/logout", login_controllers.logout);

// Ruta para paginas relacionadas a la gestion de semilleros
router.get("/semilleros", semilleros_controllers.semilleros);
router.get("/actualizarEstado", semilleros_controllers.actualizarEstado);
router.get("/agregar-semillero/", semilleros_controllers.agregar_semillero);
router.post(
  "/agregar-semillero",semilleros_middleware.validarId,
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
router.post('/programarRiego',main_controllers.programarRiego);
router.get('/obtenerdatosRiego', main_controllers.obtenerDatosRiego);
router.get('/obtenerdatosTemp', main_controllers.obtenerDatosTemp);
router.post('/modificarTemp',main_controllers.actualizarTemp);

//Rutas para el registro
router.get("/registro", registro_controllers.registro);
router.post("/registro", registro_controllers.actualizarRegistro);
//Rutas para gateways
router.get("/gateway",gateways_controllers.gateways);
router.get("/agregar-gateway", gateways_controllers.agregar_gateway);
router.post(
  "/agregar-gateway",
  gateways_controllers.agregar_gateway_post
);
router.get(
  "/modificar-gateway/:id",
  gateways_controllers.modificar_gateway
);
router.post(
  "/modificar-gateway/:id",
  gateways_controllers.modificar_gateway_post
);
router.post(
  "/eliminar-gateway/:id",
  gateways_controllers.eliminar_gateway
);
router.get("/obtenerSemillerosAsociados",gateways_controllers.obtenerSemilleros);






module.exports = router;
