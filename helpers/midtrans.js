const midtransClient = require("midtrans-client");
require("dotenv").config();

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = {
  post: (data) =>
    new Promise((resolve, reject) => {
      console.log(
        process.env.MIDTRANS_SERVER_KEY,
        process.env.MIDTRANS_CLIENT_KEY
      );
      console.log(Boolean(process.env.MIDTRANS_PRODUCTION));

      const parameter = {
        transaction_details: {
          order_id: data.id,
          gross_amount: data.totalPayment,
        },
        credit_card: {
          secure: true,
        },
      };

      snap
        .createTransaction(parameter)
        .then((transaction) => {
          console.log(transaction);
          resolve(transaction);
        })
        .catch((error) => {
          reject(error);
        });
    }),

  notif: (data) =>
    new Promise((resolve, reject) => {
      snap.transaction
        .notification(data)
        .then((statusResponse) => {
          resolve(statusResponse);
        })
        .catch((error) => {
          reject(error);
        });
    }),
};
