var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const { ambulance_driver } = require('../models/connection_db');
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

router.post('/register/', upload.array('profile_pic', 7), function(req, res, next) {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone && user_info.email &&
            user_info.rol && profile_pic)) {
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
                rol: user_info.rol,
                profile_pic: profile_pic.path
            }).then(e => {
                console.log("e")
            })
            .catch(err => {
                res.send(err);
            })

    } else {
        res.send("error");
    }
    next();
}, function(req, res) {
    const driver_info = req.body;
    if (driver_info.user && driver_info.direction) {
        ambulance_driver.create({
            user: driver_info.user,
            direction: driver_info.direction
        })
        res.send("nice")
    } else {
        res.send("error")
    }
});

router.post('/update/', upload.array('profile_pic', 7), function(req, res, next) {
    const user_info = req.body;
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone)) {
        let val_error = "";
        await user.update({
                password: user_info.password,
                name: user_info.name,
                last_name: user_info.last_name,
                celphone: user_info.celphone
            }, {
                where: {
                    user: user_info.user
                }
            }).then(e => {
                val_error = "Actualizacion correcta";
            })
            .catch(err => {
                val_error = err.parent.detail ? err.parent.detail : "No se pudo actualizar";
                res.send(val_error);
            })
    } else {
        res.send("error, no se pudo actualizar");
    }
    next();
}, function(req, res) {
    const driver_info = req.body;
    if ((driver_info.user && driver_info.direction)) {
        let val_error = "";
        await ambulance_driver.update({
                direction: driver_info.direction
            }, {
                where: {
                    user: driver_info.user
                }
            }).then(e => {
                val_error = "Actualizacion correcta";
            })
            .catch(err => {
                val_error = err.parent.detail ? err.parent.detail : "No se pudo actualizar";
            })
        res.send(val_error);
    } else {
        res.send("error, no se pudo actualizar");
    }
})

module.exports.ambulance_driver_router = router;