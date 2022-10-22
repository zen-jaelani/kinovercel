const express = require("express");

const Router = express.Router();

const userController = require("./userController");
const middlewareAuth = require("../../middleware/auth");
const middlewareUpload = require("../../middleware/uploadUser");

Router.get("/:id", userController.getUserById);
Router.patch(
  "/profile",
  middlewareAuth.authentication,
  userController.updateProfile
);
Router.patch(
  "/image",
  middlewareAuth.authentication,
  middlewareUpload,
  userController.updateImage
);

Router.delete(
  "/image",
  middlewareAuth.authentication,
  userController.deleteImage
);

Router.patch(
  "/password",
  middlewareAuth.authentication,
  userController.updatePassword
);

module.exports = Router;
