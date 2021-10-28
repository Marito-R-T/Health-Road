var express = require('express');
var router = express.Router();
const { category } = require('../models/connection_db');
var url = require('url');
const path_=require('../absolutepath').static_files_public
router.use((express.static(path_)))
router.post('/register/', async(req, res) => {
    const category_info = req.body;
    if (category_info.name && category_info.description) {
        await category.create({
                name: category_info.name,
                description: category_info.description
            }).then(e => {
                res.redirect(url.format({ pathname: '/Admin/Category', query: { title: 'Registro Exitoso', message: 'Categoria registrada', type: 'success' } }));
            })
            .catch(err => {
                res.redirect(url.format({ pathname: '/Admin/Category', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));         
            })
    } else {
        res.redirect(url.format({ pathname: '/Admin/Category', query: { title: 'Error', message: 'Campos incompletos', type: 'error' } }));
    }
});

router.post('/update/', async(req, res) => {
    const category_info = req.body;
    if (category_info.name && category_info.description) {
        await category.update({
                description: category_info.description
            },{
                where:{
                    name: category_info.name
                }
            }).then(e => {

                res.redirect(url.format({ pathname: '/Admin/Category', query: { title: 'Actualizacion Exitosa', message: 'Categoria actualizada', type: 'success' } }));
            })
            .catch(err => {

                res.redirect(url.format({ pathname: '/Admin/Category', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));         
            })
    } else {
        res.redirect(url.format({ pathname: '/Admin/UpdateCategory', query: { title: 'Error', message: 'Campos incompletos', type: 'error' } }));
    }
});

module.exports.categories_router = router;
