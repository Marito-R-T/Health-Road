var nodemailer = require('nodemailer');
const { user } = require('../models/connection_db');
var url = require('url');
async function register_mail (req,res,code,email) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
        user: 'healthroads141618@gmail.com',
        pass: 'healthroad$20'
        }
    });
    var mailOptions = {
        from: 'healthroads141618@gmail.com',
        to: email,
        subject: 'Credenciales',
        text: code
    };
    await transporter.sendMail(mailOptions, function(error, info){
        if (error){
            res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Error', message: 'Error al enviar correo de informacion', type: 'error' } }));
        } else {
            res.redirect(url.format({ pathname: '/Admin/Hospitals', query: { title: 'Registro Exitoso', message: 'Registro completado exitosamente', type: 'success' } }));            
        }
    });
};


module.exports.send_code_web=register_mail
