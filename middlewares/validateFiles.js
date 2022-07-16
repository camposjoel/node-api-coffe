
const validateFileToUpload = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.attachment) {
    res.status(400).json({ msg: 'No attachments in request' });
    return;
  }

  next();
}

module.exports = { validateFileToUpload }