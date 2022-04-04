/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Services
import { Cylinder } from "./Cylinder"
import { convertToSpeed } from "../libs/convertors"

/**
 * Controller is the class that controll all interactions
 * between the api, the client and the rasberry
 *
 * it store all data required for the use of the project
 *
 * @member {cylinderType[]} cylindersData
 * @member {profileType[]} profiles
 * @member {Cylinder[]} Cylinders
 * @member {boolean} isActive
 * @member {MPU9250} mpu
 */
export default class Controller {
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
				if (!this.cylindersData[idxCylinder].forwardId || !this.cylindersData[idxCylinder].backwardId) {
					throw "Missing informations, cannot initialise Cylinders"
				}

				this.cylinders.push(
					new Cylinder(this.cylindersData[idxCylinder].id, this.cylindersData[idxCylinder].forwardId, this.cylindersData[idxCylinder].backwardId)
				)
			}
		} catch (error) {
			console.log("Controller:Constructor ", error)
		}
	}

	/**
	 * Ask the cylinders to initialize
	 *
	 * @param res Optional, The api response
	 */
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

	/**
	 * Fetch the status of the api,
	 * used by the client to ensure connexion is good
	 *
	 * @param res The api response
	 */
	public fetchStatus(res: Response) {
		try {
			if (!runningOnRasberry) {
				console.log("Connexion OK, Not using I2C, You are not on raspberrypi", os.arch())
				res.status(200).send("Connexion OK, Not using I2C, You are not on raspberrypi")
				return
			}

			res.sendStatus(200)
		} catch (error) {
			res.status(503).send(new Error(error as string))
		}
	}

	/**
	 * Fetch all the stored cylinder data as JSON
	 *
	 * @param res The api response
	 */
	public fetchCylindersInfos(res: Response) {
		try {
			res.status(200).send(JSON.stringify(this.cylindersData))
		} catch (error) {
			res.status(503).send(new Error(error as string))
		}
	}

	/**
	 * Fetch all the stored profiles data as JSON
	 *
	 * @param res The api response
	 */
	public fetchProfiles(res: Response) {
		try {
			if (!this.profiles) throw "No profiles in database !"

			res.status(200).send(JSON.stringify(this.profiles))
		} catch (error) {
			res.status(503).send(new Error(error as string))
		}
	}

	/**
	 * Run a specific profile with is Id (associated to it filename)
	 *
	 * @param {string} profileId The Id to run
	 * @param res The api response
	 */
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

	/**
	 * Create a new profile then store it into storage if it's OK
	 *
	 * @param {profileType} body The new profile that will be stored into the storage
	 * @param res The api response
	 */
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
			const fileName: string = body.label.trim().replace(/ /g, "_")

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

	/**
	 * Populate a specific profile with new informations
	 *
	 * @param {profileType} body The profile informations for updating profile
	 * @param res The api response
	 */
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

	/**
	 * Delete a specific profile from storage
	 *
	 * @param {string} fileName The profile filename (can be seen as an ID)
	 * @param res The api response
	 */
	public async deleteProfile(fileName: string, res: Response) {
		try {
			// Checks
			if (!fileName) throw "Missing argument: fileName"

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
