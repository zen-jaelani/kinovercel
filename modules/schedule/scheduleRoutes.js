const express = require("express");

const Router = express.Router();

const scheduleController = require("./scheduleController");
const middlewareRedis = require("../../middleware/redis");
const middlewareAuth = require("../../middleware/auth");

Router.get(
  "/",
  middlewareAuth.authentication,
  middlewareRedis.getScheduleRedis,
  scheduleController.getAllSchedule
);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  middlewareRedis.getScheduleByIdRedis,
  scheduleController.getScheduleById
);
Router.post(
  "/",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.createSchedule
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.updateSchedule
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  middlewareAuth.isAdmin,
  middlewareRedis.clearScheduleRedis,
  scheduleController.deleteSchedule
);

module.exports = Router;
