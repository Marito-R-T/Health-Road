var express = require('express');
var router = express.Router();
const { service } = require('../models/connection_db');

router.post('/register/', async(req, res) => {
    const service_info = req.body;
    if (service_info.name && service_info.price &&
        service_info.description
    ) {
        let val_error = "";
        await service.create({
                name: service_info.name,
                price: service_info.price,
                description: service_info.description,
                hospital_user: 'usuario1'
            }).then(e => {
                val_error = "servicio registrado";
            })
            .catch(err => {
                val_error = err.parent.detail;
            })
        res.send(val_error);

    } else {
        res.send("error")
    }
});

router.post('/update/', function(req, res) {
    const service_info = req.body;
    if (service_info.name && service_info.price &&
        service_info.description && service_info.hospital_user &&
        service_info.schedule && service_info.status) {
        let val_error = "";
        await service.update({
                name: service_info.name,
                price: service_info.price,
                description: service_info.description,
                schedule: service_info.schedule,
                status: service_info.status
            }, {
                where: {
                    [service.and]: [
                        { name: hospital_info.old_name },
                        { hospital_user: hospital_info.hospital_user }
                    ]
                }
            }).then(e => {
                val_error = "Actualizacion correcta";
            })
            .catch(err => {
                val_error = err.parent.detail ? err.parent.detail : "No se pudo actualizar";
            })
        res.send(val_error);
    } else {
        res.send("error, no se pudo actualizar");
    }
})

router.delete('/delete/', (req, res) => {
    const service_info = req.body;
    service.update({
            status: true,
        }, {
            where: {
                hospital_user: service_info.hospital_user,
                name: service_info.name,
            }
        }).then(() => {
            res.send("Servicio eliminado")
        })
        .catch(err => {
            if (err.parent) {
                if (err.parent.detail) {
                    res.send(err.parent.detail)
                } else {
                    res.send("No se pudo eliminar")
                }
            } else {
                res.send("No se pudo eliminar")
            }
        })
})

module.exports.services_router = router;