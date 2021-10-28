var express = require('express');
var router = express.Router();
const {discount, hospital,sequelize,user,service_rates} = require('../models/connection_db');
const fs = require('fs');
const static_files_upload = require('../absolutepath').root_path
//get information of a hospital history 8
router.get("/info-specific/:user",(req, res)=>{
    user.findOne({
        include:{
            model:hospital,
            where:{
                status:true,
            }
        },
        where:{
            user:req.params.user
        }
    })
    .then(e=>{
        if(e){
            const tmp = e["Hospitals"]
            let hospital = tmp[0]
            hospital.dataValues["profile_pic"]=value['profile_pic']
            res.status(201).json(hospital)
        }else{
            res.status(401).json({ error:"No se encontro el hospital"})
        }
    })
    .catch(err=>{
        console.error(err)
        res.status(501).json({ error: "No se encontro el hospital,intente de nuevo"})
    })
})

//search hospital history 56
router.get("/info/:user",(req, res)=>{
    user.findAll({
        include:{
            model:hospital,
            where:{
                status:true,
            }
        },
        where:{
            user: sequelize.where(sequelize.fn('LOWER', sequelize.col('User.user')), 'LIKE', '%' + req.params.user.toLowerCase() + '%'),
            
        },
        //attributes:['user','name','email','profile_pic']
    })
    .then(e=>{
        let values = []
        if(e){
            for (const value of e) {
                const tmp = value["Hospitals"]
                let hospital = tmp[0]
                hospital.dataValues["profile_pic"]=value['profile_pic']
                values.push(hospital)
            }
            res.status(201).json(values)
        }else{
            res.status(401).json({ error:"No se encontro el hospital"})
        }
    })
    .catch(err=>{
        console.error(err)
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
            where:{
                status:true,
            }
            
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
    user.findAll({
        include:{
            model:hospital,
            where:{
                status:true,
            }
        },
        //attributes:['user','name','email','profile_pic']
    })
    .then(e=>{
        let values = []
        if(e){
            for (const value of e) {
                const tmp = value["Hospitals"]
                let hospital = tmp[0]
                hospital.dataValues["profile_pic"]=value['profile_pic']
                values.push(hospital)
            }
            res.status(201).json(values)
        }else{
            res.status(401).json({ error:"No se encontro el hospital"})
        }
    })
    .catch(err=>{
        console.error(err)
        res.status(501).json({ error: "No se encontro el hospital,intente de nuevo"})
    })
})

router.get('/sss/',(req, res)=>{
    discount.findAll().then(e=>{res.send(e)})
 
})

router.get("/image/:dir/:name",(req, res)=>{
    const url = static_files_upload+'/'+req.params.dir+'/'+req.params.name
    res.sendFile(url)
})

module.exports.hospital_router_mobile = router;