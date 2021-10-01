var express = require('express');
var router = express.Router();
const { category } = require('../models/connection_db');

router.post('/register/', async(req, res) => {
    const category_info = req.body;
    if (category_info.name && category_info.description) {
        let val_error = "";
        await category.create({
                name: category_info.name,
                description: category_info.description
            }).then(e => {
                val_error = "categoria registrada";
            })
            .catch(err => {
                try {
                    val_error = err.parent.detail;
                } catch (error) {
                    val_error = "No se pudo registrar, intente de nuevo"
                }
                
            })
        res.send(val_error);
    } else {
        let val_error = "error" + category_info.name;
        res.send(val_error);
    }
});

module.exports.categories_router = router;
