var express = require('express');
var router = express.Router();
const { category } = require('../models/connection_db');
var url = require('url');
const path_=require('../absolutepath').static_files_public
router.use((express.static(path_)))
router.post('/register/', async(req, res) => {
    const category_info = req.body;
    console.log("registrando");
    if (category_info.name && category_info.description) {
        await category.create({
                name: category_info.name,
                description: category_info.description
            }).then(e => {
                res.redirect(url.format({ pathname: '/Admin', query: { title: 'Registro Exitoso', message: 'Categoria registrada', type: 'success' } }));
            })
            .catch(err => {
                res.redirect(url.format({ pathname: '/Admin', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));         
            })
    } else {
        res.redirect(url.format({ pathname: '/Admin', query: { title: 'Error', message: 'Campos incompletos', type: 'error' } }));
    }
});

module.exports.categories_router = router;
