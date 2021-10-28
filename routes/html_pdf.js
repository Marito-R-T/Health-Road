const pdf = require('html-pdf')
const path_ = require('../absolutepath').static_files_pdf
module.exports.html_to_pdf =  function (data,res) {
    let content = "";
    for (const service of data){
        content += ` <h1> ${service.dataValues.name}</h1>
                    <h1> ${service.dataValues.scores} </h1> <br>`
    }
    return pdf.create(content?content:'<h1>Empty</h1>').toStream(function(err, stream) {
        if (err) {
            res.redirect(url.format({ pathname: '/Hospital/Rates', query: { title: 'Error', message: 'No se pudo procesar el archivo', type: 'error' } }));
        } else {
            res.set('Content-type', 'application/pdf');
            stream.pipe(res)
        }
    });
};