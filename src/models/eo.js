const dbPool = require('../config/database')

const getAllEO = () => {
  const SQLQuery = 'SELECT * FROM eo'
  return dbPool.execute(SQLQuery)
}

const createNewEO = (body) => {
  const SQLQuery = `INSERT INTO eo (name, email, password)
                    VALUES ('${body.name}', '${body.email}', '${body.password}')`;

  return dbPool.execute(SQLQuery);
}

const updateEO = (body, idEO) => {
  const SQLQuery = `UPDATE eo SET name='${body.name}', email='${body.email}',password='${body.password}', image='${body.image}', bio='${body.bio}' WHERE eoID=${idEO}`;

  return dbPool.execute(SQLQuery);
}

const deleteEO = (idEO) => {
  const SQLQuery = `DELETE FROM eo WHERE eoID=${idEO}`;

  return dbPool.execute(SQLQuery);
}


module.exports = {
  getAllEO,
  createNewEO,
  updateEO,
  deleteEO,
}