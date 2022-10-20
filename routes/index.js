const express = require("express");

const Router = express.Router();

const userRoutes = require("../modules/user/userRoutes");

Router.use("/user", userRoutes);

module.exports = Router;
