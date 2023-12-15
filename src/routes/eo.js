const express = require('express')

const EOController = require('../controller/eo')

const router = express.Router();


//CREATE - POST
router.post('/', EOController.createNewEO)

// READ - GET
router.get('/', EOController.getAllEO)

// UPDATE - PATCH
router.patch('/:idEO', EOController.updateEO)

// DELETE - DELETE
router.delete('/:idEO', EOController.deleteEO)


module.exports = router;