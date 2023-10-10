const db = require("../../db");

const login = (req, res) => {
  res.render("login", { error: "" });
};
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/login");
    }
  });
};

const login_post = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Realiza la consulta a la base de datos para verificar las credenciales
  const query = "SELECT * FROM usuarios WHERE username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      res.redirect("/login");
      return;
    }

    if (results.length === 1) {
      req.session.loggedin = true;
      req.session.username = username;
      res.redirect("/main");
    } else {
      res.render("login", { error: "Usuario o contraseña incorrectos" });
    }
  });
};

module.exports = {
  login,
  login_post,
  logout,
};
