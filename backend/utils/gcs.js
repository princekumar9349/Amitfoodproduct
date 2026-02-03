const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage();
const bucket = storage.bucket("amit-food-images-574655894161"); // your bucket name

const uploadToGCS = (file) => {
  return new Promise((resolve, reject) => {
    const filename = Date.now() + path.extname(file.originalname);
    const blob = bucket.file(filename);

    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    stream.on("error", reject);

    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};

module.exports = uploadToGCS;
