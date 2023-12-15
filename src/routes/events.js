const express = require('express')

const EventController = require('../controller/events')

const router = express.Router();


//CREATE - POST
router.post('/', EventController.createNewEvent)

// READ - GET
router.get('/', EventController.getAllEvent)

// UPDATE - PATCH
router.patch('/:idEvent', EventController.updateEvent)

// DELETE - DELETE
router.delete('/:idEvent', EventController.deleteEvent)


module.exports = router;