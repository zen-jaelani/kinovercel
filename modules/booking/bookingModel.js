const connection = require("../../config/mysql");

module.exports = {
  //
  createBooking: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO booking SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = { id: result.insertId, ...data };
            console.log(newResult);
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),

  createBookingSeat: (data) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        "INSERT INTO bookingSeat SET ?",
        data,
        (error, result) => {
          if (!error) {
            const newResult = { id: result.insertId, ...data };
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),

  updatePaymentStatus: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error && result.affectedRows) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(error);
          }
        }
      );
    }),

  getBookingById: (by, id) =>
    new Promise((resolve, reject) => {
      const q = connection.query(
        `
      SELECT b.*, m.name,m.category,sc.premiere
      FROM booking b
      JOIN schedule sc on b.scheduleId = sc.id
      JOIN movie m on sc.movieId = m.id 
      WHERE ${by} = ?`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
      console.log(q.sql);
    }),

  getSeatById: (id) =>
    new Promise((resolve, reject) => {
      const q = connection.query(
        `
      SELECT GROUP_CONCAT(seat) seat
      FROM bookingSeat
      WHERE bookingId = ?
      GROUP BY bookingId`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
      console.log(q.sql);
    }),

  getSeatBooking: (scheduleId, dateBooking, timeBooking) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `
      SELECT b.scheduleId, b.timeBooking,b.dateBooking, GROUP_CONCAT(bs.seat) seat
      FROM bookingSeat bs
      JOIN booking b on b.id = bs.bookingId
      WHERE b.scheduleId = ${scheduleId}
      AND b.dateBooking = ${dateBooking}
      AND b.timeBooking = ${timeBooking}
      GROUP BY bs.bookingId`,
        (error, result) => {
          if (!error) {
            const newResult = result
              .map((x) => x.seat)
              .filter((value, index) => index === result.indexOf(value));
            console.log(newResult);

            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
      console.log(query.sql);
    }),

  getDashboard: (premiere, movieId, location) =>
    new Promise((resolve, reject) => {
      const q = connection.query(
        `
      SELECT MONTH(b.createdAt) Month, SUM(b.totalPayment) Total
      FROM schedule s
      JOIN booking b on b.scheduleId = s.id
      WHERE s.premiere LIKE '%${premiere}%'
      AND s.movieId = ${movieId}
      AND s.location LIKE ?
      GROUP BY MONTH(b.createdAt) ORDER BY Month ASC`,

        [`%${location}%`],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error));
          }
        }
      );
      console.log(q.sql);
    }),

  updateStatus: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE booking SET statusUsed = 'notActive', updatedAt = CURRENT_DATE WHERE id = ?",
        id,
        (error, result) => {
          if (!error && result.affectedRows) {
            resolve(id);
          } else {
            reject(error);
          }
        }
      );
    }),
};
