import { Router } from "express"
import os from "os"

// Controllers
import * as functions from "./controllers/api.controller"

const router = Router()

router.get("/hostname/", (req, res) => {
	res.send(`hostname is ${os.hostname()}`)
})

router.get("/fetch-status", async (req, res) => {
	return await functions.fetchStatus(res)
})

router.get("/fetch-cylinders-infos", async (req, res) => {
	return await functions.fetchCylindersInfos(res)
})

router.get("/fetch-profiles", async (req, res) => {
	return await functions.fetchProfiles(res)
})

router.get("/run-profile", (req, res) => {
	return functions.runProfileWithId(String(req.query.profileId), res)
})

router.get("/init", (req, res) => {
	return functions.init(res)
})

export default router
