var express = require('express');
var router = express.Router();
const { service,favorites,user, service_rates,category,sequelize,discount} = require('../models/connection_db');
const Op = require('sequelize').Op

//obtener todos los servicios
router.get('/all-services/',(req, res)=>{
    service.findAll({
        where: {
            status:true,
        }
    }).then(e=>{
        if(e){
            res.status(201).json(e)
        }else{
            res.status(404).json({error:"No se encontraron servicios"})
        }
    }).catch(e=>res.status(500).json({error:"No se encontraron servicios"}))
})

//Filter a service by his name, history 7
router.get('/get-services/',(req, res)=>{
    console.log(req.body, req.params, "ZZZZZZZZZZ")
    discount.findAll({
        include:{
            model:service,
            required:true,
            where: {
                name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.body.name.toLowerCase() + '%'),
                status:true
            },
            attributes:["name","description","price"]
        },
        attributes:["id","percentage"]
        ,
        
    }).then(e=>{
        if(e){
            res.status(201).json(e)
        }else{
            res.status(401).json({ error: "No hay servicios con este nombre, intente de nuevo"})
        }
    }).catch(err=>{
        res.status(501).json({ error: "Intente de nuevo"})
    })
})

//get a specific service history 24
router.get('/get-info-service/',(req, res)=>{
    discount.findOne({
        include:{
            model:service,
            required:true,
            where: {
                name: req.body.name, 
                status:true
            }
        }
     }).then(e=>{
        if(e){
            res.status(201).json(e)
        }else{
            res.status(401).json({ error: "No hay servicios con este nombre, intente de nuevo"})
        }
    }).catch(err=>{
        res.status(501).json({ error: "Intente de nuevo"})
    })
})

//See services by category history 9
router.get('/services-by-category/',(req, res)=>{
    category.findAll({
        include:{
            model:service,
            required:true,
        },
        where: { 
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('Category.name')), 'LIKE', '%' + req.body.name.toLowerCase() + '%'),
        }
    }).then(e=>res.status(201).json(e))
    .catch(err=>{
        console.error(err)
        res.status(501).json({ error: "No se encontraron servicios con esta categoria,intente de nuevo"})
    })
})

//filter services by price history 10
router.get('/services-by-price/',async (req, res)=>{
    let name = ''
    if(req.body.name){
        name=req.body.name.toLowerCase() 
    }
    service.findAll({
        where:{
            price:{
                [Op.gte]:req.body.price_gte,
                [Op.lte]:req.body.price_lte,
            },
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + name + '%'),
        
        }
    }).then(e=>res.status(201).json(e))
    .catch(err=>{
        console.error(err)
        res.status(501).json({ error: "No se encontraron servicios en este rango,intente de nuevo"})
    })
})

//Rate a service history 23
router.post('/rate-a-service/',(req, res)=>{
    service_rates.create({
        score:req.body.score,
        service:req.body.service,
        hospital:req.body.hospital
    }).then(e=>{
        if(e){
            res.status(201).json(e);
        }else{
            res.status(404).json({ error: "Error al establecer una calificacion"})
        }
    }).catch(err=>{
        res.status(500).json({ error: "Error al establecer una calificacion"})
    })
})

//See the service rating history 25
router.get('/service-rating/',(req, res)=>{
    service_rates.findOne({
        attributes:[
            [sequelize.fn('avg', sequelize.col('score')),'rating']
        ],
        where: {
            service:req.body.service,
            hospital:req.body.hospital
        }
    })
    .then(e=>{
        res.json(e)
    })
    .catch(err=>{
        res.send("ss")
    })
})


router.get('/add-favorite-service-rating/',async (req, res)=>{
    const [user_, created] = await favorites.findOrCreate({
        where: {
            user:req.body.user,
            service:req.body.service,
            hospital:req.body.hospital
        },
        defaults:{
            user:req.body.user,
            service:req.body.service,
            hospital:req.body.hospital
        }
    })
    if(!created){
        favorites.update({
            status:!user_.status
        },{
            where:{
                user:req.body.user,
                service:req.body.service,
                hospital:req.body.hospital,
            }
        }).then(e=>{
            user_.status=!user_.status
            res.status(201).json(user_)
        })
    }else{
        res.status(201).json(user_)
    }
})

module.exports.service_router_mobile = router;