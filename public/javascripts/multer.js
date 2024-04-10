const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
      req.session.images=req.session.images || [];
      cb(null, file.originalname)
      
      if (!isFileNameExists(file.originalname, req.session.images)) {
          req.session.images.push(file.originalname);
      }
    }
  })
  const upload = multer({ storage: storage });
  function isFileNameExists(fileName, imagesArray) {
      return imagesArray.some(image => image === fileName);
  }
  module.exports = upload;
