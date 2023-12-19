const express = require('express')

const EventController = require('../controller/events')

const router = express.Router();


//CREATE - POST
router.post('/', EventController.createNewEvent)

// READ - GET
router.get('/', EventController.getAllEvent)

router.get('/:idCategory', EventController.getEventByCategory)


// UPDATE - PATCH
router.patch('/:idEvent', EventController.updateEvent)

// DELETE - DELETE
router.delete('/:idEvent', EventController.deleteEvent)

router.get('/searchByName', EventController.getEventByName);


module.exports = router;