const connection = require("../../config/mysql");

module.exports = {
  getUserById: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT *
        FROM user
        WHERE id = ?`,
        id,
        (error, result) => {
          if (!error) {
            const newResult = { ...result[0] };
            delete newResult.password;
            resolve(newResult);
          } else {
            reject(new Error(error.sqlMessage));
          }
        }
      );
    }),
  updateProfile: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
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

  updateImage: (id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        "UPDATE user SET ? WHERE id = ?",
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

  updatePassword: (by, id, data) =>
    new Promise((resolve, reject) => {
      connection.query(
        `UPDATE user SET ? WHERE ${by} = ?`,
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
};
