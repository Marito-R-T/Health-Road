var nodemailer = require('nodemailer');
const { user } = require('../models/connection_db');
async function register_mail (req,res,code) {
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
        to: req.params.correo,
        subject: 'Asunto',
        text: code
    };
    await transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            res.send("Error al enviar")
        } else {
            user.update({code:code},{where: {user:req.params.user}}).then(e=>{
                if(e && e[0]){
                    res.status(201).send(true)
                }else{
                    res.status(400).send(false)
                }
            }).catch(err=>{
                res.status(500).send(false)
            })
            
        }
    });
};


module.exports.send_code=register_mail
