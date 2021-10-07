var express = require('express');
var router = express.Router();
const { user } = require('../models/connection_db');


//declaracion de rutas

//Login history 61
router.post("/login/",(req, res)=>{
    const user_login = req.body;
    if ((user_login.user && user_login.password)) {
        user.findOne({
            where: {
                 user: user_login.user,
                 password: user_login.password,
                 rol:3 
            }
        }).then(val => {
            if(val){
                res.json(val)
            }else{
                res.json({ error: "No se encontro el usuario"})
            }
        }).catch(err => {
            res.json({ error: "Error al iniciar sesion, intente de nuevo"})
        })
    } else {
        res.json({ error: "Complete los campos requeridos"})
    }
})

module.exports.user_router_mobile = router;