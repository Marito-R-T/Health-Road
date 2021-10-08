var express = require('express');
var router = express.Router();
const { service, service_rates,category,sequelize,discount} = require('../models/connection_db');

//Filter a service by his name, history 7
router.get('/get-services/',(req, res)=>{
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
            res.json(e)
        }else{
            res.json({ error: "No hay servicios con este nombre, intente de nuevo"})
        }
    }).catch(err=>{
        res.json({ error: "Intente de nuevo"})
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
            res.json(e)
        }else{
            res.json({ error: "No hay servicios con este nombre, intente de nuevo"})
        }
    }).catch(err=>{
        res.json({ error: "Intente de nuevo"})
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
    }).then(e=>res.json(e))
    .catch(err=>{
        console.error(err)
        res.json({ error: "No se encontraron servicios con esta categoria,intente de nuevo"})
    })
})

module.exports.service_router_mobile = router;