var express = require('express');
var router = express.Router();
var url = require('url');
const { static_files_public, root_path, static_upload } = require('../absolutepath')
const fs = require('fs');
const { hospital, user, service, ambulance_driver } = require('../models/connection_db');


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

router.get('/AddDriver/', (req, res) => {

  res.render("hospital_views/register_user")

})

router.get('/update/', (req, res) => {
  let response = getHospitalInfo(req);
  if (response.message.message) {
    res.redirect(url.format({
      pathname: '/', query:
      {
        title: response.message.title,
        message: response.message.message,
        type: response.message.type
      }
    }));
  } else {
    res.render("hospital_views/update_information", { hospital: response.hospital_info });
  }



})

router.get('/Services/', (req, res) => {
  let response = getHospitalInfo(req);
  if (response.message.message) {
    res.redirect(url.format({
      pathname: '/', query:
      {
        title: response.message.title,
        message: response.message.message,
        type: response.message.type
      }
    }));
  } else {
    service.findAll({
      where: {
        deleted : false,
        hospital_user: req.session.user
      }, attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      raw: true
    }).then(val => {
      if (val) {
        let tab = {
          service: 'active show',
          users: '',
          rates: '',
          gallery: ''
        }
        res.render("hospital_views/hospital_main", { hospital: response.hospital_info, services: val, tabs: tab });
      } else {
        res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
      }
    }).catch(err => {
      console.log(err);
      res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
    })
  }




})

router.get('/Users/', (req, res) => {
  let response = getHospitalInfo(req);
  if (response.message.message) {
    res.redirect(url.format({
      pathname: '/', query:
      {
        title: response.message.title,
        message: response.message.message,
        type: response.message.type
      }
    }));
  } else {
    ambulance_driver.findAll({
      where: {
        hospital_user: req.session.user
      }, attributes: {
        exclude: ['createdAt', 'updatedAt']
      },
      raw: true
    }).then(val2 => {
      if (val2) {
        let tab = {
          service: '',
          users: 'active show',
          rates: '',
          gallery: ''
        }
        res.render("hospital_views/hospital_main", { hospital: response.hospital_info, ambulance_driver: val2, tabs: tab });
      } else {
        res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
      }
    }).catch(err => {
      console.log(err);
      res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
    })
  }




})

router.get('/Gallery/', (req, res) => {
  let response = getHospitalInfo(req);
  if (response.message.message) {
    res.redirect(url.format({
      pathname: '/', query:
      {
        title: response.message.title,
        message: response.message.message,
        type: response.message.type
      }
    }));
  } else {
    res.render("hospital_views/hospital_main", { hospital: response.hospital_info, ambulance_driver: val2, tabs: tab });
  }
})

function getHospitalInfo(req) {
  let hospital_info = {}
  let message = {}
  user.findOne({
    where: {
      user: req.session.user
    },
    include: [hospital],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
  }).then(val1 => {
    if (val1) {
      hospital_info.name = val1.Hospitals[0].name;
      hospital_info.address = val1.Hospitals[0].direction.address;
      hospital_info.email = val1.email;
      hospital_info.photo = val1.profile_pic;
      hospital_info.gallery = val1.Hospitals[0].photos;

    } else {
      message.title = 'Error';
      message.message = 'Informacion no encontrada';
      message.type = 'error'
    }
  }).catch(err => {
    message.title = 'Error';
    message.message = 'Intente de nuevo';
    message.type = 'error'
  })

  let response = { message: message, hospital_info: hospital_info };
  return response;
}

module.exports.hospital_router_views = router;