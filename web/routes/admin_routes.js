var express = require('express');
var router = express.Router();
var url = require('url');
const { static_files_public, root_path, static_upload } = require('../absolutepath')
const fs = require('fs');
var Sequelize = require('sequelize');
const { hospital, user, category, solicitudes, sequelize } = require('../models/connection_db');


router.use((express.static(static_files_public)))

router.get('/', (req, res) => {
  res.render("admin_views/admin_main")
})

router.get('/Add_Category/', (req, res) => {
  res.render("admin_views/register_category")
})

router.get('/AddHospital/', (req, res) => {
  res.render("admin_views/hospital_register")
})

router.get('/Hospitals/', async (req, res) => {
  await sequelize.query('SELECT "Hospital".*, "Hospital".name as hospital_name, "Hospital".status as hospital_status, "User".* as U FROM "Hospital" Inner join "User" on "User"."user" = "Hospital"."user" order by "Hospital".status desc;',  {
      type: Sequelize.QueryTypes.SELECT,
  }).then(e => {
     
        let tab = {
          hosp: 'active show',
          cat: '',
          sol: ''
        }
        console.log(e);
        res.render("admin_views/admin_main", { hospitals: e, tabs: tab});
     
  }).catch(err => {
    
      res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada, intente de nuevo', type: 'error' } }));
  })
  


})

router.get('/Category/', async (req, res) => {
  const category_info = await category.findAll();
  let tab = {
    hosp: '',
    cat: 'active show',
    sol: ''
  }
  console.log(category_info);
  res.render("admin_views/admin_main", { categories: category_info, tabs: tab});


})

router.get('/Request/', async (req, res) => {
  const solicitudes_info = await solicitudes.findAll({
    order:[['readed','ASC']]
  });
  let tab = {
    hosp: '',
    cat: '',
    sol: 'active show'
  }
  console.log(solicitudes_info);
  res.render("admin_views/admin_main", { solicitudes: solicitudes_info, tabs: tab});


})

module.exports.admin_router = router;