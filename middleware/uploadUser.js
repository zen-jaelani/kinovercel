const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const helperWrapper = require("../helpers/wrapper");
const cloudinary = require("../config/cloudinary");

const upload = multer({
  limits: { fileSize: 1024 * 1024, files: 1 },
  fileFilter: async (req, file, cb) => {
    console.log(req.headers["content-length"]);
    console.log(path.extname(file.originalname));
    const validExtension = [".png", ".jpg", ".jpeg"];
    if (!validExtension.includes(path.extname(file.originalname))) {
      cb(new Error(`only support ${validExtension}`), false);
    }
    if (req.headers["content-length"] > 1024 * 1024) {
      cb(new Error(`file too big`), false);
    }
    cb(null, true);
  },
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "kinoKarte/user",
    },
  }),
}).single("image");

const handlingUpload = (request, response, next) => {
  upload(request, response, (error) => {
    if (error instanceof multer.MulterError) {
      return helperWrapper.response(response, 401, error.message, null);
    }
    if (error) {
      return helperWrapper.response(response, 401, error.message, null);
    }
    return next();
  });
};

module.exports = handlingUpload;
