const connection = require("../../config/mysql");

module.exports = {
  //
  getCountMovie: (searchName, searchRelease) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total 
        FROM movie
        WHERE MONTH(releaseDate) = ${searchRelease} 
        AND name LIKE ? `,
        [`%${searchName}%`],
        (error, result) => {
          if (!error) {
            resolve(result[0].total);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getAllMovie: (limit, offset, sort, searchName, searchRelease) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT * 
        FROM movie 
        WHERE name LIKE '%${searchName}%' 
        AND MONTH(releaseDate) = ${searchRelease} 
        ORDER BY ${sort} 
        LIMIT ? 
        OFFSET ?`,
        [limit, offset],
        (error, result) => {
          if (!error) {
            resolve(result);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),

  getMovieById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM movie WHERE id = ?",
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

  createMovie: (data) =>
    new Promise((resolve, reject) => {
      connection.query("INSERT INTO movie SET ?", data, (error, result) => {
        if (!error) {
          const newResult = { id: result.insertId, ...data };
          resolve(newResult);
        } else {
          reject(new Error(error.sqlMessage));
        }
      });
    }),

  updateMovie: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE movie SET ? WHERE id = ?",
        [data, id],
        (error, result) => {
          if (!error && result.affectedRows) {
            const newResult = {
              id,
              ...data,
            };
            resolve(newResult);
          } else {
            reject(new Error(error));
          }
        }
      );
    }),

  deleteMovie: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM movie WHERE id = ?",
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
