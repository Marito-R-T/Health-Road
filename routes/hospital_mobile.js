var express = require('express');
var router = express.Router();
const { hospital,sequelize,user,service_rates} = require('../models/connection_db');

//get information of a hospital history 8
router.get("/info/:user",(req, res)=>{
    user.findOne({
        include:{
            model:hospital,
        },
        where:{
            user:req.params.user
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
router.get("/info/:user",(req, res)=>{
    user.findAll({
        include:{
            model:hospital,
        },
        where:{
            user: sequelize.where(sequelize.fn('LOWER', sequelize.col('user')), 'LIKE', '%' + req.params.user.toLowerCase() + '%'),
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

//see suggestions of the best hospitals history 26
router.get('/suggestion-best-hospitals/',(req, res)=>{
    hospital.findAll({
        include:{
            model:service_rates,
            required:true,
            attributes:[],
            
        },
        attributes: [
            'user',
            [sequelize.fn('sum', sequelize.col('ServiceRates.score')),'scores']
        ],
        order:[
            [sequelize.fn('sum', sequelize.col('ServiceRates.score')),'DESC']
        ]
        ,
        group:['Hospital.user'],
        subQuery:false,
        limit:5,
       
    }).then(e=>{
        res.status(201).json(e)
    }).catch(err=>{
        res.status(500).json({error:"No se encontraron sugestiones, intente de nuevo"})
    })
})

//obtener todos los servicios
router.get('/all-hospitals/',(req, res)=>{
    hospital.findAll({
        where: {
            status:true,
        }
    }).then(e=>{
        if(e){
            res.status(201).json(e)
        }else{
            res.status(401).json({error:"No se encontraron servicios"})
        }
    }).catch(e=>res.status(500).json({error:"No se encontraron servicios"}))
})

module.exports.hospital_router_mobile = router;