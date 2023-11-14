const db = require('../../db');


const semilleros=(req, res) => {
    if (req.session.loggedin) {
    db.query('SELECT * FROM semilleros', (err, rows) => {
      if (err) {
        throw err;
      }
      
      rows.forEach((row)=>{

        
        const fechaParseada = new Date(row.fecha_inicio);

        // Obtener los componentes de la fecha
        const dia = fechaParseada.getUTCDate();
        const mes = fechaParseada.getUTCMonth() + 1; // Sumamos 1 porque los meses son base 0 (0 = enero, 1 = febrero, ...)
        const anio = fechaParseada.getUTCFullYear();

        // Formatear la fecha en el formato deseado (DD/MM/YYYY)
        const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;

        
        row.fecha_inicio=fechaFormateada;
      })
      res.render('semilleros', { semilleros: rows });
      
    });
  }
    else{
      res.redirect('/login');
    }
  }

  const agregar_semillero=(req, res) => {
    res.render('agregar-semillero',{error:''});
  }
  const modificar_semillero=(req, res) => {
    const productId = req.params.id;
    db.query('SELECT * FROM semilleros WHERE id = ?', [productId], (err, rows) => {
      if (err) {
        throw err;
      }
      res.render('modificar-semillero', { semillero: rows[0] });
    });
  }

  
  const modificar_semillero_post=(req, res) => {
    const productId = req.params.id;
    const { semilla, temp_lim, description,id_gateway,id_local, fecha_inicio } = req.body;
    const updatedProduct = { semilla, temp_lim, description,id_gateway,id_local, fecha_inicio };
    db.query('UPDATE semilleros SET ? WHERE id = ?', [updatedProduct, productId], (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/semilleros');
    });
  }


  const eliminar_semillero=(req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM semilleros WHERE id = ?', [productId], (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/semilleros');
    });
  }


  const agregar_semillero_post=(req, res) => {
    const { id,semilla,temp_lim,description,id_gateway,id_local,fecha_inicio } = req.body;
    const producto = { id,semilla,temp_lim,description,id_gateway,id_local,fecha_inicio };
  
    db.query('INSERT INTO semilleros SET ?', producto, (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/semilleros');
    });
  }
const actualizarEstado=(req,res)=>{
  db.query('SELECT id,estado_semillero from semilleros',(err,results)=>{
    if(err){
      throw(err);
    }
    else{
      res.json(results);
    }
  })
}
  module.exports={
    semilleros,
    agregar_semillero,
    agregar_semillero_post,
    modificar_semillero,
    modificar_semillero_post,
    eliminar_semillero,
    actualizarEstado
}

