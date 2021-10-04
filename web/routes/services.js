var express = require('express');
var router = express.Router();
const { service, service_rates,sequelize} = require('../models/connection_db');
const {static_files,static_files_pdf}=require('../absolutepath')
const fs = require('fs');

router.use((express.static(static_files)))
router.use((express.static(static_files_pdf)))


router.get("/register/",(req,res)=>{
    res.render("registroServicio")
})
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

router.put('/update/', async(req, res) => {
    const service_info = req.body;
    if (service_info.name && service_info.price &&
        service_info.description && service_info.hospital_user &&
        service_info.status ) {
        let val_error = "No existe el servicio";
        const exist = await service.findOne( {where: {
            name: service_info.name,
            hospital_user: service_info.hospital_user 
        }});
       
        if(exist){
            await service.update({
                price: service_info.price,
                description: service_info.description,
                schedule: service_info.schedule?service_info.schedule:{},
                status: service_info.status,
                category_name: service_info.category_name?service_info.category_name:null
            }, {
                where: {
                    name: service_info.name,
                    hospital_user: service_info.hospital_user 
                }
            }).then(e => {
                if(e && e[0]){
                    res.send("Servicio actualizado correctamente")
                }else{
                    res.send("Id incorrecto, No se encontro el servicio")
                }
            })
            .catch(err => {
                console.log(err);
                res.send("No se pudo actualizar");
            })
        }else{
            res.send(val_error);
        }


    } else {
        res.send("error, no se pudo actualizar");
    }
})

router.put('/register_category/', async(req, res) => {
    const service_info = req.body;
    if (service_info.name && service_info.hospital_user &&
        service_info.category_name) {
        let val_error = "";
        await service.update({
                category_name: service_info.category_name
            }, {
                where: {
                        name: service_info.name,
                        hospital_user: service_info.hospital_user 
                }
            }).then(e => {
                if(e && e[0]){
                    res.send("Categoria agregada correctamente")
                }else{
                    res.send("Id incorrecto, No se encontro el servicio")
                }
            })
            .catch(err => {
                val_error = err.parent.detail ? err.parent.detail : "No se pudo agregar la categoria";
            })
        res.send(val_error);
    } else {
        res.send("error, no se pudo actualizar");
    }
})

router.delete('/delete/', async(req, res) => {
    const service_info = req.body;
    const exist = await service.findOne({
        where: {
            hospital_user: service_info.hospital_user,
            name: service_info.name,
        }
    });
    if (exist) {
        service.update({
                status: true,
            }, {
                where: {
                    hospital_user: service_info.hospital_user,
                    name: service_info.name,
                }
            }).then((e) => {
                if(e && e[0]){
                    res.send("Servicio eliminada")
                }else{
                    res.send("Id incorrecto, No se encontro el servicio")
                }
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
    } else {
        res.send("No se encontro el servicio solicitado")
    }

})

router.put('/remove-category/',(req, res) => {
    const service_info = req.body
    if(service_info.name){
        service.update({
            category_name: null,
        }, {
            where: {
                hospital_user: service_info.hospital_user,
                name: service_info.name,
            }
        }).then((e) => {
            if(e && e[0]){
                res.send("categoria eliminada")
            }else{
                res.send("Id de servicio incorrecto, No se pudo eliminar la categoria")
            }
        })
        .catch(err => {
            try {
                res.send(err.parent.detail)
            } catch (error) {
                res.send("No se pudo eliminar la categoria")
            }
        })
    }
});

//horario de servicio
router.get('/get-schedule/',async(req, res)=>{
    console.log(req.body.hospital_user)
    await service.findOne({
        where: {
            name:req.body.name,
            hospital_user:req.body.hospital_user          
        }
    }).then(e=>{
        if(e){
            res.send(e)
        }else{
            res.send("No se encontro el servicio")
        }
    }).catch(err=>{
        res.send("No se encontro el servicio")
    })
    
})

router.put('/set-schedule/',(req, res) => {
    const service_info = req.body
    const schedule = {
        "Monday":service_info.Monday,
        "Tuesday":service_info.Tuesday,
        "Thursday":service_info.Thursday,
        "Wednesday":service_info.Wednesday,
        "Friday":service_info.Friday,
        "Sunday":service_info.Sunday,
        "Saturday":service_info.Saturday,
        "Start":service_info.Start,
        "End":service_info.End
    }
    service.update({
        schedule:schedule,
    },{
        where: {
            name:service_info.name,
            hospital_user: service_info.hospital_user
        }
    }).then(e=>{
        if(e && e[0]){
            res.send("Horario actualizado")
        }else{
            res.send("Id equivocado, no se encontro el servicio");
        }
    }).catch(error=>{
        res.send("Error al establecer horario, intente de nuevo")
    })
})

//see the rates of a service
router.get("/get-rates/all-services/",async (req, res)=>{
    const rates = await service.findAll({
        include:[
            {
                model:service_rates,
                required:true,
                attributes:[]
                
            },
        ],
        attributes: [
            'name',
            [sequelize.fn('sum', sequelize.col('ServiceRates.score')),'scores']
        ],
        group:['name'],
        logging: console.log
    })
    await require('./html_pdf').html_to_pdf(rates)
    await sleep(1000)
    var data = await fs.readFileSync(static_files_pdf);
    res.contentType("application/pdf");
    res.send(data);
})

//Service mode out-of service historia 43
router.put('/mode-out-of-service/', async(req, res)=>{
    const service_info = req.body
    service.update(
        {    status:false },
        {
            where:{
                name:service_info.name,
                hospital_user: service_info.hospital_user,
            }
        }
    ).then(e=>{
        if(e && e[0]){
            res.send("El servicio esta fuera de servicio")
        }else{
            res.send("Id incorrecto, no se encontro el servicio")
        }
    }).catch(err=>{
        res.send("Error, intente de nuevo")
    })
})

//Reactive service history 75
router.put('/reactive-mode-out-of-service/', async(req, res)=>{
    const service_info = req.body
    service.update(
        {    status:true },
        {
            where:{
                name:service_info.name,
                hospital_user: service_info.hospital_user,
            }
        }
    ).then(e=>{
        if(e && e[0]){
            res.send("El servicio ha sido reactivado")
        }else{
            res.send("Id incorrecto, no se encontro el servicio")
        }
    }).catch(err=>{
        res.send("Error, intente de nuevo")
    })
})

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
module.exports.services_router = router;