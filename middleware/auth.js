/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const helperWrapper = require("../helpers/wrapper");
require("dotenv").config();

module.exports = {
  authentication: async (request, response, next) => {
    let token = request.headers.authorization;

    if (!token) {
      return helperWrapper.response(response, 403, "Please login first", null);
    }

    [, token] = token.split(" ");

    const checkRedis = await redis.get(`accessToken:${token}`);
    if (checkRedis) {
      return helperWrapper.response(
        response,
        403,
        "token invalid! please login again",
        null
      );
    }

    jwt.verify(token, process.env.TOKENSECRET, (error, result) => {
      if (error) {
        return helperWrapper.response(response, 403, error.message, null);
      }
      // data user login dari token yang sudah di decode
      request.decodeToken = result;
      next();
    });
  },

  isAdmin: (request, response, next) => {
    // proses untuk mengecek role apakah login role admin

    if (request.decodeToken.role !== "admin") {
      return helperWrapper.response(
        response,
        400,
        "Please login with admin account",
        null
      );
    }
    next();
  },

  isActive: (request, response, next) => {
    if (request.decodeToken.status !== "active") {
      return helperWrapper.response(
        response,
        400,
        "Please activate your email first",
        null
      );
    }
    next();
  },
};
