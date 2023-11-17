
const { DateTime } = require("luxon");

const validarHoraRiego=(req,res,next)=>{
    fecha_hora=req.body.fechaHora;
    console.log(fecha_hora);
    // Obtén la hora actual en Lima
    const horaActualLima = DateTime.now().setZone('America/Lima');

    // Define la hora proporcionada en el formato dado
    const horaProporcionada = DateTime.fromISO(fecha_hora).setZone('UTC');

    // Compara las dos horas
    if (horaProporcionada < horaActualLima) {
        res.json({error:"La hora ya ha pasado"});
        console.log("La hora seleccionada ya ha pasado")
    } else {
        next();
    }
        
    }


module.exports={
    validarHoraRiego
}