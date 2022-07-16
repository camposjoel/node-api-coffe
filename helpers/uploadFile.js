const path = require('path');
const { v4: uuidv4 } = require('uuid');

const saveFile = (files, extensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

  return new Promise((resolve, reject) => {
    const { attachment } = files;
    const nameSplitted = attachment.name.split('.');
    const extension = nameSplitted.pop();

    if (!extensions.includes(extension)) {
      return reject(`Extension ${extension} is not valid. Valids ${extensions}`);
    }

    const nameId = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', folder, nameId);
    attachment.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nameId);
    });
  });
}

module.exports = { saveFile }
