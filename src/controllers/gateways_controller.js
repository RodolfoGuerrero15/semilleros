const db = require('../../db')
const gateways= (req, res) => {
    if (req.session.loggedin) {
    db.query('SELECT * FROM gateways', (err, rows) => {
      if (err) {
        throw err;
      }
      
      
      res.render('gateways', { gateways: rows });
      
    });
  }
    else{
      res.redirect('/login');
    }
  }
  const agregar_gateway=(req, res) => {
    res.render('agregar-gateway');
  }
  const modificar_gateway=(req, res) => {
    const gatewayId = req.params.id;
    db.query('SELECT * FROM gateways WHERE id = ?', [gatewayId], (err, rows) => {
      if (err) {
        throw err;
      }
      res.render('modificar-gateway', { gateways: rows[0] });
    });
  }

  
  const modificar_gateway_post=(req, res) => {
    const productId = req.params.id;
    const { longitud, latitud } = req.body;
    const updatedProduct = {longitud,latitud };
    db.query('UPDATE gateways SET ? WHERE id = ?', [updatedProduct, productId], (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/gateway');
    });
  }


  const eliminar_gateway=(req, res) => {
    const productId = req.params.id;
    db.query('DELETE FROM gateways WHERE id = ?', [productId], (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/gateway');
    });
  }


  const agregar_gateway_post=(req, res) => {
    const { id,longitud,latitud } = req.body;
    const producto = { id,longitud,latitud };
  
    db.query('INSERT INTO gateways SET ?', producto, (err) => {
      if (err) {
        throw err;
      }
      res.redirect('/gateway');
    });
  }

module.exports={
    gateways,
    agregar_gateway,
    agregar_gateway_post,
    eliminar_gateway,
    modificar_gateway,
    modificar_gateway_post
}


