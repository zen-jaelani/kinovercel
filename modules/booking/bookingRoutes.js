const express = require("express");

const Router = express.Router();

const bookingController = require("./bookingController");
const middlewareAuth = require("../../middleware/auth");

Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isActive,
  bookingController.createBooking
);
Router.post(
  "/midtrans-notification",
  bookingController.postMidtransNotification
);
Router.get(
  "/id/:id",
  middlewareAuth.authentication,
  bookingController.getBookingById
);
Router.get(
  "/user/:id",
  middlewareAuth.authentication,
  bookingController.getBookingByUserId
);
Router.get(
  "/seat",
  middlewareAuth.authentication,
  bookingController.getSeatBooking
);
Router.get(
  "/dashboard",
  middlewareAuth.authentication,
  middlewareAuth.isActive,
  bookingController.getDashboard
);
Router.patch(
  "/ticket/:id",
  middlewareAuth.authentication,
  middlewareAuth.isActive,
  bookingController.updateStatus
);

module.exports = Router;
