var express = require('express');
var router = express.Router();
const { sequelize,category} = require('../models/connection_db');

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

module.exports.category_router_mobile = router;