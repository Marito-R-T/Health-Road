var express = require('express');
var router = express.Router();
var url = require('url');
const { static_files_public, root_path, static_upload } = require('../absolutepath')
const fs = require('fs');
const { hospital, user } = require('../models/connection_db');


router.use((express.static(static_files_public)))

router.get('/', (req, res) => {
    res.render("admin_views/admin_main")
  })

  router.get('/Add_Category/', (req, res) => {
    res.render("admin_views/register_category")
  })

  module.exports.admin_router = router;