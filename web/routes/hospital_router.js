var express = require('express');
var router = express.Router();
var url = require('url');
const { static_files_public, root_path, static_upload } = require('../absolutepath')
const fs = require('fs');

const { hospital, user, service, sequelize, ambulance_driver, category, discount, service_rates } = require('../models/connection_db');
const { response } = require('express');
const { Console } = require('console');


router.use((express.static(static_files_public)))
router.get('/', async (req, res) => {
    let response = await getHospitalInfo(req);
    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.message.title,
                message: response.message.message,
                type: response.message.type
            }
        }));
    } else {
        service.findAll({
            where: {
                deleted: false,
                hospital_user: req.session.user
            },
            attributes: {
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
                res.render("hospital_views/hospital_main", { hospital: response, services: val, tabs: tab });
            } else {
                res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
            }
        }).catch(err => {
            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
        })
    }


})

router.get('/AddService/', (req, res) => {
    let categories = {};
    category.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'description']
        },
        raw: true
    }).then(val => {
        if (val) {
            res.render("hospital_views/register_service", { categories: val })

        } else {
            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
        }
    }).catch(err => {


        res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
    })


})


router.get('/AddDriver/', (req, res) => {

    res.render("hospital_views/register_user")

})

router.get('/Get_Rates/', (req, res) => {

    res.redirect("/service/get-rates/all-services")

})

router.get('/Update/', async (req, res) => {
    let response = await getHospitalInfo(req);
    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.message.title,
                message: response.message.message,
                type: response.message.type
            }
        }));
    } else {
        res.render("hospital_views/update_information", { hospital: response });
    }
})

router.get('/UpdateService/', async (req, res) => {
    let response = await getHospitalInfo(req);
    const service_info = req.query;
    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.message.title,
                message: response.message.message,
                type: response.message.type
            }
        }));
    } else {
        service.findOne({
            where: {
                deleted: false,
                hospital_user: req.session.user,
                name: service_info.name
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            raw: true
        }).then(val => {
            if (val) {
                let service_info_ = val;
                category.findAll({
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'description']
                    },
                    raw: true
                }).then(val => {
                    if (val) {
                        let categories_info = val;
                        discount.findOne({
                            where: {
                                id: service_info_.DiscountId
                            },
                            attributes: {
                                exclude: ['createdAt', 'updatedAt']
                            },
                            raw: true
                        }).then(val => {
                            if (val) {
                                let discount_info = val;
                                res.render("hospital_views/update_service", { service: service_info_, categories: categories_info, discount: discount_info });
                            } else {
                                res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
                            }
                        }).catch(err => {
                            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
                        })
                    } else {
                        res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
                    }
                }).catch(err => {
                    res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
                })
            } else {
                res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
            }
        }).catch(err => {
            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
        })
    }
})

router.get('/Services/', async (req, res) => {

    let response = await getHospitalInfo(req);

    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.title,
                message: response.message,
                type: response.type
            }
        }));
    } else {
        const rates = await service.findAll({
            where:{
                hospital_user: req.session.user,
                deleted:false
            },
            include: [{
                model: service_rates,
                required: true,
                attributes: []
            },],
            attributes: [
                'name', [sequelize.cast(sequelize.fn('AVG', sequelize.col('ServiceRates.score')),'int'), 'scores']
            ],
            group: ['name'],
            raw:true
        })
        service.findAll({
            where: {
                deleted: false,
                hospital_user: req.session.user
            },
            raw: true,
        }).then(val => {
            if (val) {
                let tab = {
                    service: 'active show',
                    users: '',
                    rates: '',
                    gallery: ''
                }
                res.render("hospital_views/hospital_main", { hospital: response, services: val, tabs: tab, rates:rates });
            } else {
                res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
            }
        }).catch(err => {

            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
        })
    }




})

router.get('/Users/', async (req, res) => {
    let response = await getHospitalInfo(req);
    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.title,
                message: response.message,
                type: response.type
            }
        }));
    } else {
        user.findAll({
            where: {
                rol: 2,
                status: true
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [{
                model: ambulance_driver,

                where: {
                    hospital_user: req.session.user
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }],
            raw: true

        }).then(val2 => {
            if (val2) {
                let tab = {
                    service: '',
                    users: 'active show',
                    rates: '',
                    gallery: ''
                }
                res.render("hospital_views/hospital_main", { hospital: response, ambulance_driver: val2, tabs: tab });
            } else {
                res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
            }
        }).catch(err => {
            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
        })
    }




})

router.get('/UpdateUsers/', async (req, res) => {
    const user_info = req.query;
    user.findOne({
        where: {
            rol: 2,
            user: user_info.user_name
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: ambulance_driver,

            where: {
                hospital_user: req.session.user
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }],

    }).then(val2 => {
        if (val2) {
            let direction_info = val2.AmbulanceDrivers[0].direction;
            res.render("hospital_views/update_user", { user: val2, direction: direction_info });
        } else {
            res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Informacion no encontrada', type: 'error' } }));
        }
    }).catch(err => {
        res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Intente de nuevo', type: 'error' } }));
    })





})

router.get('/Gallery/', async (req, res) => {
    let response = await getHospitalInfo(req);
    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.title,
                message: response.message,
                type: response.type
            }
        }));
    } else {
        let tab = {
            service: '',
            users: '',
            rates: '',
            gallery: 'active show'
        }
        res.render("hospital_views/hospital_main", { hospital: response, tabs: tab, gallery: response.gallery });
    }
})

router.get('/Rates/', async (req, res) => {
    let response = await getHospitalInfo(req);
    if (response.message) {
        res.redirect(url.format({
            pathname: '/',
            query: {
                title: response.title,
                message: response.message,
                type: response.type
            }
        }));
    } else {
        const names = await service.findAll({
            where:{
                hospital_user: req.session.user,
                deleted:false
            },
            include: [{
                model: service_rates,
                required: true,
                attributes: []
            },],
            attributes: [
                'name'
            ],
            group: ['name'],
            raw:true
        })
        const rates = await service.findAll({
            where:{
                hospital_user: req.session.user,
                deleted:false
            },
            include: [{
                model: service_rates,
                required: true,
                attributes: []
            },],
            attributes: [ [sequelize.cast(sequelize.fn('AVG', sequelize.col('ServiceRates.score')),'int'), 'scores']
            ],
            group: ['name'],
        })
        let tab = {
            service: '',
            users: '',
            rates: 'active show',
            gallery: ''
        }
        res.render("hospital_views/hospital_main", { hospital: response, tabs: tab, rates: rates, names:names });
    }
})

async function getHospitalInfo(req) {
    return new Promise((resolve, reject) => {
        //here our function should be implemented 
        let hospital_info_ = {};
        let message_ = {};
        setTimeout(() => {
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
                    hospital_info_.name = val1.Hospitals[0].name;
                    hospital_info_.address = val1.Hospitals[0].direction.address;
                    hospital_info_.direction = val1.Hospitals[0].direction;
                    hospital_info_.email = val1.email;
                    hospital_info_.photo = val1.profile_pic;
                    hospital_info_.gallery = val1.Hospitals[0].photos;
                    hospital_info_.director_name = val1.Hospitals[0].director_name;
                    hospital_info_.description = val1.Hospitals[0].description;
                    hospital_info_.celphone = val1.celphone;
                    resolve(hospital_info_);
                } else {
                    message_.title = 'Error';
                    message_.message = 'Informacion no encontrada';
                    message_.type = 'error';
                    resolve(message_);
                }


            }).catch(err => {
                message_.title = 'Error';
                message_.message = 'Intente de nuevo';
                message_.type = 'error';
                resolve(message_);
            });
        }, 100);
    });

}

module.exports.hospital_router_views = router;