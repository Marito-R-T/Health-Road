var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const { user } = require('../models/connection_db');
var multer = require('multer');
var url = require('url')
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    }
});

var upload = multer({
    storage: storage
});
const path_ = require('../absolutepath').static_files_public
router.use((express.static(path_)))
//create a hospital
router.post('/register/', upload.array('profile_pic', 7), async(req, res) => {
    const hospital_info = req.body;
    const profile_pic = req.files[0]
    if ((hospital_info.user && hospital_info.password &&
            hospital_info.name && hospital_info.description &&
            hospital_info.email &&
            profile_pic)) {
        if (!validator.validate(hospital_info.email)) {
            res.redirect(url.format({ pathname: '/Signup', query: { title: 'Error en escritura', message: 'Correo electronico incorrecto' , type: 'error' } }));
        }
        let val_error = "";
        let exist=false;
        await user.create({
            user: hospital_info.user,
            password: hospital_info.password,
            name: hospital_info.director_name?hospital_info.director_name:'',
            email: hospital_info.email,
            rol: 0,
            profile_pic: profile_pic.filename
        }).catch(error=>exist=true)
        if(exist){
            val_error = "El usuario ya existe"
        }else{
            await hospital.create({
                user: hospital_info.user,
                name: hospital_info.name,
                description: hospital_info.description,
                payment_type: hospital_info.payment_type?hospital_info.payment_type:0,
                director_name: hospital_info.director_name?hospital_info.director_name:'',
                direction: {latitude: hospital_info.latitude, longitude: hospital_info.longitude, address: hospital_info.address}
            }).then(e => {
                res.redirect(url.format({ pathname: '/', query: { title: 'Registro Exitoso', message: 'Registro completado exitosamente', type: 'success' } }));
            })
            .catch(err => {
                val_error = "Error al registrar el hospital, intente de nuevo"
            })
        }
        res.redirect(url.format({ pathname: '/Signup', query: { title: 'Error en registro', message: val_error , type: 'error' } }));
    } else {
        res.redirect(url.format({ pathname: '/Signup', query: { title: 'Error', message: 'Complete las credenciales', type: 'error' } }));
    }
})

router.post('/login/', async (req, res) => {
    const user_login = req.body;
    if ((user_login.user && user_login.password)) {
        await user.findOne({
            where: {
                user: user_login.user,
                password: user_login.password
            }
        }).then(val => {
            if (val) {
                req.session.user = user_login.user;
                req.session.email = val.email;
                req.session.rol = val.rol;
                if(val.rol == "0"){
                    res.redirect(url.format({ pathname: '/Hospital/Services', query: { title: 'Ok', message: 'Sesion iniciada correctamente', type: 'success' } }));
                }else if(val.rol == "1"){
                    res.redirect(url.format({ pathname: '/Admin/', query: { title: 'Ok', message: 'Sesion iniciada correctamente', type: 'success' } }));
                }
                

            } else {
                res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Usuario no encontrado', type: 'error' } }));
            }
        }).catch(err => {
            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
        })
    } else {
        res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Complete las credenciales', type: 'error' } }));
    }
})

router.get('/logout/', function (req, res) {
    req.session.destroy();
    res.clearCookie(this.cookie, { path: '/' });
    res.redirect(url.format({ pathname: '/', query: { title: 'Sesion Cerrada', message: 'Sesion Cerrada con exito', type: 'success' } }));
})

module.exports.user_router = router;