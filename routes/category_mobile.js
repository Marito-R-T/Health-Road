var express = require('express');
var router = express.Router();
const { sequelize,category,service} = require('../models/connection_db');

//See services by category history 9
router.get('/show-categories/',(req, res)=>{
    category.findAll()
    .then(e=>{
        res.status(201).json(e)
    })
    .catch(err=>{
        res.status(501).json({ error: "Error al buscar categorias, intente de nuevo"})
    })
})

function get_query(req) {
    return `SELECT  "Services"."hospital_user" as "Hospital", 
    "Services"."name" AS "Servicio", "Services"."price" AS "Precio" 
    FROM "Category" AS "Category" INNER JOIN "Service" AS "Services" 
    ON "Category"."name" = "Services"."category_name"
    WHERE "Category"."name"='${req.params.name}' 
    order by "Services"."price" ${req.params.type==1?'ASC':'DESC'}`;
}
//check diferent prices by category history 12
router.get('/check-prices-of-service-by-category/:name/:type',async (req, res)=>{
    const [results,metadata]= await sequelize.query(
        get_query(req)
    )
    res.status(201).json(results)
})

module.exports.category_router_mobile = router;