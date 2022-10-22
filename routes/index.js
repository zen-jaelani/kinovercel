const { v4: uuidv4 } = require("uuid");
const { Router } = require("express");
const { SuccessResponseObject } = require("../common/http");
const demo = require("./demo.route");

const r = Router();

r.use("/demo", demo);

r.get("/", (req, res) =>
  res.json(new SuccessResponseObject(`express vercel boiler plate ${uuidv4()}`))
);

module.exports = r;
