const dbPool = require("../config/database");


const getAllEvent = () => {
  const SQLQuery = `
    SELECT
      events.eventID,
      events.name,
      events.image,
      events.description,
      events.location,
      events.dateStart,

      events.dateEnd,
      tickets.price,
      tickets.stock,
      GROUP_CONCAT(DISTINCT event_categories.categoryID) AS categoryIDs,
      GROUP_CONCAT(DISTINCT categories.name) AS categoryNames
    FROM events
    INNER JOIN event_categories ON events.eventID = event_categories.eventID
    INNER JOIN tickets ON events.eventID = tickets.eventID
    INNER JOIN categories ON event_categories.categoryID = categories.categoryID
    GROUP BY
      events.eventID,
      events.name,
      events.image,
      events.description,
      events.location,
      events.dateStart,

      events.dateEnd,
      tickets.price,
      tickets.stock;
  `;

  return dbPool.execute(SQLQuery);
};

const getEventByCategory = (idCategory) => {
  const SQLQuery = `
    SELECT
      events.eventID,
      events.name,
      events.image,
      events.description,
      events.location,
      events.dateStart,
  
      events.dateEnd,
      tickets.price,
      tickets.stock,
      GROUP_CONCAT(DISTINCT categories.name) AS categoryNames
    FROM events
    INNER JOIN event_categories ON events.eventID = event_categories.eventID
    INNER JOIN tickets ON events.eventID = tickets.eventID
    INNER JOIN categories ON event_categories.categoryID = categories.categoryID
    WHERE event_categories.categoryID = ?
    GROUP BY
      events.eventID,
      events.name,
      events.image,
      events.description,
      events.location,
      events.dateStart,
  
      events.dateEnd,
      tickets.price,
      tickets.stock;
  `;

  return dbPool.execute(SQLQuery, [idCategory]);
};

const createNewEvent = async (body) => {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    const eventSQL = `INSERT INTO events (name, image, description, location, dateStart, dateEnd)
                      VALUES (?, ?, ?, ?, ?, ?)`;

    const [eventResult] = await connection.execute(eventSQL, [
      body.name || null,
      body.image || null,
      body.description || null,
      body.location || null,
      body.dateStart || null,
      body.dateEnd || null,
    ]);

    if (eventResult.affectedRows > 0) {
      // Ambil array categoryID dari body atau berikan array kosong jika tidak ada
      const categoryIDs = body.categoryIDs || [];

      // Insert ke dalam event_categories untuk setiap categoryID
      for (const categoryID of categoryIDs) {
        const eventCategorySQL = `INSERT INTO event_categories (eventID, categoryID)
                                   VALUES (?, ?)`;
        await connection.execute(eventCategorySQL, [
          eventResult.insertId,
          categoryID,
        ]);
      }

      // Sekarang, insert ke dalam tickets
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
          message: "CREATE new event and ticket success",
          data: body, // Jika perlu mengembalikan data event yang telah dibuat
        };
      }
    }

    await connection.rollback();
    return {
      success: false,
      message: "Failed to create new event and ticket",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateEvent = (body, idEvent) => {
  const SQLQuery = `UPDATE events SET name='${body.name}', image='${body.image}',description='${body.description}', location='${body.location}', dateStart='${body.dateStart}', dateEnd='${body.dateEnd}' WHERE eventID=${idEvent}`;

  return dbPool.execute(SQLQuery);
};

const deleteEvent = async (idEvent) => {
  const connection = await dbPool.getConnection();

  try {
    await connection.beginTransaction();

    // Check if the event exists
    const checkEventQuery = "SELECT * FROM events WHERE eventID = ?";
    const [checkEventResult] = await connection.execute(checkEventQuery, [
      idEvent,
    ]);

    if (checkEventResult.length === 0) {
      // Event not found
      return {
        success: false,
        message: "Event not found",
      };
    }

    // Delete the event
    const deleteEventQuery = "DELETE FROM events WHERE eventID = ?";
    await connection.execute(deleteEventQuery, [idEvent]);

    await connection.commit();

    return {
      success: true,
      message: "Event deleted successfully",
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


const getEventByName = (name) => {
  const SQLQuery = `
    SELECT
      events.eventID,
      events.name,
      events.image,
      events.description,
      events.location,
      events.dateStart,
      events.dateEnd,
      tickets.price,
      tickets.stock,
      GROUP_CONCAT(DISTINCT event_categories.categoryID) AS categoryIDs,
      GROUP_CONCAT(DISTINCT categories.name) AS categoryNames
    FROM events
    INNER JOIN event_categories ON events.eventID = event_categories.eventID
    INNER JOIN tickets ON events.eventID = tickets.eventID
    INNER JOIN categories ON event_categories.categoryID = categories.categoryID
    WHERE events.name LIKE ?
    GROUP BY
      events.eventID,
      events.name,
      events.image,
      events.description,
      events.location,
      events.dateStart,
      events.dateEnd,
      tickets.price,
      tickets.stock;
  `;

  return dbPool.execute(SQLQuery, [`%${name}%`]);
};



module.exports = {
  getAllEvent,
  createNewEvent,
  updateEvent,
  deleteEvent,
  getEventByCategory,
  getEventByName,
};
