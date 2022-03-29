/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cylinder } from "./Cylinder"
import { unlinkSync, writeFileSync } from "fs"
import { Response } from "express"
import { join } from "path"
import os from "os"

// Types
import { actionType, profileType } from "./../types/profileTypes"
import { cylinderType } from "../types/cylinderType"

// Libs
import { runningOnRasberry } from "../libs/runningOnRasberry"
import { fetchAllProfiles } from "../libs/fetchAllProfiles"
import { delayFunction } from "../libs/delayFunction"
import MPU9250 from "../libs/mpu9250"

const CYLINDER_SPEED = 4.35

export const ConvertMsToS = (ms: number) => {
	return (ms / 1000).toPrecision(5)
}

export const speedPercentToRealSpeed = (speedPercent: number) => {
	// return (speedPercent * CYLINDER_SPEED) /  100
	return (speedPercent / 100) * CYLINDER_SPEED
}

export const convertToSpeed = (opening: number, speed: number) => {
	return (opening / speedPercentToRealSpeed(speed)) * 10e2
}

class Controller {
	private cylindersData: cylinderType[]
	private profiles: profileType[]
	private cylinders: Cylinder[]
	private isActive: boolean
	public mpu: MPU9250

	constructor() {
		this.isActive = false
		this.profiles = []
		this.cylindersData = []
		this.cylinders = []

		this.mpu = new MPU9250(4, 0x68)
		try {
			this.isActive = false
			this.profiles = fetchAllProfiles()
			this.cylindersData = require(join(__dirname, "../../config/cylinders.json"))

			// Init Cylinder
			for (let idxCylinder = 0; idxCylinder < this.cylindersData.length; idxCylinder++) {
				if (!this.cylindersData[idxCylinder].forwardId || !this.cylindersData[idxCylinder].backwardId || !this.cylindersData[idxCylinder].maxSpeed) {
					throw "Missing informations, cannot initialise Cylinders"
				}

				this.cylinders.push(
					new Cylinder(
						this.cylindersData[idxCylinder].id,
						this.cylindersData[idxCylinder].forwardId,
						this.cylindersData[idxCylinder].backwardId,
						this.cylindersData[idxCylinder].maxSpeed
					)
				)
			}
		} catch (error) {
			console.log("Controller:Constructor ", error)
		}
	}

	/**
	 *
	 **/
	public init(res?: Response) {
		try {
			this.isActive = false
			for (let idxCylinder = 0; idxCylinder < this.cylinders.length; idxCylinder++) {
				if (this.cylinders[idxCylinder].init()) break
			}

			if (res) res.sendStatus(200)
		} catch (error) {
			console.log("error", error)
			if (res) res.status(503).send(new Error(error as string))
		}
	}

	public fetchStatus(res: Response) {
		try {
			if (!runningOnRasberry) {
				console.log("Connexion OK, Not using I2C, You are not on raspberrypi", os.arch())
				return res.status(200).send("Connexion OK, Not using I2C, You are not on raspberrypi")
			}

			res.status(200).send("Connexion OK")
		} catch (error) {
			res.status(503).send(new Error(error as string))
		}
	}

	public fetchCylindersInfos(res: Response) {
		try {
			res.status(200).send(JSON.stringify(this.cylindersData))
		} catch (error) {
			res.status(503).send(new Error(error as string))
		}
	}

	public fetchProfiles(res: Response) {
		try {
			if (!this.profiles) throw "No profiles in database !"

			res.status(200).send(JSON.stringify(this.profiles))
		} catch (error) {
			res.status(503).send(new Error(error as string))
		}
	}

	public async runProfileWithId(profileId: string, res?: Response) {
		try {
			if (profileId === undefined) throw "Their is no profile ID"

			const correspondingProfile = this.profiles.find(({ fileName }) => fileName === profileId)

			this.isActive = true

			if (!correspondingProfile) throw "Can't find corresponding profile"

			const executeProfile = async (action: actionType, cylinder?: Cylinder) => {
				try {
					for (const command of action.commands) {
						if (!this.isActive) throw "Active is not true"
						if (!cylinder) throw "Verrin not working"
						console.log("Execution de la séquence: ", command)

						switch (command.action) {
							case "forward":
								cylinder.open(command.speed)
								break
							case "backward":
								cylinder.close(command.speed)
								break
							case "stop":
							default:
								cylinder.stop()
								break
						}

						await delayFunction(command.time).then(() => command)
					}
				} catch (error) {
					console.log("Controller:runProfileWithId:executeProfile ", error)
				}
				return false
			}

			let finishProfileCpt = 0

			for (const action of correspondingProfile.actions) {
				if (!this.isActive) throw "Active is not true"

				const cylinder = this.cylinders.find(({ id }) => id === action.cylinderId)

				if (!cylinder) throw "Their is no corresponding Cylinder"

				executeProfile(action, cylinder).then(() => {
					finishProfileCpt++
					console.log(`Profil ${correspondingProfile.label}, cylinder "${action.cylinderId}": terminé !`)

					cylinder.stop()

					if (finishProfileCpt === correspondingProfile.actions.length) {
						this.init()
					}
				})
			}

			res?.status(200).json({ message: `Profil ${correspondingProfile.label} en cours !` })
		} catch (error) {
			console.log("error", error)
			res?.sendStatus(400)
		}
	}

	public async createProfile(body: profileType, res: Response) {
		try {
			console.log("body", body)
			// Checks
			if (!body.label) throw "Missing argument: label"
			if (!body.actions) throw "Missing argument: actions"

			if (body.actions.some((action) => action.cylinderId === null)) throw "Missing argument: cylinderId"
			if (body.actions.some((action) => !action.commands)) throw "Missing argument: commands"

			// Check if filename already exist
			if (this.profiles.find((profile) => profile.label === body.label)) throw "This profile name already exist !"

			// Create new profile
			const fileName: string = body.label.trim().split(" ").join("_")

			let duration = 0

			for (const action of body.actions) {
				let actionDuration = 0

				for (const command of action.commands) {
					if (command.action !== "stop") {
						command.time = convertToSpeed(command.opening, command.speed)
						actionDuration += command.time
					}
				}

				if (actionDuration > duration) duration = actionDuration
			}

			const profile = { ...body, fileName, duration }

			// Add to the folder
			await writeFileSync(`${join(__dirname, "../../config/profiles/")}${fileName}.json`, JSON.stringify(profile))

			this.profiles = this.profiles.concat(profile)

			res.sendStatus(200)
		} catch (error) {
			console.log("createProfile: ", error)
			res.status(400).send(error)
		}
	}

	public updateProfile(body: profileType, res: Response) {
		try {
			// Checks
			if (!body.label) throw "Missing argument: label"
			if (!body.actions) throw "Missing argument: actions"

			if (body.actions.some((action) => action.cylinderId === null)) throw "Missing argument: cylinderId"
			if (body.actions.some((action) => !action.commands || action.commands.length === 0)) throw "Missing argument: commands"

			// Check if filename already exist
			const associatedProfile = this.profiles.find((profile) => profile.fileName === body.fileName)

			if (!associatedProfile) throw "This profile does not exist !"

			associatedProfile.label = body.label
			associatedProfile.actions = body.actions

			// Add to the folder
			writeFileSync(`${join(__dirname, "../../config/profiles/")}${associatedProfile.fileName}.json`, JSON.stringify(associatedProfile))

			let duration = 0

			for (const action of associatedProfile.actions) {
				let actionDuration = 0

				console.log("action.commands = ", action.commands)

				for (const command of action.commands) {
					if (command.action !== "stop") {
						command.time = convertToSpeed(command.opening, command.speed)
						actionDuration += command.time
					}
				}

				if (actionDuration > duration) duration = actionDuration
			}

			associatedProfile.duration = duration

			this.profiles = this.profiles.filter((profile) => profile.fileName !== associatedProfile.fileName)

			this.profiles = this.profiles.concat(associatedProfile)

			res.sendStatus(200)
		} catch (error) {
			console.log("error", error)
			res.status(400).send(error)
		}
	}

	public async deleteProfile(fileName: string, res: Response) {
		try {
			// Checks
			if (!fileName) throw "Missing argument: fileName"

			console.log("fileName", fileName)

			// Check if filename already exist
			const associatedProfile = this.profiles.find((profile) => profile.fileName === fileName)

			if (!associatedProfile) throw "This profile does not exist !"

			// Add to the folder
			await unlinkSync(`${join(__dirname, "../../config/profiles/")}${fileName}.json`)

			this.profiles = this.profiles.filter((profile) => profile.fileName !== fileName)

			res.sendStatus(200)
		} catch (error) {
			console.log("error", error)
			res.status(400).send(error)
		}
	}
}

export const ApiController = new Controller()

export const getMpuInfos = () => {
	if (!runningOnRasberry) return

	const gyro_xyz = ApiController.mpu.get_gyro_xyz()
	// const accel_xyz = ApiController.mpu.get_accel_xyz()

	// const gyro_data = {
	// 	gyro_xyz: gyro_xyz,
	// 	accel_xyz: accel_xyz,
	// 	rollpitch: ApiController.mpu.get_roll_pitch(gyro_xyz, accel_xyz),
	// }

	const stuctData = {
		gyroX: gyro_xyz?.x,
		gyroY: gyro_xyz?.y,
	}

	// process.stdout.write(m6[3], m6[4])
	return stuctData
}
