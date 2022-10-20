const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.get("/verify/:token", authController.verifyEmail);
Router.post("/refresh", authController.refresh);
Router.post("/logout", authController.logout);
Router.post("/generateOTP", authController.generateOTP);
Router.post("/verifyOTP", authController.verifyOTP);
Router.post("/setPassword", authController.setPassword);

module.exports = Router;
