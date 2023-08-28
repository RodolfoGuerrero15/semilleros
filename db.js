const mysql = require("mysql2"); 

const db = mysql.createPool({
    host: "localhost",
    user: "usuario_semilleros",
    password: "semilleros",
    database: "semillero1",
  });
  
  db.getConnection((err,connection) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    if (connection) connection.release();
    console.log('DB is Connected');

    return;
    
  });

module.exports =db 