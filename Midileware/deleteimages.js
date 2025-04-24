const fs = require("fs");
const path = require("path");

const deleteImage = async (imagePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, "../storege/userdp", imagePath);
    fs.unlink(fullPath, (error) => {
      if (error) {
        console.error("Error deleting file:", error);
        return reject(error); // Reject so you can catch it later
      }
      console.log("Successfully deleted");
      resolve("deleted");
    });
  });
};

module.exports = {
  deleteImage
};
