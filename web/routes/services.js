var express = require('express');
var router = express.Router();
const { service } = require('../models/connection_db')

router.post('/register/',async (req,res)=>{
    const service_info=req.body;
    if( service_info.name && service_info.price &&
        service_info.description
    ){
        let val_error="";
        await service.create({
            name: service_info.name,
            price: service_info.price,
            description: service_info.description,
            hospital_user: 'usuario1'
        }).then(e=>{
            val_error = "servicio registrado";
        })
        .catch(err=>{
            val_error = err.parent.detail;
        })
        res.send(val_error);

    }else{
        res.send("error")
    }
});

module.exports.services_router = router;