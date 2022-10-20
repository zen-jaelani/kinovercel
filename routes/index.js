const { Router } = require("express");
const { SuccessResponseObject } = require("../common/http");
const demo = require("./demo.route");

const r = Router();

r.use("/demo", demo);

r.get("/", (req, res) => res.json("express vercel boiler plate"));

module.exports = r;
