const apiRoutes = require("express").Router();

// Config
const debug = require("../config/debug");

// Controllers
const functions = require("../controllers/api.controller");

apiRoutes.get("/hostname/", (req, res) => {
  res.send(`hostname is ${debug.hostname}`);
});

apiRoutes.get("/fetch-cylinders-infos", async (req, res) => {
  return await functions.fetchCylindersInfos(res);
});

apiRoutes.get("/fetch-profiles", async (req, res) => {
  return await functions.fetchProfiles(res);
});

apiRoutes.get("/run-profile", (req, res) => {
  return functions.runProfileWithName(req.query.profileName, res);
});

module.exports = apiRoutes;
