var express = require('express');
var router = express.Router();
const { user } = require('../models/connection_db');
var validator = require('email-validator');

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

//register user history 35
router.post('/register/', async(req, res) => {
    const user_info = req.body;
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone && user_info.email  )) {
        if (!validator.validate(user_info.email)) {
            res.send("el email no esta escrito correctamente")
        }
        await user.create({
                user: user_info.user,
                password: user_info.password,
                name: user_info.name,
                last_name: user_info.last_name,
                email: user_info.email,
                celphone: user_info.celphone,
                rol: 3,
                //profile_pic: user_info.path?:''
            }).then(e => {
                if(e){
                    res.json(e)
                }else{
                    res.json({ error:"No se pudo registrar, intente de nuevo"})
                }
            })
            .catch(err => {
                res.json({ error:"No se pudo registrar, intente de nuevo"})
            })
     } else {
        res.json({ error:"Debe completar los campo"})
    }
})

//update user history 34
router.put('/update/',(req, res) => {
    const user_ = req.body.user
    delete req.body["user"]
    for (const key in req.body) {
        if(!req.body[key] || req.body[key]==null){
            delete req.body[key];
        }
    }
    user.update(req.body,
        {
            where: {user:user_, rol:3}
        }
    ).then(e=>{
        if(e && e[0]){
            res.send(true)
        }else{
            res.send(false)
        }
    }).catch(err=>{
        res.json({ error:"No se pudo actualizar el perfil, intente de nuevo"})
    })
})

module.exports.user_router_mobile = router;