var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const { user,hospital } = require('../models/connection_db');
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


router.post('/login/', async (req, res) => {
    const user_login = req.body;
    if ((user_login.user && user_login.password)) {
        await user.findOne({
            where: {
                user: user_login.user,
                password: user_login.password,
                status:true
            }
        }).then(val => {
            if (val) {
                req.session.user = user_login.user;
                req.session.email = val.email;
                req.session.rol = val.rol;
                if(val.rol == "0"){
                    res.redirect(url.format({ pathname: '/Hospital/Services', query: { title: 'Ok', message: 'Sesion iniciada correctamente', type: 'success' } }));
                }else if(val.rol == "1"){
                    res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Ok', message: 'Sesion iniciada correctamente', type: 'success' } }));
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