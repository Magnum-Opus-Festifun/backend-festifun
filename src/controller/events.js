const EventModel = require('../models/events')


const getAllEvent = async (req, res) =>{
  try {
    const [data] = await EventModel.getAllEvent();

  res.json({
    message: 'GET event success',
    data: data
  })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}


// const getAllEvent = async (req, res) => {
//   try {
//     const [data] = await EventModel.getAllEvent();

//     if (data) {
//       // console.log('Data from model:', data);

//       res.json({
//         message: 'GET event success',
//         data: {
//           ...data,
//           price: data.price || 0,
//           stock: data.stock || 0,
//         },
//       });
//     } else {
//       res.json({
//         message: 'No events found',
//         data: null,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// }

const getEventByCategory = async (req, res) => {
  const { idCategory } = req.params;

  try {
    const [data] = await EventModel.getEventByCategory(idCategory);

    if (data.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Get events by category success',
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Events not found for the specified category',
      });
    }
  } catch (error) {
    console.error('Error getting events by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};




const createNewEvent = async (req, res) => {
  const { body } = req;

  try {
    const eventResult = await EventModel.createNewEvent(body);

    if (eventResult.success) {
      res.status(201).json({
        success: true,
        message: eventResult.message,
        data: eventResult.data,
      });
    } else {
      res.status(500).json({
        success: false,
        message: eventResult.message,
      });
    }
  } catch (error) {
    console.error('Error creating new event:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};


const updateEvent = async (req, res) => {
  const {idEvent} = req.params
  const {body} = req;
  try {
    await EventModel.updateEvent(body, idEvent)
    res.json({
      message: 'UPDATE event success',
      data: {
        id: idEvent,
        ...body},
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      ServerMessage: error,
    })
  }
}

const deleteEvent = async (req, res) => {
  const { idEvent } = req.params;

  try {
    const result = await EventModel.deleteEvent(idEvent);

    if (result.success) {
      res.json({
        success: true,
        message: 'DELETE event success',
        data: null,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete event',
        ServerMessage: result.message,
      });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      ServerMessage: error.message,
    });
  }
};


const getEventByName = async (req, res) => {
  const { name } = req.query;

  try {
    const [data] = await EventModel.getEventByName(name);

    if (data.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Get events by name success',
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Events not found for the specified name',
      });
    }
  } catch (error) {
    console.error('Error getting events by name:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};





module.exports = {
  getAllEvent,
  createNewEvent,
  updateEvent,
  deleteEvent,
  getEventByCategory,
  getEventByName
}