const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB
  },
}).single('file');

const handleFileUpload = (req, res, next) => {
  if (!req.file) {
    console.error('No file uploaded:', req.file);
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  console.log('File uploaded successfully:', req.file);
  next();
};

module.exports = { upload, handleFileUpload };
