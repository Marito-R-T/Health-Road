var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render("index")
  })
  
  router.get('/Login', (req, res) => {
    res.render("login")
  })
  router.get('/Signup', (req, res) => {
    res.render("hospital_register")
  })
  router.get('/Main', (req, res) => {
    res.render("hospital_user_views/hospital_main")
  })
  

module.exports.views_router = router;