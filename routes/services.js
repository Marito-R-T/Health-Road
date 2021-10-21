var express = require('express');
var router = express.Router();
const { service, service_rates,sequelize,discount } = require('../models/connection_db');
const {static_files_public,static_files_pdf}=require('../absolutepath')
const fs = require('fs');
const pdfwritter = require('./html_pdf')
router.use((express.static(static_files_public)))
router.use((express.static(static_files_pdf)))

//historia 40
router.post('/register/', async(req, res) => {
    const service_info = req.body;
    if (service_info.name && service_info.price &&
        service_info.description
    ) {
        await service.findOne({
            where: {
                hospital_user: req.session.user , name: service_info.name
            }
        }).then(e=> {
            if(e){
                res.send("El servicio ya existe")
            }else{
                discount.create({
                    percentage: 0,
                    service_name: service_info.name,
                    date_end: new Date(2050,12,30),
                    hospital_user: req.session.user
                }).then(e=>{
                    if(e){
                        service.create({
                            name: service_info.name,
                            price: service_info.price,
                            description: service_info.description,
                            hospital_user: req.session.user,
                            DiscountId:e.id
                        })
                        res.send("Servicio registrado")
                    }else{
                        res.send("Error al crear servicio, verifique que exista el hospital")
                    }
                }).catch(error=>{
                    res.send("Error al registrar el servicio, intente de nuevo")
                })
            }
        })
        
    } else {
        res.send("Complete los campos")
    }
});

//historia 41
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
                res.send("No se pudo actualizar, intente de nuevo");
            })
        }else{
            res.send(val_error);
        }
    } else {
        res.send("error, complete los campos");
    }
})

//historia 42
router.put('/register_category/', async(req, res) => {
    const service_info = req.body;
    if (service_info.name && service_info.hospital_user &&
        service_info.category_name) {
        await service.update({
                category_name: service_info.category_name
            }, {
                where: {
                        name: service_info.name,
                        hospital_user: service_info.hospital_user 
                }
            }).then(e => {
                if(e && e[0]){
                    return res.send("Categoria agregada correctamente")
                }else{
                    return res.send("Id incorrecto, No se encontro el servicio")
                }
            })
            .catch(err => {
                res.send("Error al actualizar, intente de nuevo");
            })        
    } else {
        res.send("error, complete los campos");
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
                res.send("No se pudo eliminar, intente de nuevo")
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
            res.send("No se pudo eliminar la categoria, intente de nuevo")
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

function get_schedule(service_info) {
    if (service_info.Monday && service_info.Tuesday
        && service_info.Thursday && service_info.Wednesday
        && service_info.Friday && service_info.Sunday
        && service_info.Saturday && service_info.Start
        && service_info.End){
            return {
                "Monday":service_info.Monday=='0'?'0':'1',
                "Tuesday":service_info.Tuesday=='0'?'0':'1',
                "Thursday":service_info.Thursday=='0'?'0':'1',
                "Wednesday":service_info.Wednesday=='0'?'0':'1',
                "Friday":service_info.Friday=='0'?'0':'1',
                "Sunday":service_info.Sunday=='0'?'0':'1',
                "Saturday":service_info.Saturday=='0'?'0':'1',
                "Start":service_info.Start,
                "End":service_info.End
            }
        
    }else{
        return false
    }
}
router.put('/set-schedule/',(req, res) => {
    const service_info = req.body
    const schedule = get_schedule(service_info)
    if(schedule){
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
    }else{
        res.send("Verifique que los campos tenga valores validos")
    }
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
    pdfwritter.html_to_pdf(rates,res)
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

//Offer discount to all the services history 18
router.put('/discount/all-services/',(req, res)=>{
    const discounts = req.body
    if(discounts.percentage && discounts.date_initial && discounts.date_end){
        discount.update(
            {
                percentage:discounts.percentage,
                date_initial:new Date(discounts.date_initial),
                date_end:new Date(discounts.date_end)
            },
            {
                where: {
                    hospital_user: req.session.user
                }
            }
        ).then(e=>{
            if(e && e[0])
                res.send("Descuento establecido")
            else
                res.send("No se pudo establecer el descuento, intente de nuevo")
        }).catch(err=>{
            res.send("No se pudo establecer el descuento, intente de nuevo")
        })
    }else{
        res.send("Complete los campos")
    }
})

//Offer discount to a specific services history 19
function  validate_percentage(discounts) {
    if(!discounts.percentage){
        return true
    }
    return discounts.percentage<=100 && discounts.percentage>=0
}
router.put('/discount/specific-service/',(req, res)=>{
    const discounts = req.body
    if(!(validate_percentage(discounts))){
        res.send("El porcentaje debe ser un valor entre 0 y 100")
    }else{
        if(discounts.percentage && discounts.date_initial 
            && discounts.date_end && discounts.service_name){
            discount.update(
                {
                    percentage:discounts.percentage,
                    date_initial:new Date(discounts.date_initial),
                    date_end:new Date(discounts.date_end)
                },
                {
                    where: {
                        hospital_user: req.session.user,
                        service_name:discounts.service_name,
                    }
                }
            ).then(e=>{
                if(e && e[0])
                    res.send("Descuento establecido")
                else
                    res.send("No se pudo establecer el descuento, intente de nuevo")
            }).catch(err=>{
                res.send("No se pudo establecer el descuento, intente de nuevo")
            })
        }else{
            res.send("Complete los campos")
        }
    }
})

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
module.exports.services_router = router;
module.exports.validate_percentage = validate_percentage
module.exports.get_schedule=get_schedule