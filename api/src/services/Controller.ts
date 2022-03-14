/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cylinder } from "./Cylinder"
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
import { mpu9250 } from "./../libs/mpu9250/index"

//////////////////////

const MAG_CALIBRATION = {
	min: { x: -106.171875, y: -56.8125, z: -14.828125 },
	max: { x: 71.9609375, y: 117.17578125, z: 164.25 },
	offset: { x: -17.10546875, y: 30.181640625, z: 74.7109375 },
	scale: {
		x: 1.491020130696022,
		y: 1.5265373476123123,
		z: 1.483149376145188,
	},
}

// These values were generated using calibrate_gyro.js - you will want to create your own.
// NOTE: These are temperature dependent.
const GYRO_OFFSET = {
	x: -1.068045801,
	y: -0.156656488,
	z: 1.3846259541,
}

// These values were generated using calibrate_accel.js - you will want to create your own.
const ACCEL_CALIBRATION = {
	offset: {
		x: 0.00943176,
		y: 0.00170817,
		z: 0.05296142,
	},
	scale: {
		x: [-0.993164, 1.0102189],
		y: [-0.9981974, 1.0055884],
		z: [-0.9598844, 1.0665967],
	},
}
//////////////////////

class Controller {
	private cylindersData: cylinderType[]
	private profiles: profileType[]
	private cylinders: Cylinder[]
	private isActive: boolean
	public mpu: mpu9250

	constructor() {
		this.isActive = false
		this.profiles = fetchAllProfiles()
		this.cylindersData = require(join(__dirname, "../../config/cylinders.json"))

		// Init Cylinder
		this.cylinders = []
		for (let idxCylinder = 0; idxCylinder <= this.cylindersData.length; idxCylinder++) {
			this.cylinders.push(
				new Cylinder(
					String(idxCylinder),
					this.cylindersData[idxCylinder].forwardId,
					this.cylindersData[idxCylinder].backwardId,
					this.cylindersData[idxCylinder].maxSpeed
				)
			)
		}

		this.mpu = new mpu9250({
			// i2c path (default is '/dev/i2c-1')
			device: "/dev/i2c-1",

			// Enable/Disable debug mode (default false)
			DEBUG: true,

			// Set the Gyroscope sensitivity (default 0), where:
			//      0 => 250 degrees / second
			//      1 => 500 degrees / second
			//      2 => 1000 degrees / second
			//      3 => 2000 degrees / second
			GYRO_FS: 0,

			// Set the Accelerometer sensitivity (default 2), where:
			//      0 => +/- 2 g
			//      1 => +/- 4 g
			//      2 => +/- 8 g
			//      3 => +/- 16 g
			ACCEL_FS: 0,

			scaleValues: true,

			UpMagneto: false,

			magCalibration: MAG_CALIBRATION,

			gyroBiasOffset: GYRO_OFFSET,

			accelCalibration: ACCEL_CALIBRATION,
		})
	}

	public init(res: Response) {
		try {
			// Function async !!! WARNING !!! Maybe it can block
			for (let idxCylinder = 0; idxCylinder <= this.cylindersData.length; idxCylinder++) {
				if (this.cylinders[idxCylinder].init()) break
			}

			res.sendStatus(200)
		} catch (error) {
			console.log("error", error)
			res.status(503).send(new Error(error as string))
		}
	}

	public fetchStatus(res: Response) {
		try {
			if (!runningOnRasberry) {
				console.warn("You are not on raspberrypi", os.arch())
				res.status(200).send("Connexion OK, Not using I2C, You are not on raspberrypi")
				return
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

			if (!correspondingProfile) throw "Can't find corresponding profile"

			const executeProfile = async (action: actionType, cylinder?: Cylinder) => {
				for (const command of action.commands) {
					if (!this.isActive) return
					console.log("Execution de la séquence ", command)

					switch (command.action) {
						case "forward":
							cylinder?.open(1)
							break
						case "backward":
							cylinder?.close(1)
							break
						case "stop":
						default:
							cylinder?.stop()
							break
					}

					await delayFunction(command.time).then(() => command)
				}
				return false
			}

			for (const action of correspondingProfile.actions) {
				if (!this.isActive) throw "Active is not true"

				const cylinder = this.cylinders.find(({ id }) => id === action.cylinderId)

				executeProfile(action, cylinder).then(() => {
					console.log(`Profil ${correspondingProfile.label}, cylinder "${action.cylinderId}": terminé !`)

					if (res) this.init(res)
				})
			}

			// res?.status(200).json({ message: `Profil ${correspondingProfile.label} en cours !` })
		} catch (error) {
			console.log("error", error)
		}
	}

	public async createProfile(body: any, res: Response) {
		try {
			if (this.profiles.find((profile) => profile.label === body.label)) throw "This profile name already exist !"

			console.log("body => ", body)

			// Check if filename already exist

			// Create new profile
			// const fileName: string = body.label.trim().replace(" ", "_")

			// const profile = fileName

			// Add to the folder

			res.sendStatus(200)
		} catch (error) {
			console.log("error", error)
			res.status(401).send(error)
		}
	}
}

export const ApiController = new Controller()

if (runningOnRasberry) {
	ApiController.mpu.initialize()
}

export const getMpuInfos = () => {
	if (!runningOnRasberry) return

	console.log("\nGyro.x   Gyro.y")
	const m6: any = ApiController.mpu.getMotion6()

	if ((Math.floor(m6[3]) > -2 && Math.floor(m6[3]) < 2) || (Math.floor(m6[4]) > -2 && Math.floor(m6[4]) < 2)) {
		const stuctData = {
			gyroX: 0,
			gyroY: 0,
		}

		return stuctData
	}

	const stuctData = {
		gyroX: Math.floor(m6[3]),
		gyroY: Math.floor(m6[4]),
	}

	// process.stdout.write(m6[3], m6[4])
	return stuctData
}
