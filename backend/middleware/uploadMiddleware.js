const multer = require("multer");

const storage = multer.memoryStorage();

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|jfif/;
  const extname = filetypes.test(
    require("path").extname(file.originalname).toLowerCase(),
  );
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;
