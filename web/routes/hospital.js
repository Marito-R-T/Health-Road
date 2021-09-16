var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const {hospital} = require('../models/connection_db')
var multer = require('multer');
const storage = multer.diskStorage({
    destination:'uploads/',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'_'+Date.now())
    }
})

var upload = multer({
    storage:storage
});

//create a hospital
router.post('/register/',upload.array('profile_pic',7),(req,res)=>{
    const hospital_info = req.body;
    const profile_pic = req.files[0]
    if((hospital_info.user && hospital_info.password
        && hospital_info.name && hospital_info.description
        && hospital_info.payment_type && hospital_info.email
        && hospital_info.director_name && profile_pic)){
        if(!validator.validate(hospital_info.email)){
            res.send("el email no esta escrito correctamente")
        }
         
        hospital.create({
            user:hospital_info.user,
            password:hospital_info.password,
            name:hospital_info.name,
            description:hospital_info.description,
            payment_type:hospital_info.payment_type,
            email:hospital_info.email,
            director_name:hospital_info.director_name,
            profile_pic:profile_pic.path
        }).then(e=>{
            console.log("e")
        })
        .catch(err=>{
            res.send(err);
        })
        .finally(function(){
            res.send("registered")
        })
        
    }else{
        res.send("error");
    }
})

module.exports.hospital_router = router;
