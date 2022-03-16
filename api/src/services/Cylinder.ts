import { Pca9685Driver } from "pca9685"

// Libs
import { runningOnRasberry } from "./../libs/runningOnRasberry"
import { delayFunction } from "./../libs/delayFunction"

const i2cBus = runningOnRasberry && require("i2c-bus")

export class Cylinder {
	public id: string

	// Cylinder Properties infos
	private backwardId: number
	private forwardId: number
	private maxSpeed: number

	private pca9685Driver: Pca9685Driver

	constructor(id: string, forwardId: number, backwardId: number, maxSpeed: number) {
		this.id = id
		this.forwardId = forwardId
		this.backwardId = backwardId
		this.maxSpeed = maxSpeed

		this.pca9685Driver =
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

	public init() {
		try {
			if (!this.pca9685Driver) throw "pca9685Driver is not initialised !"

			console.log("Execution de la sequence: Initialisation")

			// console.log("Cylinder " + this.id)
			this.stop()
			this.close(1)

			delayFunction(23000)

			return false
		} catch (error) {
			console.log("error", error)
			return true
		}
	}

	public open(speed: number) {
		this.stop()
		console.log("open", speed)
		this.pca9685Driver.setDutyCycle(this.forwardId, speed)
	}

	public close(speed: number) {
		this.stop()
		console.log("close", speed)
		this.pca9685Driver.setDutyCycle(this.backwardId, speed)
	}

	public stop() {
		this.pca9685Driver.channelOff(this.forwardId)
		this.pca9685Driver.channelOff(this.backwardId)
	}
}
