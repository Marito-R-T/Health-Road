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
            res.status(201).json(e)
        }else{
            res.status(401).json({ error:"No se encontro el hospital"})
        }
    })
    .catch(err=>{
        res.status(501).json({ error: "No se encontro el hospital,intente de nuevo"})
    })
})

//search hospital history 56
router.get("/info/",(req, res)=>{
    user.findAll({
        include:{
            model:hospital,
        },
        where:{
            user: sequelize.where(sequelize.fn('LOWER', sequelize.col('user')), 'LIKE', '%' + req.body.user.toLowerCase() + '%'),
        }
    })
    .then(e=>{
        if(e){
            res.status(201).json(e)
        }else{
            res.status(401).json({ error:"No se encontro el hospital"})
        }
    })
    .catch(err=>{
        res.status(501).json({ error: "No se encontro el hospital,intente de nuevo"})
    })
})

module.exports.hospital_router_mobile = router;