const dbPool = require('../config/database')
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/token');

const getAllUser = () => {
  const SQLQuery = 'SELECT * FROM users'
  return dbPool.execute(SQLQuery)
}

const getUserById = (idUser) => {
  const SQLQuery = 'SELECT * FROM users WHERE userID = ?';
  return dbPool.execute(SQLQuery, [idUser]);
  
};

const createNewUser = async (body) => {
  try {
    const [existingUser] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [body.email]);
    
    if (existingUser.length > 0) {
      return { success: false, message: 'Email is already registered' };
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const SQLQuery = `INSERT INTO users (name, email, password, role)
                      VALUES (?, ?, ?, ?)`;
    const [result] = await dbPool.execute(SQLQuery, [body.name, body.email, hashedPassword, body.role]);

    return result;
  } catch (error) {
    throw error;
  }
};


const updateUser = (body, idUser) => {
  const SQLQuery = `UPDATE users SET name='${body.name}', email='${body.email}',password='${body.password}', age='${body.age}', gender='${body.gender}', image='${body.image}' WHERE userID=${idUser}`;

  return dbPool.execute(SQLQuery);
}

const deleteUser = (idUser) => {
  const SQLQuery = `DELETE FROM users WHERE userID=${idUser}`;

  return dbPool.execute(SQLQuery);
}


// Login User
const loginUser = async (email, password) => {
  try {
    const [userData] = await dbPool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (userData.length > 0) {
      const hashedPassword = userData[0].password;
      const role = userData[0].role;

      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        const token = generateToken(userData[0]);
        return {
          success: true,
          message: 'Login successful',
          data: {
            id: userData[0].userID,
            email: userData[0].email,
            role: role,
            token: token,
          },
        };
      } else {
        // Password doesn't match
        return {
          success: false,
          message: 'Password Anda salah.',
        };
      }
    }

    // Email not found
    return {
      success: false,
      message: 'Email belum terdaftar.',
    };
  } catch (error) {
    throw error;
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