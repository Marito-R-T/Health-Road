var express = require('express');
var router = express.Router();
var url = require('url');
var validator = require('email-validator');
const { static_files_public, root_path, static_upload } = require('../absolutepath')
const fs = require('fs');
var Sequelize = require('sequelize');
const { hospital, user, category, solicitudes, sequelize } = require('../models/connection_db');
var multer = require('multer');
const mail = require('./send_email_web');
const Op = Sequelize.Op;
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now())
  }
});

var upload = multer({
  storage: storage
});

router.use((express.static(static_files_public)))

router.get('/', (req, res) => {
  res.render("admin_views/admin_main")
})

router.get('/Add_Category/', (req, res) => {
  res.render("admin_views/register_category")
})

router.get('/AddHospital/', (req, res) => {
  const hospital_info = req.query;
  if (hospital_info.name) {

    res.render("admin_views/hospital_register", { hospital: hospital_info })
  } else {

    res.render("admin_views/hospital_register")
  }
})

router.get('/Hospitals/', async (req, res) => {
  await sequelize.query('SELECT "Hospital".*, "Hospital".name as hospital_name, "Hospital".status as hospital_status, "User".* as U FROM "Hospital" Inner join "User" on "User"."user" = "Hospital"."user" order by "Hospital".status desc;', {
    type: Sequelize.QueryTypes.SELECT,
  }).then(e => {

    let tab = {
      hosp: 'active show',
      cat: '',
      sol: '',
      lochosp: ''
    }
    res.render("admin_views/admin_main", { hospitals: e, tabs: tab });

  }).catch(err => {

    res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada, intente de nuevo', type: 'error' } }));
  })



})

router.get('/Category/', async (req, res) => {
  const category_info = await category.findAll();
  let tab = {
    hosp: '',
    cat: 'active show',
    sol: '',
    lochosp: ''
  }
  res.render("admin_views/admin_main", { categories: category_info, tabs: tab });


})

router.get('/UpdateCategory/', async (req, res) => {
  const category_info = await category.findOne({
    where: {
      name: req.query.name
    }
  });
  res.render("admin_views/update_category", { category: category_info });


})

router.get('/Request/', async (req, res) => {
  const solicitudes_info = await solicitudes.findAll({
    order: [['readed', 'ASC']]
  });
  let tab = {
    hosp: '',
    cat: '',
    sol: 'active show',
    lochosp: ''
  }
  res.render("admin_views/admin_main", { solicitudes: solicitudes_info, tabs: tab });


})

router.get('/HospitalLocations/', async (req, res) => {
  const location = await hospital.findAll({
    where: {
      direction: {
        latitude: {
          [Op.not]: null,
        }
      },
      status: true
    },
    attributes: ['direction','name'],
    raw:true,
  });
  let tab = {
    hosp: '',
    cat: '',
    sol: '',
    lochosp: 'active show'
  }
  res.render("admin_views/admin_main", { locations: location, tabs: tab });


})


router.post('/register/', upload.array('profile_pic', 7), async (req, res) => {
  const hospital_info = req.body;
  const profile_pic = req.files[0]
  if ((hospital_info.user && hospital_info.password &&
    hospital_info.name && hospital_info.description &&
    hospital_info.email &&
    profile_pic)) {
    if (!validator.validate(hospital_info.email)) {
      res.redirect(url.format({ pathname: '/Admin/Request', query: { title: 'Error en escritura', message: 'Correo electronico incorrecto', type: 'error' } }));
    }
    let val_error = "";
    let exist = false;
    await user.create({
      user: hospital_info.user,
      password: hospital_info.password,
      name: hospital_info.director_name ? hospital_info.director_name : '',
      email: hospital_info.email,
      celphone: hospital_info.celphone ? hospital_info.celphone : null,
      rol: 0,
      profile_pic: profile_pic.filename
    }).catch(error => {
      console.log(error);
      exist = true;
    })
    if (exist) {
      res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Error en registro', message: 'El usuario ya existe', type: 'error' } }));
    } else {
      await hospital.create({
        user: hospital_info.user,
        name: hospital_info.name,
        description: hospital_info.description,
        payment_type: hospital_info.payment_type ? hospital_info.payment_type : 0,
        director_name: hospital_info.director_name ? hospital_info.director_name : '',
        status: true
      }).then(e => {
        if (hospital_info.request_id) {
          solicitudes.update({
            readed: true,
          }, {
            where: {
              id: hospital_info.request_id
            }
          }).then(e => {
            var code = 'Apreciado Sr./Sra.: \n Su solicitud fue aprobada las credenciales para poder acceder al sistema son las siguientes \n';
            code += 'Usuario: ' + hospital_info.user + '\n';
            code += 'Contraseña: ' + hospital_info.password + '\n';
            code += 'Le recomendamos que cambie su contraseña al ingresar al sistema';
            code += 'https://health-road.herokuapp.com/';
            mail.send_code_web(req, res, code, hospital_info.email)
          }).catch(err => {
            res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Error en registro', message: 'El usuario ya existe', type: 'error' } }));
          })
        } else {
          res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Registro Exitoso', message: 'Registro completado exitosamente', type: 'success' } }));
        }
      }).catch(err => {
        res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Error en registro', message: 'Error al registrar el hospital', type: 'error' } }));
      })
    }
  } else {
    res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Error', message: 'Complete las credenciales', type: 'error' } }));
  }
})

router.get('/DeleteHospital/', async (req, res) => {
  user.destroy({
    where: {
      rol: 0
    },
    truncate: true
  })

})

router.get('/Request_Process/', async (req, res) => {
  const hospital_info = req.query;
  solicitudes.update({
    readed: true,
  }, {
    where: {
      id: hospital_info.request_id
    }
  }).then(e => {
    res.redirect(url.format({ pathname: '/Admin/Request', query: { title: 'Exito', message: 'Solicitud marcada como procesada', type: 'success' } }));
  }).catch(err => {
    console.log(err);
    res.redirect(url.format({ pathname: '/Admin/Request', query: { title: 'Error', message: 'Solicitud no procesada', type: 'error' } }));
  })


})

module.exports.admin_router = router;