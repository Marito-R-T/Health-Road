var express = require('express');
var router = express.Router();
const { ambulance_driver } = require('../models/connection_db')

router.post('/register/', (req, res) => {
    const driver_info = req.body;
    if (driver_info.user && driver_info.direction) {
        ambulance_driver.create({
            user: driver_info.user,
            direction: driver_info.direction
        })

        res.send("nice")
    } else {
        res.send("error")
    }
});

module.exports.ambulance_driver_router = router;