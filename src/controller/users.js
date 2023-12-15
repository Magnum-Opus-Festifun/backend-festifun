const UserModel = require('../models/users')

const getAllUser = async (req, res) =>{
  try {
    const [data] = await UserModel.getAllUser();

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

const getUserById = async (req, res) => {
  const { idUser } = req.params; 

  try {
    const [data] = await UserModel.getUserById(idUser);

    if (data.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Get user by id success',
        data: data[0], 
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Error getting user by id:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const createNewUser = async (req, res) => {
  const { body } = req;

  try {
    const result = await UserModel.createNewUser(body);

    if (result.success === false && result.message === 'Email is already registered') {
  
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    res.status(201).json({
      success: true,
      message: 'CREATE new users success',
      data: body,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: 'Server Error',
      ServerMessage: error,
    });
  }
};


const updateUser = async (req, res) => {
  const {idUser} = req.params
  const {body} = req;
  try {
    await UserModel.updateUser(body, idUser)
    res.json({
      message: 'UPDATE user success',
      data: {
        id: idUser,
        ...body},
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      ServerMessage: error,
    })
  }
}

const deleteUser = async (req, res) => {
  const {idUser} = req.params
  try {
    await UserModel.deleteUser(idUser)
    res.json({
      message: 'DELETE user success',
      data: null
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      ServerMessage: error,
    })
  }
  
}

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await UserModel.loginUser(email, password);

    if (!userData.success) {
      return res.status(401).json(userData);
    }

    const { role } = userData.data;

    if (role === 'user') {
      return res.status(200).json({
        success: true,
        message: 'Login user success',
        data: userData.data,
      });
    }

    if (role === 'eo') {
      return res.status(200).json({
        success: true,
        message: 'Login EO success',
        data: userData.data,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login success',
      data: userData.data,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};


module.exports = {
  getAllUser,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
  loginUser,
}