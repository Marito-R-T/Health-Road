var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const { ambulance_driver, hospital } = require('../models/connection_db');
const { user } = require('../models/connection_db');
var url = require('url');
const { upload } = require('./functions')

const path_ = require('../absolutepath').static_files_public;
router.use((express.static(path_)))
router.post('/register/', upload.array('profile_pic', 7), async (req, res) => {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user && user_info.password &&
        user_info.name && user_info.last_name &&
        user_info.celphone && user_info.email && profile_pic)) {
        if (!validator.validate(user_info.email)) {
            res.redirect(url.format({ pathname: '/Hospital/AddDriver', query: { title: 'Error', message: 'Email incorrecto', type: 'error' } }));
        }
        let val_error;
        await user.create({
            user: user_info.user,
            password: user_info.password,
            name: user_info.name,
            last_name: user_info.last_name,
            email: user_info.email,
            celphone: user_info.celphone,
            rol: 2,
            profile_pic: profile_pic.filename

        })
            .catch(err => {
                res.redirect(url.format({ pathname: '/Hospital/AddDriver', query: { title: 'Error', message: 'Conductor ya registrado', type: 'error' } }));
            })
        await ambulance_driver.create({
            user: user_info.user,
            direction: user_info.direction ? user_info.direction : {},
            hospital_user: req.session.user
        }).then(e => {
            res.redirect(url.format({ pathname: '/Hospital', query: { title: 'Registro exitoso', message: 'Conductor registrado', type: 'success' } }));
        })
            .catch(err => {
                res.redirect(url.format({ pathname: '/Hospital/AddDriver', query: { title: 'Error', message: 'No se pudo registrar al conductor', type: 'error' } }));
            })


    } else {
        res.redirect(url.format({ pathname: '/Hospital/AddDriver', query: { title: 'Error', message: 'Campos incompletos', type: 'error' } }));
    }
});

function  get_values(user_info) {
    try {
        delete user_info["user"]
        for (const key in user_info) {
            if(!user_info[key] || user_info[key]==null){
                delete user_info[key];
            }
        }
        return user_info
    } catch (error) {
        return {}
    }
}


router.post('/update-photo/', upload.array('profile_pic', 7), async (req, res) => {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user_name && profile_pic)) {
        await user.update({
            profile_pic: profile_pic.filename

        }, {
            where: {
                user: user_info.user_name
            }
        }).then(e => {
            if (e && e[0]) {
                try {
                    fs.unlinkSync(root_path + "/uploads/" + user_info.path_old)
                } catch (error) {

                }
                res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Exito', message: 'Actualizacion realizada con exito', type: 'success' } }));
            } else {
                res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'Error al actualizar, verifica que exista', type: 'error' } }));
            }
        }).catch(err => {
            res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'Conductor ya registrado', type: 'error' } }));
        })
    } else {
        res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'Campos incompletos', type: 'error' } }));
    }
})


router.post('/update/', async (req, res) => {
    const user_info = req.body;

    if ((user_info.user && user_info.name && user_info.last_name &&
        user_info.celphone && user_info.email)) {
        if (!validator.validate(user_info.email)) {
            res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'Email incorrecto', type: 'error' } }));
        } else {
            await user.update({
                user: user_info.user,
                name: user_info.name,
                last_name: user_info.last_name,
                email: user_info.email,
                celphone: user_info.celphone ? user_info.celphone : null,
            }, {
                where: {
                    user: user_info.user_old
                }
            })
                .catch(err => {
                    res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'No se pudo actualizar, intente de nuevo', type: 'error' } }));
                })

            const driver_info = req.body;
            if ((driver_info.user && driver_info.address)) {
                let val_error = "";
                await ambulance_driver.update({
                    direction: { latitude: driver_info.latitude, longitude: driver_info.longitude, address: driver_info.address },
                    user: driver_info.user

                }, {
                    where: {
                        user: driver_info.user_old
                    }
                }).then(e => {

                    res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Exito', message: 'Informacion del conductor actualizada', type: 'success' } }));

                })
                    .catch(err => {
                        res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'No se pudo actualizar, intente de nuevo', type: 'error' } }));
                    })
                res.send(val_error);
            } else {
                res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'No se pudo actualizar, intente de nuevo', type: 'error' } }));
            }
        }


    } else {
        res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'No se pudo actualizar, intente de nuevo', type: 'error' } }));
    }
})

router.post("/delete/", async (req, res) => {
    const user_info = req.body;
    if (user_info.confirmation != user_info.user_name) {
        res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'Confirmacion incorrecta', type: 'error' } }));
    } else {
        if (user_info.user_name) {
            await user.findOne({
                where: {
                    user: user_info.user_name,
                    status: true,
                    rol: 2
                },
            }).then(e => {
                if (e) {
                    user.update({
                        status: false,
                    }, {
                        where: {
                            user: user_info.user_name
                        }
                    })
                    res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Eliminacion completada', message: 'Usuario eliminado', type: 'success' } }));
                } else {
                    res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'No se pudo eliminar el usuario', type: 'error' } }));
                }
            }).catch(error => {
                res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
            })

        } else {
            res.redirect(url.format({ pathname: '/Hospital/Users', query: { title: 'Error', message: 'No se encontro el usuario', type: 'error' } }));
        }
    }

})

module.exports.ambulance_driver_router = router;
module.exports.get_values=get_values;