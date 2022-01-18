const multer = require("multer");


const storage_config = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./controllers/ressources")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

// for multipart/form-data html5 forms
// this will append to the req object the body and file(s) object
// the body object will be filled as it was done by express.urlencoded method.
// the file(s) object will be filled and parsed so as it contains the passed file(s)
module.exports.upload = multer({ storage: storage_config })