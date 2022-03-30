import { Router } from "express"
import os from "os"

// Services
import Controller from "./services/Controller"

export const ApiController = new Controller()

const router = Router()

router.get("/", (req, res) => {
	res.send(
		"<h1  style='display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 5rem; color: pink'>Welcome to the super hyper mega giga ultra API of the dead</h1>"
	)
})

router.get("/hostname/", (req, res) => {
	return res.send(`hostname is ${os.hostname()}`)
})

router.get("/fetch-status", async (req, res) => {
	return ApiController.fetchStatus(res)
})

router.get("/fetch-cylinders-infos", async (req, res) => {
	return ApiController.fetchCylindersInfos(res)
})

router.get("/fetch-profiles", async (req, res) => {
	return ApiController.fetchProfiles(res)
})

router.get("/run-profile", (req, res) => {
	return ApiController.runProfileWithId(String(req.query.profileId), res)
})

router.post("/create-profile", (req, res) => {
	return ApiController.createProfile(req.body, res)
})

router.get("/delete-profile", (req, res) => {
	return ApiController.deleteProfile(String(req.query.fileName), res)
})

router.patch("/update-profile", (req, res) => {
	return ApiController.updateProfile(req.body, res)
})

router.get("/init", (req, res) => {
	return ApiController.init(res)
})

export default router
