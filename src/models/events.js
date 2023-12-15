const dbPool = require('../config/database')

const getAllEvent = () => {
  const SQLQuery = 'SELECT events.*, tickets.price, tickets.stock FROM events LEFT JOIN tickets ON events.eventID = tickets.eventID';
  return dbPool.execute(SQLQuery)
}


const createNewEvent = async (body) => {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const eventSQL = `INSERT INTO events (name, image, description, location, date, timeStart, timeEnd)
                      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [eventResult] = await connection.execute(eventSQL, [
      body.name,
      body.image,
      body.description,
      body.location,
      body.date,
      body.timeStart,
      body.timeEnd,
    ]);

    if (eventResult.affectedRows > 0) {
      const ticketSQL = `INSERT INTO tickets (price, stock, eventID)
                         VALUES (?, ?, ?)`;

      const [ticketResult] = await connection.execute(ticketSQL, [
        body.price,
        body.stock,
        eventResult.insertId,
      ]);

      if (ticketResult.affectedRows > 0) {
        await connection.commit();
        return {
          success: true,
          message: 'CREATE new event and ticket success',
          data: body,  // Jika perlu mengembalikan data event yang telah dibuat
        };
      }
    }

    await connection.rollback();
    return {
      success: false,
      message: 'Failed to create new event and ticket',
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};



const updateEvent = (body, idEvent) => {
  const SQLQuery = `UPDATE events SET name='${body.name}', image='${body.image}',description='${body.description}', location='${body.location}', date='${body.date}', timeStart='${body.timeStart}', timeEnd='${body.timeEnd}' WHERE eventID=${idEvent}`;

  return dbPool.execute(SQLQuery);
}

const deleteEvent = async (idEvent) => {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if the event exists
    const checkEventQuery = 'SELECT * FROM events WHERE eventID = ?';
    const [checkEventResult] = await connection.execute(checkEventQuery, [idEvent]);

    if (checkEventResult.length === 0) {
      // Event not found
      return {
        success: false,
        message: 'Event not found',
      };
    }

    // Delete the event
    const deleteEventQuery = 'DELETE FROM events WHERE eventID = ?';
    await connection.execute(deleteEventQuery, [idEvent]);

    await connection.commit();

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};



module.exports = {
  getAllEvent,
  createNewEvent,
  updateEvent,
  deleteEvent,
}