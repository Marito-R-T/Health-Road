var nodemailer = require('nodemailer');
const { user } = require('../models/connection_db');
async function register_mail (req,res,code) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
        user: 'ismaelherz2001@gmail.com',
        pass: 'contra'
        }
    });
    var mailOptions = {
        from: 'ismaelherz2001@gmail.com',
        to: 'connerrodas99@gmail.com',
        subject: 'Asunto',
        text: code
    };
    await transporter.sendMail(mailOptions, function(error, info){
        if (error){
            res.send("Error al enviar")
        } else {
            user.update({code:code},{where: {user:req.body.user}}).then(e=>{
                if(e && e[0]){
                    res.send(true)
                }else{
                    res.json({error:"Error, el usuario no existe"})
                }
            }).catch(err=>{
                res.json({error:"Error, el usuario no existe"})
            })
            
        }
    });
};


module.exports.send_code=register_mail
