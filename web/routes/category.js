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
                val_error = err.parent.detail;
            })
        res.send(val_error);

    } else {
        res.send("error")
    }
});

module.exports.category_router = router;