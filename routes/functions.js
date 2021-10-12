var multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now())
    },
})

var upload = multer({
    storage: storage
});

const name_files = multer()

module.exports.upload =upload
module.exports.name_files=name_files
