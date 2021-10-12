const pdf = require('html-pdf')
const path_ = require('../absolutepath').static_files_pdf
module.exports.html_to_pdf =  async function (data) {
    let content = "";
    //` `;
    for (const service of data){
        content += ` <h1> ${service.dataValues.name}</h1>
                    <h1> ${service.dataValues.scores} </h1> <br>`
    }
   await pdf.create(content).toFile(path_, function(err, res) {
       
    });
};