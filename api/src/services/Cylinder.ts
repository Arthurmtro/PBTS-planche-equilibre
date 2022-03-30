import { Pca9685Driver } from "pca9685"

// Libs
import { runningOnRasberry } from "./../libs/runningOnRasberry"
import { delayFunction } from "./../libs/delayFunction"

const i2cBus = runningOnRasberry && require("i2c-bus")
/**
 * Cylinder is the class associated to a
 * cylinder, defined at it creation.
 *
 * it translate requests from @Controller to
 * the physical Rasberry
 *
 * @member {number} id
 * @member {number} backwardId
 * @member {number} forwardId
 * @member {Pca9685Driver} pca9685Driver
 */
export class Cylinder {
	public id: number
	// Cylinder Properties infos
	private backwardId: number
	private forwardId: number

	private pca9685Driver: Pca9685Driver

	constructor(id: number, forwardId: number, backwardId: number) {
		this.id = id
		this.forwardId = forwardId
		this.backwardId = backwardId

		this.pca9685Driver =
			i2cBus &&
			new Pca9685Driver(
				{
					i2c: i2cBus?.openSync(1),
					address: 0x40,
					frequency: 1000,
					debug: false,
				},
				(error: unknown) => {
					if (error) {
						throw new Error(`Error initializing, ${error}`)
					}
					this.init()
				}
			)
	}

	/**
	 * initialise a specific cylinder to his initial position
	 */
	public init() {
		try {
			if (!this.pca9685Driver) throw "pca9685Driver is not initialised !"

			// console.log("Execution de la sequence: Initialisation")

			// console.log("Cylinder " + this.id)
			this.stop()
			this.close(1)

			delayFunction(23000)

			return false
		} catch (error) {
			console.log("Cylinder:init", error)
			return true
		}
	}

	/**
	 * Open the cylinder
	 *
	 * @param {number} speed Between 0 and 1, it's the speed percent of deploy
	 */
	public open(speed: number) {
		try {
			this.stop()
			console.log("open", speed)
			this.pca9685Driver.setDutyCycle(this.forwardId, speed)
		} catch (error) {
			console.log("Cylinder:open", error)
		}
	}

	/**
	 * Close the cylinder
	 *
	 * @param {number} speed Between 0 and 1, it's the speed percent of deploy
	 */
	public close(speed: number) {
		try {
			this.stop()
			console.log("close", speed)
			this.pca9685Driver.setDutyCycle(this.backwardId, speed)
		} catch (error) {
			console.log("Cylinder:close", error)
		}
	}

	/**
	 * Stop the cylinder from any actions
	 */
	public stop() {
		try {
			this.pca9685Driver.channelOff(this.forwardId)
			this.pca9685Driver.channelOff(this.backwardId)
		} catch (error) {
			console.log("Cylinder:stop", error)
		}
	}
}
