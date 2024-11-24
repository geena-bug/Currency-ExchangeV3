const uuid = require('uuid')
const multer  = require('multer');
//set up multer to upload images
const storage = multer.diskStorage({
    //configure file destination i.e where the file will be saved
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    //configure the filename to be used while saving the file
    filename: function (req, file, cb) {
        //extract file extension
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        //generate new file name for the uploaded file e.g 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.jpg
        cb(null, uuid.v4() + ext)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only images are allowed'))
        }
    }
})

module.exports = upload;