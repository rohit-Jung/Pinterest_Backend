const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
//multer npm package is used to upload files to the database
//uuid package is used to generate unique id/filename for them



//using the diskStorage method of multer to store files on the device itself
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //Giving destination file path to store the files
    cb(null, "./public/images/uploads/");
  },

  filename: function (req, file, cb) {
    //generating unique id/filename for each uploaded files using v4 of uuid npm package
    const uniqueName = uuidv4();
    cb(null, uniqueName + path.extname(file.originalname));
    //Here nodejs own path module is used to give these unique id/filename their respective extensions.
    //[path.extname] method is used and extension from supplied file.originalName is extracted
  },
});



//exporting the multer with customized storage settings [destination and filename]
const upload = multer({ storage: storage });

module.exports = upload;
