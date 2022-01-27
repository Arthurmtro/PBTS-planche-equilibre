const apiRoutes = require("express").Router();
const os = require("os");

// Config
const debug = require("../config/debug");

// Controllers
const functions = require("../controllers/api.controller");

apiRoutes.get("/hostname/", (req, res) => {
  res.send(`hostname is ${os.hostname()}`);
});

apiRoutes.get("/fetch-cylinders-infos", async (req, res) => {
  return await functions.fetchCylindersInfos(res);
});

apiRoutes.get("/fetch-profiles", async (req, res) => {
  return await functions.fetchProfiles(res);
});

apiRoutes.get("/run-profile", (req, res) => {
  return functions.runProfileWithId(req.query.profileId, res);
});

apiRoutes.get("/init", (req, res) => {
  return functions.init(res);
});

module.exports = apiRoutes;
