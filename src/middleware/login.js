const validacionLogin=(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    if(username.length<3){
        res.render("login", { error: "El usuario debe tener mas de 3 caractéres" });
    }
    else if(username.length>20){
        res.render("login", { error: "El usuario debe tener menos de 20 carácteres" });
    }
    else{
        next();
    }
}
module.exports={
    validacionLogin
}