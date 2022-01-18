const apiRoutes = require("express").Router();

// Config
const debug = require("../config/debug");

// Controllers
const functions = require("../controllers/api.controller");

apiRoutes.get("/hostname/", (req, res) => {
  res.send(`hostname is ${debug.hostname}`);
});

apiRoutes.get("/changeMoteurValue", async (req, res) => {
  return await changeMoteurValue(Number(req.query.pulseLength), res);
});

apiRoutes.get("/changeCylinderState", (req, res) => {
  console.log(req.query);
  return functions.changeCylinderState(
    { chanel: Number(req.query.chanel), value: Number(req.query.value) },
    res
  );
});

module.exports = apiRoutes;
