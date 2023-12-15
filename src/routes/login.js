const express = require('express')

const UserController = require('../controller/users')

const router = express.Router();

router.post('/', UserController.loginUser);


module.exports = router;