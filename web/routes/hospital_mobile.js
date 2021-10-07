var express = require('express');
var router = express.Router();
const { hospital,sequelize,user} = require('../models/connection_db');

//get information of a hospital history 8
router.get("/info/",(req, res)=>{
    user.findOne({
        include:{
            model:hospital,
        },
        where:{
            user:req.body.user
        }
    })
    .then(e=>{
        if(e){
            res.json(e)
        }else{
            res.json({ error:"No se encontro el hospital"})
        }
    })
    .catch(err=>{
        res.json({ error: "No se encontro el hospital,intente de nuevo"})
    })
})

module.exports.hospital_router_mobile = router;