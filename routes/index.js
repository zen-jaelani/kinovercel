const { Router } = require("express");

const r = Router();

r.use("/demo", demo);

r.get("/", (req, res) => res.json("express vercel boiler plate"));

module.exports = r;
