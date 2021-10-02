var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const path_=require('../absolutepath').static_files
const { hospital } = require('../models/connection_db');
var multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    }
})

var upload = multer({
    storage: storage
});

router.use((express.static(path_)))
//create a hospital
router.get('/register',(req,res) => {
    res.render("registroHospital")
})

router.post('/register/', upload.array('profile_pic', 7), async(req, res) => {
    const hospital_info = req.body;
    const profile_pic = req.files[0]
    if ((hospital_info.user && hospital_info.password &&
            hospital_info.name && hospital_info.description &&
            hospital_info.email &&
            profile_pic)) {
        if (!validator.validate(hospital_info.email)) {
            res.send("el email no esta escrito correctamente")
        }
        let val_error = "";
        await hospital.create({
                user: hospital_info.user,
                password: hospital_info.password,
                name: hospital_info.name,
                description: hospital_info.description,
                payment_type: hospital_info.payment_type?hospital_info.payment_type:0,
                email: hospital_info.email,
                director_name: hospital_info.director_name?hospital_info.director_name:'',
                profile_pic: profile_pic.path
            }).then(e => {
                val_error = "usuario registrado";
            })
            .catch(err => {
                val_error = err.parent.detail;
            })
        res.send(val_error);
    } else {
        res.send("error, completar las credenciales");
    }
})

router.put('/update/', async(req, res) => {
    const hospital_info = req.body;
    if ((hospital_info.name && hospital_info.description &&
             hospital_info.email &&
             hospital_info.user)) {
        if (!validator.validate(hospital_info.email)) {
            res.send("el email no esta escrito correctamente")
        }
        let val_error = "No se encontro el hospital";
        const exist = await hospital.findByPk(hospital_info.user);
        if (exist) {
            await hospital.update({
                name: hospital_info.name,
                description: hospital_info.description,
                payment_type: hospital_info.payment_type ? hospital_info.payment_type:0,
                email: hospital_info.email,
                director_name: hospital_info.director_name ? hospital_info.director_name : '',
            }, {
                where: {
                    user: hospital_info.user
                }
            }).then(e => {
                val_error = "Actualizacion correcta";
            })
            .catch(err => {
                val_error = err.parent.detail ? err.parent.detail : "No se pudo actualizar";
            })
        }
        res.send(val_error);
    } else {
        res.send("error, no se pudo actualizar");
    }
})

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
        }).then(() => {
            res.send("Hospital eliminado")
        })
        .catch(err => {
            if (err.parent) {
                if (err.parent.detail) {
                    res.send(err.parent.detail)
                } else {
                    res.send("No se pudo eliminar")
                }
            } else {
                res.send("No se pudo eliminar")
            }
        })
    }else{
        res.send("No existe el hospital, no se podra eliminar")
    }
})

router.put('/add-photo/',upload.single('photo'),async (req, res)=>{
    let data = await hospital.findByPk(req.body.user)
    let photos=data.photos
    if(photos){
        const count = Object.keys(photos).length+1
        photos[count.toString()]=req.file.path
    }else{
        photos = {}
        console.log("entro")
        photos["0"]=req.file.path

    }
    await hospital.update({photos:photos},
        {
        where: {
            user: req.body.user
        }
    }
    ).then(e=>{
        if(e){
            res.send("Foto agregada")
        }else{
            res.send("error al agregar foto")
        }
    }
    )
    .catch(error=>{
        res.send("No se pudo agregar la foto")
    }
    );
});

module.exports.hospital_router = router;