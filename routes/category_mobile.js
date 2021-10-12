var express = require('express');
var router = express.Router();
const { sequelize,category,service} = require('../models/connection_db');

//See services by category history 9
router.get('/show-categories/',(req, res)=>{
    category.findAll()
    .then(e=>{
        res.status(200).json(e)
    })
    .catch(err=>{
        res.status(501).json({ error: "Error al buscar categorias, intente de nuevo"})
    })
})

//check diferent prices by category history 12
router.get('/check-prices-of-service-by-category/',async (req, res)=>{
    const query = `SELECT  "Services"."hospital_user" as "Hospital", 
    "Services"."name" AS "Servicio", "Services"."price" AS "Precio" 
    FROM "Category" AS "Category" INNER JOIN "Service" AS "Services" 
    ON "Category"."name" = "Services"."category_name"
    WHERE "Category"."name"='${req.body.name}' 
    order by "Services"."price" ${req.body.type==1?'ASC':'DESC'}`;
    const [results,metadata]= await sequelize.query(query)
    res.status(200).json(results)
})

module.exports.category_router_mobile = router;