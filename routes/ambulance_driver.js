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
const path_=require('../absolutepath').static_files_public
router.use((express.static(path_)))
router.post('/register/', upload.array('profile_pic', 7), async(req, res, next) => {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone && user_info.email  && profile_pic)) {
        if (!validator.validate(user_info.email)) {
            res.send("el email no esta escrito correctamente")
        }
        let val_error ;
        await user.create({
                user: user_info.user,
                password: user_info.password,
                name: user_info.name,
                last_name: user_info.last_name,
                email: user_info.email,
                celphone: user_info.celphone,
                rol: 2,
                profile_pic: profile_pic.path
            })
            .catch(err => {
                val_error = "No se pudo registrar el conductor"
            })
        if(val_error){
            res.send(val_error)
        }else{
            await ambulance_driver.create({
                user: user_info.user,
                direction: user_info.direction ? user_info.direction : {}
            }).then(e => {
                val_error = "conductor registrado";
            })
            .catch(err => {
                val_error = "No se pudo registrar el conductor"
            })
            res.send(val_error)
        }        
    } else {
        res.send("error, no se pudo registrar, intente de nuevo");
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

router.post('/update/', upload.array('profile_pic', 7), async(req, res, next) => {
    const user_info = req.body;
    let val_error = "";
    const user_ = user_info.user
    user_info=get_values(user_info)
        await user.update( user_info, {
                where: {
                    user: user_
                }
            })
            .catch(err => {
                val_error = "No se pudo actualizar, intente de nuevo";             
            })
    //
    if(val_error){
        res.send(val_error)
    }else{
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
                    if(e && e[0]){
                        val_error="Conductor actualizado"
                    }else{
                        val_error="Usuario incorrecto, No se pudo actualizar el usuario"
                    }
                })
                .catch(err => {
                    val_error = "No se pudo actualizar, intente de nuevo"; 
                })
            res.send(val_error);
        } else {
            res.send("error, no se pudo actualizar");
        }
    }
})

router.put("/delete/",async(req, res)=>{
    const user_info = req.body;
    if(user_info.user){
        await user.findOne(
            {
                where:{
                    user: user_info.user,
                    status: true,
                },
                include:[
                    {
                        model:ambulance_driver,
                        required:true,
                    }
                ]
            }).then(e=>{
                if(e){
                    user.update({
                        status: false,
                    },{
                        where:{
                            user: user_info.user
                        }
                    })
                    res.send("El perfil del conductor ha sido eliminado")
                }else{
                    res.send("error, no se pudo eliminar el perfil")
                }
            }).catch(error=>{
                res.send("Error, intente de nuevo")
            })

    }else{
        res.send("Debe escribir un usuario");
    }
})

module.exports.ambulance_driver_router = router;
module.exports.get_values=get_values;