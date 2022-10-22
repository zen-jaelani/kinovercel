const connection = require("../../config/mysql");

module.exports = {
  //
  getCountSchedule: (searchMovieId, searchLocation) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total 
        FROM schedule
        WHERE movieId = ${searchMovieId}
        AND location LIKE ?`,
        [`%${searchLocation}%`],
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllSchedule: (limit, offset, sort, searchMovieId, searchLocation) =>
    new Promise((resolve, reject) => {
      const query = connection.query(
        `SELECT s.* , m.name,m.category,m.director,m.casts,m.releaseDate,m.duration,m.synopsis
        FROM schedule AS s 
        JOIN movie AS m
        ON s.movieId = m.id
        WHERE movieId = ${searchMovieId} 
        AND location LIKE '%${searchLocation}%' 
        ORDER BY ${sort} 
        LIMIT ? 
        OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            console.log(error);
            reject(new Error(error.sqlMessage));
          }
        }
      );
      console.log(query.sql);
    }),

  getScheduleById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT s.* , m.name,m.category,m.director,m.casts,m.releaseDate,m.duration,m.synopsis
        FROM schedule AS s 
        JOIN movie AS m
        ON s.movieId = m.id
        WHERE s.id = ?`,
        id,
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  createSchedule: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO schedule SET ?", data, (error, result) => {
        if (!error) {
          const newResult = { id: result.insertId, ...data };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  updateSchedule: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE schedule SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error && result.affectedRows) {
            const newResult = { id, ...data };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
  deleteSchedule: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM schedule WHERE id = ?",
        id,
        (error, result) => {
          if (!error && result.affectedRows) {
            resolve(id);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),
};
