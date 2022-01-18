const express = require("express");
const router = express.Router();

// Config
import debug from "../config/debug";

// Controllers
import { changeCylinderState } from "../controllers/api.controllers";

apiRoutes.get("/hostname/", (req, res) => {
  res.send(`hostname is ${debug.hostname}`);
});

apiRoutes.get("/changeMoteurValue", async (req, res) => {
  return await changeMoteurValue(Number(req.query.pulseLength), res);
});

apiRoutes.get("/changeCylinderState", (req, res) => {
  console.log(req.query);
  return changeCylinderState(
    { chanel: Number(req.query.chanel), value: Number(req.query.value) },
    res
  );
});

export default apiRoutes;
