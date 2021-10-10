var express = require('express');
var router = express.Router();
const { user,creditCard } = require('../models/connection_db');
const mail = require('./send_email');
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
    console.log("ENTROOOOOOO")
    console.log(req.body)
    const user_info = req.body;
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone  )) {
        if (!validator.validate(user_info.email)) {
            res.send("el email no esta escrito correctamente")
        }
        await user.create({
                user: user_info.user,
                password: user_info.password,
                name: user_info.name,
                last_name: user_info.last_name,
                celphone: user_info.celphone,
                rol: 3,
                //profile_pic: user_info.path?:''
            }).then(e => {
                
                if(e){
                    res.status(201).json(e)
                }else{
                    res.status(400).json({ error:"No se pudo registrar, intente de nuevo"})
                }
            })
            .catch(err => {
                res.status(400).json({ error:"No se pudo registrar, intente de nuevo"})
            })
     } else {
        res.status(400).json({ error:"Debe completar los campo"})
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
            res.status(201).send(true)
        }else{
            res.status(400).send(false)
        }
    }).catch(err=>{
        res.status(500).json({ error:"No se pudo actualizar el perfil, intente de nuevo"})
    })
})

//register mail history 5
router.post('/send-code-mail/',async (req, res)=>{
    var code = ""
    for (let index = 0; index < 8; index++) {
        code+=String((Math.floor((Math.random() * (11)))))
    }
    await mail.send_code(req,res,code)
})

router.post('/validate-code/',(req, res)=>{
    user.findOne({
        where:{
            user: req.body.user,
            code:req.body.code
        }
    }).then(e=>{
        if(e){
            res.status(201).json(e)
        }else{
            res.status(401).json({error:"El codigo de verificacion no es el correcto"})
        }
    }).catch(err=>{
        res.status(501).json({error:"Intente de nuevo"})
    })
    
})

//delete mail history 64
router.delete('/delete-mail/',(req, res)=>{
    user.update({email:null},
        {where:{user:req.body.user}}
    ).then(e=>{
        if(e && e[0]){
            res.status(200).send(true)
        }else{
            res.status(400).send(false)
        }
    }).catch(err=>{
        res.status(500).json(
        {error:"No se pudo completar la operacion, intente de nuevo"})
    })

})

//change email history 63
router.put('/change-mail/',async(req, res)=>{
    
})

//Register credit card historia 6
router.post('/register-credit-card/',(req, res)=>{
    creditCard.create({
        card_number:req.body.card_number,
        cvv:req.body.cvv,
        expiration:new Date(req.body.expiration),
        user:req.body.user
    }).then(e=>{
        if(e){
            res.status(200).json(e)
        }else{
            res.status(400).json({ error:"No se pudo registrar la tarjeta, intente de nuevo"})
        }
    }).catch(err=>{
        res.status(500).json({ error:"No se pudo registrar la tarjeta, intente de nuevo"})
    })
})

router.put('/update-credit-card/',(req, res)=>{
    creditCard.update({
        cvv:req.body.cvv,
        expiration:new Date(req.body.expiration)
    },{
        where:{
            user:req.body.user,
            card_number:req.body.card_number,
        }
    })
    .then(e=>{
        if(e && e[0]){
            res.status(200).json(e)
        }else{
            res.status(400).json({ error:"No se pudo actualizar la tarjeta, intente de nuevo"})
        }
    }).catch(err=>{
        res.status(500).json({ error:"No se pudo actualizar la tarjeta, intente de nuevo"})
    })
})

module.exports.user_router_mobile = router;