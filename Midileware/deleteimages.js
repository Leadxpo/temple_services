const fs = require("fs");
const path = require("path");

const deleteImage = (fileName) => {
  const filePath = path.join(__dirname, "../storege/userdp", fileName);
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // File doesn't exist, just resolve
        return resolve();
      }
      fs.unlink(filePath, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
};


module.exports = {
  deleteImage
};
