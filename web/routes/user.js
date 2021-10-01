var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const { user } = require('../models/connection_db');
var multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    }
});

var upload = multer({
    storage: storage
});

//create a hospital
router.post('/register/', upload.array('profile_pic', 7), async(req, res) => {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone && user_info.email &&
            user_info.rol && profile_pic)) {
        if (!validator.validate(user_info.email)) {
            res.send("el email no esta escrito correctamente")
        }
        let val_error = ""
        await user.create({
                user: user_info.user,
                password: user_info.password,
                name: user_info.name,
                last_name: user_info.last_name,
                email: user_info.email,
                celphone: user_info.celphone,
                rol: user_info.rol,
                profile_pic: profile_pic.path
            }).then(e => {
                val_error = "usuario registrado";
            })
            .catch(err => {
                try {
                    val_error = err.parent.detail;
                } catch (error) {
                    val_error = "No se pudo registrar el usuario"                   
                }
            })
        res.send(val_error);
    } else {
        res.send("error");
    }
})

router.post('/login/', async(req, res) => {
    const user_login = req.body;
    if ((user_login.user && user_login.password)) {
        await user.findOne({
            where: {
                 user: user_login.user,
                 password: user_login.password 
            }
        }).then(val => {
            if(val){
                req.session.user = user_login.user;
                req.session.email = val.email;
                req.session.rol = val.rol;
                res.send("Usuario logeado")
            }else{
                res.send("No se encontro el usuario")
            }
        }).catch(err => {
            res.send("Error al iniciar sesion, intente de nuevo");
        })
    } else {
        res.send("error al iniciar sesion, intente de nuevo");
    }
})

router.get('/logout/', function(req, res) {
    req.session.destroy();
    res.clearCookie(this.cookie, { path: '/' });
    res.send("s");
})

module.exports.user_router = router;