import { profileType } from "./../types/profileTypes"
import { Pca9685Driver } from "pca9685"
import { Response } from "express"
import fs from "fs"
import os from "os"

// Config
import cylindersData from "../config/cylinders.json"

// Types
import { cylinderType } from "../types/cylinderType"
import { actionType } from "../types/profileTypes"

let i2cBus

if (os.arch() === "arm" || os.arch() === "arm64") {
	// raspberrypi
	i2cBus = require("i2c-bus")
} else {
	console.warn("Not using I2C, You are not on raspberrypi", os.arch())
	i2cBus = null
}

let isActive = false

const options = {
	i2c: i2cBus?.openSync(1),
	address: 0x40,
	frequency: 1000,
	debug: false,
}

const delay = (value: number) => new Promise((res) => setTimeout(res, value))

const pwm: Pca9685Driver =
	i2cBus &&
	new Pca9685Driver(options, (err) => {
		if (err) {
			throw new Error("Error initializing, PCA9685 is null")
		}
	})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendError = (error: any, res: Response) => {
	console.log(`Errors => ${error.message}`)
	return res && res.status(666).json({ error: error.message ?? "Unknow" })
}

export const fetchStatus = async (res: Response) => {
	try {
		if (!pwm) throw new Error("PWM is not initialised !")

		res.status(200).send("Connexion OK")
	} catch (error) {
		return sendError(error, res)
	}
}

export const fetchCylindersInfos = async (res: Response) => {
	try {
		res.status(200).send(JSON.stringify(cylindersData))
	} catch (error) {
		return sendError(error, res)
	}
}

export const fetchProfiles = async (res: Response) => {
	try {
		const profilesFiles = fs.readdirSync("./config/profiles/")
		if (profilesFiles.length === 0) throw new Error("No profiles detected !")

		const allProfiles = []

		for (let index = 0; index < profilesFiles.length; index++) {
			const file = fs.readFileSync(`./config/profiles/${profilesFiles[index]}`, {
				encoding: "utf8",
				flag: "r",
			})

			const stringifiedFile = JSON.parse(file)

			Object.assign(stringifiedFile, {
				fileName: profilesFiles[index].slice(0, profilesFiles[index].indexOf(".")),
			})

			allProfiles.push(stringifiedFile)
		}

		res.status(200).send(allProfiles)
	} catch (error) {
		return sendError(error, res)
	}
}

export const runProfileWithId = async (profileId: string, res: Response) => {
	try {
		if (!pwm) throw new Error("PWM is not initialised !")

		fs.readFile(
			`./config/profiles/${profileId}.json`,
			{
				encoding: "utf8",
				flag: "r",
			},
			(err, data) => {
				if (err) throw new Error(err.message)
				const profile: profileType = JSON.parse(data)

				console.log("profile", profile)

				isActive = true

				const executeProfile = async (action: actionType, cylinder: cylinderType | undefined) => {
					if (!isActive || !cylinder) return

					for (const command of action.commands) {
						if (!isActive) return
						console.log("Execution de la séquence ", command)
						pwm.channelOff(cylinder.forwardId)
						pwm.channelOff(cylinder.backwardId)

						if (command.action !== "stop") {
							pwm.setDutyCycle(cylinder[`${command.action}Id`], command.speed)
							pwm.setDutyCycle(cylinder[`${command.action}Id`], command.speed)
						}

						await delay(command.time).then(() => command)
					}
					return
				}

				for (const action of profile.actions) {
					if (!isActive) return
					const cylinder = (cylindersData as cylinderType[]).find(({ id }) => id === action.cylinderId)

					executeProfile(action, cylinder).then(() => {
						pwm.allChannelsOff()
						console.log(`Profil ${profile.label}, cylinder "${action.cylinderId}": terminé !`)
						init(res)
					})
				}

				res.status(200).send(`Profil ${profile.label} running !`)
			}
		)
	} catch (error) {
		return sendError(error, res)
	}
}

export const init = async (res: Response) => {
	try {
		if (!pwm) throw new Error("PWM is not initialised !")

		isActive = false

		console.log("Execution de la séquence")
		for (let index = 0; index < cylindersData.length; index++) {
			console.log("Cylinder " + cylindersData[index].id)
			pwm.channelOff(cylindersData[index].backwardId)
			pwm.channelOff(cylindersData[index].forwardId)
			pwm.setDutyCycle(cylindersData[index].backwardId, 1)
		}
		delay(23000)
		if (res) {
			res.status(200).send("Initialised !")
		}
	} catch (error) {
		return sendError(error, res)
	}
}