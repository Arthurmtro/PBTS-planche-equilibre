/* eslint-disable @typescript-eslint/no-explicit-any */
import Pca9685Driver from "pca9685"
import { Response } from "express"
import { join } from "path"
import os from "os"

// Types
import { actionType, profileType } from "./../types/profileTypes"
import { cylinderType } from "../types/cylinderType"

// Libs
import { fetchAllProfiles } from "../libs/fetchAllProfiles"
import { delayFunction } from "../libs/delayFunction"
import { mpu9250 } from "./../libs/mpu9250/index"
import { Stats } from "./../libs/mpu9250/Stats"

const i2cBus = os.arch() === "arm" || (os.arch() === "arm64" && require("i2c-bus"))

if (!(os.arch() === "arm" || os.arch() === "arm64")) {
	console.warn("Not using I2C, You are not on raspberrypi", os.arch())
}

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
	private pwm: Pca9685Driver
	private isActive: boolean
	public mpu: mpu9250

	constructor() {
		this.isActive = false
		this.profiles = fetchAllProfiles()
		this.cylindersData = require(join(__dirname, "../../config/cylinders.json"))
		this.pwm =
			i2cBus &&
			new Pca9685Driver(
				{
					i2c: i2cBus?.openSync(1),
					address: 0x40,
					frequency: 1000,
					debug: false,
				},
				(error) => {
					if (error) {
						throw new Error(`Error initializing, ${error}`)
					}
					this.init()
				}
			)

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

		console.log("mpu => ", this.mpu)
	}

	public init(res?: Response) {
		try {
			if (!this.pwm) throw "PWM is not initialised !"

			this.isActive = false

			console.log("Execution de la sequence")

			for (let index = 0; index < this.cylindersData.length; index++) {
				console.log("Cylinder " + this.cylindersData[index].id)
				this.pwm.channelOff(this.cylindersData[index].backwardId)
				this.pwm.channelOff(this.cylindersData[index].forwardId)
				this.pwm.setDutyCycle(this.cylindersData[index].backwardId, 1)
			}
			delayFunction(23000)

			return res
		} catch (error) {
			console.log("error", error)
		}
	}

	public async getStatus(res: Response) {
		try {
			if (!this.pwm) throw "PWM is not initialised !"

			res.status(200).send("Connexion OK")
		} catch (error) {
			return res.status(503).send(new Error(error as string))
		}
	}

	public async getCylindersInfos(res: Response) {
		try {
			res.status(200).send(JSON.stringify(this.cylindersData))
		} catch (error) {
			return res.status(503).send(new Error(error as string))
		}
	}

	public async getProfiles(res: Response) {
		try {
			if (!this.profiles) throw "Their is no profiles !"
			res.status(200).send(JSON.stringify(this.profiles))
		} catch (error) {
			return res.status(503).send(new Error(error as string))
		}
	}

	public async runProfileWithId(profileId: string, res?: Response) {
		try {
			if (!this.pwm) throw "PWM is not initialised !"
			if (profileId === undefined) throw "Their is no profile ID"

			const correspondingProfile = this.profiles.find(({ fileName }) => fileName === profileId)

			if (!correspondingProfile) throw "Can't find corresponding profile"

			this.isActive = true

			// const runProfiles = await executeProfile(this.isActive, this.pwm, this.)

			res?.status(200).json({ message: `Profil ${correspondingProfile.label} en cours !` })

			const executeProfile = async (action: actionType, cylinder?: cylinderType) => {
				if (!this.isActive || !cylinder) return

				for (const command of action.commands) {
					if (!this.isActive) return
					console.log("Execution de la séquence ", command)
					this.pwm.channelOff(cylinder.forwardId)
					this.pwm.channelOff(cylinder.backwardId)

					if (command.action !== "stop") {
						this.pwm.setDutyCycle(cylinder[`${command.action}Id`], command.speed)
						this.pwm.setDutyCycle(cylinder[`${command.action}Id`], command.speed)
					}

					await delayFunction(command.time).then(() => command)
				}
				return
			}

			for (const action of correspondingProfile.actions) {
				if (!this.isActive) throw "Active is not true"

				const cylinder = this.cylindersData.find(({ id }) => id === action.cylinderId)

				executeProfile(action, cylinder).then(() => {
					this.pwm.allChannelsOff()

					console.log(`Profil ${correspondingProfile.label}, cylinder "${action.cylinderId}": terminé !`)

					this.init()
				})
			}
		} catch (error) {
			console.log("error", error)
		}
	}
}

export const ApiController = new Controller()
