const UserModel = require('../models/users')

const getAllUsers = async (req, res) =>{
  try {
    const [data] = await UserModel.getAllUsers();

  res.json({
    message: 'GET users success',
    data: data
  })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }

  
}

const createNewUser = (req, res) =>{
  console.log(req.body);
  
  res.json({
    message: 'CREATE new users success',
    data: req.body
  })
}

const updateUser = (req, res) => {
  const {idUser} = req.params
  console.log('idUser:', idUser)
  res.json({
    message: 'UPDATE user success',
    data: req.body
  })
}

const deleteUser = (req, res) => {
  const {idUser} = req.params
  res.json({
    message: 'DELETE user success',
    data: {
      id: idUser,
      name: "Emma",
      email: "emma@gmail.com",
      address: "Pulau Derawan"
    }
  })
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}