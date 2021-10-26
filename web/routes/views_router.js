var express = require('express');
var router = express.Router();
var url = require('url');
var validator = require('email-validator');
const { solicitudes } = require('../models/connection_db');
router.get('/', (req, res) => {
  res.render("index")
})

router.get('/Login', (req, res) => {
  res.render("login")
})


router.post('/SendRequest', async (req, res) => {
  const request_info = req.body;
  console.log(request_info);
  if (!validator.validate(request_info.email)) {
    res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Email incorrecto', type: 'error' } }));
  } else {
    await solicitudes.create({
      name: request_info.name,
      email: request_info.email,
      hospital_register: request_info.hospital_register,
      description: request_info.description ? request_info.description : '',
    }).then(e => {
      res.redirect(url.format({ pathname: '/', query: { title: 'Exito', message: 'Solicitud enviada con exito', type: 'success' } }));  })
  .catch(err => {
    res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'No se pudo enviar la solicitud, intente de nuevo', type: 'error' } }));
  })
    
  }

})



module.exports.views_router = router;