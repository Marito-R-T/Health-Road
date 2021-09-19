var express = require('express');
var router = express.Router();
var validator = require('email-validator');
const { user } = require('../models/connection_db')
var multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    }
})

var upload = multer({
    storage: storage
});

//create a hospital
router.post('/register/', upload.array('profile_pic', 7), async(req, res) => {
    const user_info = req.body;
    const profile_pic = req.files[0]
    if ((user_info.user && user_info.password &&
            user_info.name && user_info.last_name &&
            user_info.celphone && user_info.email &&
            user_info.rol && profile_pic)) {
        if (!validator.validate(user_info.email)) {
            res.send("el email no esta escrito correctamente")
        }

        await user.create({
                user: user_info.user,
                password: user_info.password,
                name: user_info.name,
                last_name: user_info.last_name,
                email: user_info.email,
                celphone: user_info.celphone,
                rol: user_info.rol,
                profile_pic: profile_pic.path
            }).then(e => {
                console.log("e")
            })
            .catch(err => {
                res.send(err);
            })
            .finally(function() {
                res.send("registered")
            })

    } else {
        res.send("error");
    }
})

router.post('/login/', async(req, res) => {
    const user_login = req.body;
    if ((user_login.user && user_login.password)) {
        await user.findAll({
            where: {
                user: user_login.user,
                password: user_login.password
            }
        });
    } else {
        res.send("error");
    }
})

module.exports.user_router = router;