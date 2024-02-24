const multer  = require('multer');


// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/') // Specify the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // Generate unique filenames
    }
  })
  const upload = multer({ storage: storage });
  module.exports = upload;
