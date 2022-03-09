import { Router } from "express"
import os from "os"

// Services
import { ApiController } from "./services/Controller"

const router = Router()

router.get("/hostname/", (req, res) => {
	res.send(`hostname is ${os.hostname()}`)
})

router.get("/fetch-status", async (req, res) => {
	return await ApiController.fetchStatus(res)
})

router.get("/fetch-cylinders-infos", async (req, res) => {
	return await ApiController.fetchCylindersInfos(res)
})

router.get("/fetch-profiles", async (req, res) => {
	return await ApiController.fetchProfiles(res)
})

router.get("/run-profile", (req, res) => {
	return ApiController.runProfileWithId(String(req.query.profileId), res)
})

router.post("/add-profile", (req, res) => {
	return ApiController.createProfile(req.body, res)
})

router.get("/init", (req, res) => {
	return ApiController.init(res)
})

export default router
