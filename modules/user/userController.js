const bcrypt = require("bcrypt");
const helperWrapper = require("../../helpers/wrapper");
const userModel = require("./userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = {
  //
  getUserById: async (request, response) => {
    try {
      const { id } = request.params;
      const result = await userModel.getUserById(id);

      if (result.length <= 0) {
        return helperWrapper.response(
          response,
          "404",
          `user by id ${id} not found`
        );
      }

      return helperWrapper.response(
        response,
        200,
        "Success get user data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "Bad Request", null);
    }
  },

  updateProfile: async (request, response) => {
    try {
      const { id } = request.decodeToken;
      const { firstName, lastName, noTelp } = request.body;
      const setData = {
        firstName,
        lastName,
        noTelp,
        updatedAt: new Date(Date.now()),
      };

      Object.keys(setData).forEach((value) => {
        if (!setData[value]) {
          delete setData[value];
        }
      });

      const result = await userModel.updateProfile(id, setData);
      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      return helperWrapper.response(response, 400, "update failed", null);
    }
  },

  updateImage: async (request, response) => {
    try {
      const { id } = request.decodeToken;

      const user = await userModel.getUserById(id);
      console.log(user.image);
      if (user.image && request.file) {
        const [imageName] = user.image.split(".");
        await cloudinary.uploader.destroy(imageName, (error, result) => {
          console.log(error, result);
        });
      }

      const [, type] = request.file.mimetype.split("/");
      const fileName = `${request.file.filename}.${type}`;
      const data = { image: fileName };

      const result = await userModel.updateImage(id, data);

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "update failed", null);
    }
  },

  deleteImage: async (request, response) => {
    try {
      const { id } = request.decodeToken;

      const user = await userModel.getUserById(id);
      if (user.image) {
        const [imageName] = user.image.split(".");
        await cloudinary.uploader.destroy(imageName, (error, result) => {
          console.log(error, result);
        });
      }

      const result = await userModel.updateImage(id, { image: null });

      return helperWrapper.response(
        response,
        200,
        "Success update data !",
        result
      );
    } catch (error) {
      console.log(error);
      return helperWrapper.response(response, 400, "update failed", null);
    }
  },

  updatePassword: async (request, response) => {
    try {
      const { id } = request.decodeToken;
      const { newPassword, confirmPassword } = request.body;

      if (newPassword !== confirmPassword) {
        return helperWrapper.response(
          response,
          400,
          "password doesn't match",
          null
        );
      }

      const setData = {
        password: bcrypt.hashSync(newPassword, 10),
        updatedAt: new Date(Date.now()),
      };

      Object.keys(setData).forEach((value) => {
        if (!setData[value]) {
          delete setData[value];
        }
      });

      const result = await userModel.updatePassword("id", id, setData);
      return helperWrapper.response(response, 200, "password changed!", result);
    } catch (error) {
      return helperWrapper.response(response, 400, "update failed", null);
    }
  },
};
