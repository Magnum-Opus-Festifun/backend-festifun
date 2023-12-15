const EOModel = require('../models/eo')


const getAllEO = async (req, res) =>{
  try {
    const [data] = await EOModel.getAllEO();

  res.json({
    message: 'GET EO success',
    data: data
  })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }

  
}

const createNewEO = async (req, res) =>{
  const {body} = req;

  try {
    await EOModel.createNewEO(body);
    res.status(201).json({
      message: 'CREATE new eo success',
      data: body
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      ServerMessage: error,
    })
  }

  
}

const updateEO = async (req, res) => {
  const {idEO} = req.params
  const {body} = req;
  try {
    await EOModel.updateEO(body, idEO)
    res.json({
      message: 'UPDATE eo success',
      data: {
        id: idEO,
        ...body},
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      ServerMessage: error,
    })
  }
}

const deleteEO = async (req, res) => {
  const {idEO} = req.params
  try {
    await EOModel.deleteEO(idEO)
    res.json({
      message: 'DELETE eo success',
      data: null
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      ServerMessage: error,
    })
  }
  
}

module.exports = {
  getAllEO,
  createNewEO,
  updateEO,
  deleteEO
}