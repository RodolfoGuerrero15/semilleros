const db = require("../../db");

const validarId=(req,res,next)=>{
    const id = req.body.id;
    
  
    db.query('SELECT * from semilleros where id = ?', id, (err,results) => {
      if (err) {
        throw err;
      }
      
      if((results.length)>0){
        res.render('agregar-semillero',{error:"El semillero con el id ingresado ya existe"});
      }
      else{
        next();
      }
    });

}
module.exports={
    validarId
}