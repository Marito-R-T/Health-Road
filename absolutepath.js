var path = require('path');
module.exports.static_files = path.join(__dirname, 'views')
module.exports.static_files_public = path.join(__dirname, 'public')
module.exports.static_files_pdf = path.join(path.join(__dirname, 'public'),'rates.pdf')
module.exports.root_path=__dirname

