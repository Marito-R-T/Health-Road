var express = require('express');
var router = express.Router();
var url = require('url');
const { static_files_public, root_path, static_upload } = require('../absolutepath')
const fs = require('fs');
const { hospital, user } = require('../models/connection_db');


router.use((express.static(static_files_public)))
router.get('/', (req, res) => {
  let hospital_info = {};
  hospital.findOne({
    where: {
      user: req.session.user
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
  }).then(val => {
    if (val) {
      hospital_info.name = val.name;
      hospital_info.address = val.direction.address;
      hospital_info.director = val.director_name;
    } else {
      res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
    }
  }).catch(err => {
    console.log(err);
    res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
  })
  user.findOne({
    where: {
      user: req.session.user
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
  }).then(val => {
    if (val) {
      hospital_info.email = val.email;
      hospital_info.photo = val.profile_pic;
      res.render("hospital_views/hospital_main", { hospital: hospital_info });
    } else {
      res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
    }
  }).catch(err => {
    console.log(err);
    res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
  })


})

router.get('/Add/', (req, res) => {
  res.render("hospital_views/register_service")
})

module.exports.views_router_auth = router;