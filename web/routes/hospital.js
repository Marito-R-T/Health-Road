var express = require('express');
var router = express.Router();
var validator = require('email-validator');
var url = require('url');
const {static_files_public, root_path}=require('../absolutepath')
const fs = require('fs');
const { hospital, user } = require('../models/connection_db');
const {upload}= require('./functions')




//create a hospital historia 17
router.post('/register/', upload.array('profile_pic', 7), async (req, res) => {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user && user_info.password &&
        user_info.name && user_info.last_name &&
        user_info.celphone && user_info.email &&
        profile_pic)) {
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
            rol: 3,
            profile_pic: profile_pic.path
        }).then(e => {
            val_error = "usuario registrado";
        })
            .catch(err => {
                val_error = "No se pudo registrar el usuario"
            })
        res.send(val_error);
    } else {
        res.send("Complete los campos requeridos");
        router
    }
})




//historia 38
router.post('/update/', async(req, res) => {
    const hospital_info = req.body;
    if ((hospital_info.name && hospital_info.description &&
             hospital_info.email )) {
        if (!validator.validate(hospital_info.email)) {
            res.redirect(url.format({ pathname: '/Hospital/Update', query: { title: 'Error en escritura', message: 'Correo electronico incorrecto' , type: 'error' } }));
        }
        let val_error = "No se encontro el hospital";
        const exist = await hospital.findByPk(req.session.user);
        if (exist) {
            await hospital.update({
                name: hospital_info.name,
                description: hospital_info.description,
                payment_type: hospital_info.payment_type ? hospital_info.payment_type:0,
                email: hospital_info.email,
                director_name: hospital_info.director_name ? hospital_info.director_name : '',
            }, {
                where: {
                    user:req.session.user
                }
            }).then(e => {
                if(e && e[0]){
                    res.redirect(url.format({ pathname: '/Hospital', query: { title: 'Exito', message: 'Actualizacion realizada con exito' , type: 'success' } }));
                }else{
                    res.redirect(url.format({ pathname: '/Hospital/Update', query: { title: 'Error', message: 'Error al actualizar, verifica que exista' , type: 'error' } }));
                }
            })
            .catch(err => {
                res.redirect(url.format({ pathname: '/Hospital/Update', query: { title: 'Error', message: 'No se puedo actualizar, intente de nuevo' , type: 'error' } }));
            })
        }
        res.redirect(url.format({ pathname: '/Hospital/Update', query: { title: 'Error', message: 'No se encontro el hospital' , type: 'error' } }));
    } else {
        res.redirect(url.format({ pathname: '/Hospital/Update', query: { title: 'Error', message: 'Campos incompletos' , type: 'error' } }));
    }
})

//historia 39
router.delete('/delete/', async (req, res) => {
    const hospital_info = req.body;
    const exist = await hospital.findByPk(hospital_info.user);
    if (exist) {
        hospital.update({
            status: true
        }, {
            where: {
                user: hospital_info.user
            }
        }).then((e) => {
            if(e && e[0]){
                res.send("Hospital eliminado")
            }else{
                res.send("Error al eliminar el hospital, verifique que exista")
            }
        })
        .catch(err => {
            res.send("No se pudo eliminar, intente de nuevo")
        })
    }else{
        res.send("Error al eliminar, no existe el hospital")
    }
})

//historia 16
router.put('/add-photo/',upload.single('photo'),async (req, res)=>{
    let data = await hospital.findByPk(req.body.user)
    let photos=data.photos
    if(photos){
        const count = Object.keys(photos).length+1
        photos[count.toString()]=req.file.path
    }else{
        photos = {}
        photos["0"]=req.file.path
   }
    await hospital.update({photos:photos},
        {
        where: {
            user: req.body.user
        }
    }
    ).then(e=>{
        if(e && e[0]){
            res.send("Foto agregada")
        }else{
            res.send("error al agregar foto, verifique que exista el hospital")
        }
    }
    )
    .catch(error=>{
        res.send("No se pudo agregar la foto, intente de nuevo")
    }
    );
});

//delete hospital photos history 59
router.put('/delete-photos/', async(req, res)=> {
    const photos={}
    for (const key in req.body) {
        const path_img= req.body[key]
      if(path_img && key!="user"){
          photos[key]=path_img
          try {
            fs.unlinkSync(root_path+"/"+path_img)
          } catch (error) {}
      }
    }
    await hospital.update({photos: photos},
        {
            where: {user:req.body.user}
        }
    ).then(e=>{
        console.log(req.body.user,photos,e)
        if(e && e[0]){
            res.send("Fotos eliminadas exitosamente")
        }else{
            res.send("No se pudo eliminar la fotos")
        }
    }).catch(er=>{
        res.send("Error al eliminar las fotos, intente de nuevo")
    })
});

module.exports.hospital_router = router;