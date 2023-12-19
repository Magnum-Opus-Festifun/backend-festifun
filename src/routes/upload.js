const express = require('express');
const { uploadToDrive } = require('../controller/uploadController');
const router = express.Router();

router.post('/', uploadToDrive);

module.exports = router;
