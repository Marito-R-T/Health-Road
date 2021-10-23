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
router.get('/get-services/:name',(req, res)=>{
    discount.findAll({
        include:{
            model:service,
            required:true,
            where: {
                name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.params.name.toLowerCase() + '%'),
                status:true
            },
            //attributes:["name","description","price"]
        },
        //attributes:["id","percentage"]
        
        
    }).then(e=>{
        let values = []
        if(e){
            for (const value of e) {
                const tmp = value["Services"]
                let servicio = tmp[0]
                servicio.dataValues["percentage"]=value["percentage"]
                
                values.push(servicio)
            }
            res.status(201).json(values)
        }else{
            res.status(401).json({ error: "No hay servicios con este nombre, intente de nuevo"})
        }
    }).catch(err=>{
        console.error(err)
        res.status(501).json({ error: "Intente de nuevo"})
    })
})

//get a specific service history 24
router.get('/get-info-service/:name',(req, res)=>{
    discount.findOne({
        include:{
            model:service,
            required:true,
            where: {
                name: req.params.name, 
                status:true
            }
        }
     }).then(e=>{
        if(e){
            const tmp = e["Services"]
            var servicio = tmp[0]
            servicio.dataValues["percentage"]=e["percentage"]
            console.log(servicio)
            res.status(201).json(servicio)
        }else{
            res.status(401).json({ error: "No hay servicios con este nombre, intente de nuevo"})
        }
    }).catch(err=>{
        console.log(err)
        res.status(501).json({ error: "Intente de nuevo"})
    })
})

//See services by category history 9
router.get('/services-by-category/:name',(req, res)=>{
    category.findAll({
        include:{
            model:service,
            required:true,
        },
        where: { 
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('Category.name')), 'LIKE', '%' + req.params.name.toLowerCase() + '%'),
        }
    }).then(e=>res.status(201).json(e))
    .catch(err=>{
        console.error(err)
        res.status(501).json({ error: "No se encontraron servicios con esta categoria,intente de nuevo"})
    })
})

//filter services by price history 10
router.get('/services-by-price/:name/:price_gte/:price_lte',async (req, res)=>{
    let name = ''
    if(req.params.name){
        name=req.params.name.toLowerCase() 
    }
    service.findAll({
        where:{
            price:{
                [Op.gte]:req.params.price_gte,
                [Op.lte]:req.params.price_lte,
            },
            name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + name + '%'),
        
        }
    }).then(e=>res.status(201).json(e))
    .catch(err=>{
        console.error(err)
        res.status(501).json({ error: "No se encontraron servicios en este rango,intente de nuevo"})
    })
})
router.get('/services-by-price/:price_gte/:price_lte',async (req, res)=>{
    let name = ''
    if(req.params.name){
        name=req.params.name.toLowerCase() 
    }
    service.findAll({
        where:{
            price:{
                [Op.gte]:req.params.price_gte,
                [Op.lte]:req.params.price_lte,
            },
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
router.get('/service-rating/:service/:hospital',(req, res)=>{
    service_rates.findOne({
        attributes:[
            [sequelize.fn('avg', sequelize.col('score')),'rating']
        ],
        where: {
            service:req.params.service,
            hospital:req.params.hospital
        }
    })
    .then(e=>{
        res.status(201).json(e)
    })
    .catch(err=>{
        res.status(400).json({error: "No se encontraron calificaciones"})
    })
})


router.post('/add-favorite-service-rating/',async (req, res)=>{
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