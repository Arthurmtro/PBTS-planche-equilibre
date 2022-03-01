import { executeProfile } from "./../libs/executeProfile"
import Pca9685Driver from "pca9685"
import { Response } from "express"
import { join } from "path"
import os from "os"

// Types
import { profileType } from "./../types/profileTypes"
import { cylinderType } from "../types/cylinderType"

// Libs
import { delayFunction } from "../libs/delayFunction"
import { fetchAllProfiles } from "../libs/fetchAllProfiles"

const i2cBus = os.arch() === "arm" || (os.arch() === "arm64" && require("i2c-bus"))

if (!(os.arch() === "arm" || os.arch() === "arm64")) {
	console.warn("Not using I2C, You are not on raspberrypi", os.arch())
}

class Controller {
	private cylindersData: cylinderType[]
	private profiles: profileType[]
	private pwm: Pca9685Driver
	private isActive: boolean

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

			for (const action of correspondingProfile.actions) {
				if (!this.isActive) return

				const cylinder = this.cylindersData.find(({ id }) => id === action.cylinderId)

				executeProfile(this.isActive, this.pwm, action, cylinder).then(() => {
					this.pwm.allChannelsOff()

					console.log(`Profil ${correspondingProfile.label}, cylinder "${action.cylinderId}": terminé !`)

					this.init()
				})
			}

			res?.status(200).json({ message: `Profil ${correspondingProfile.label} en cours !` })
		} catch (error) {
			console.log("error", error)
		}
	}
}

export const ApiController = new Controller()
