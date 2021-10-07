var express = require('express');
var router = express.Router();
const { service, service_rates,sequelize,discount} = require('../models/connection_db');

//Filter a service by his name, history 7
router.get('/get-service/',(req, res)=>{
    discount.findAll({
        include:{
            model:service,
            required:true,
            where: {
                name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.body.name.toLowerCase() + '%')
            }
        },
        logging: console.log
        
    }).then(e=>{
        res.send(e)
    }).catch(err=>{
        console.log(err)
        res.send("Intente de nuevo")
    })
})


module.exports.service_router_mobile = router;