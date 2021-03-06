/* eslint-disable @typescript-eslint/no-explicit-any */
import { runningOnRasberry } from "./runningOnRasberry"

const i2c = runningOnRasberry && require("i2c-bus")

// MPU6050 Registers
const PWR_MGMT_1 = 0x6b,
	SMPLRT_DIV = 0x19

const CONFIG = 0x1a,
	GYRO_CONFIG = 0x1b,
	INT_ENABLE = 0x38

const ACCEL_XOUT_H = 0x3b,
	ACCEL_YOUT_H = 0x3d,
	ACCEL_ZOUT_H = 0x3f

const GYRO_XOUT_H = 0x43,
	GYRO_YOUT_H = 0x45,
	GYRO_ZOUT_H = 0x47

export default class MPU9250 {
	private bus: any
	private address: number

	constructor(i2cbus: number, mpuaddress: number) {
		this.address = mpuaddress
		if (i2c) {
			this.bus = i2c?.openSync(i2cbus)

			// On réveille le capteur
			this.bus.writeByteSync(this.address, PWR_MGMT_1, 0)
			//write to sample rate register
			this.bus.writeByteSync(this.address, SMPLRT_DIV, 7)
			//Write to Configuration register
			this.bus.writeByteSync(this.address, CONFIG, 0)
			//Write to Gyro configuration register
			this.bus.writeByteSync(this.address, GYRO_CONFIG, 24)
			//Write to interrupt enable register
			this.bus.writeByteSync(this.address, INT_ENABLE, 1)
		}
	}

	private read_raw_data(addr: number) {
		if (!this.bus) return
		const high = this.bus.readByteSync(this.address, addr)
		const low = this.bus.readByteSync(this.address, addr + 1)
		let value: number = (high << 8) + low
		if (value > 32768) {
			value = value - 65536
		}
		return value
	}

	//Read Gyroscope raw xyz
	public get_gyro_xyz() {
		if (!this.bus) return
		const x = this.read_raw_data(GYRO_XOUT_H)
		const y = this.read_raw_data(GYRO_YOUT_H)
		const z = this.read_raw_data(GYRO_ZOUT_H)
		const gyro_xyz = {
			x: x,
			y: y,
			z: z,
		}
		return gyro_xyz
	}

	//Read Accel raw xyz
	public get_accel_xyz() {
		if (!this.bus) return
		const x = this.read_raw_data(ACCEL_XOUT_H)
		const y = this.read_raw_data(ACCEL_YOUT_H)
		const z = this.read_raw_data(ACCEL_ZOUT_H)
		const accel_xyz = {
			x: x,
			y: y,
			z: z,
		}
		return accel_xyz
	}

	//Full scale range +/- 250 degree/C as per sensitivity scale factor
	// 	public get_roll_pitch(gyro_xyz: { x: number; y: number; z: number }, accel_xyz: { x: number; y: number; z: number }) {
	// 		if (!this.bus) return
	// 		const Ax = accel_xyz.x / 16384.0
	// 		const Ay = accel_xyz.y / 16384.0
	// 		const Az = accel_xyz.z / 16384.0
	// 		const Gx = gyro_xyz.x / 131.0
	// 		const Gy = gyro_xyz.y / 131.0
	// 		const Gz = gyro_xyz.z / 131.0
	// 		const roll = Ax * -100
	// 		const pitch = Ay * -100
	// 		const roll_pitch = {
	// 			roll: roll,
	// 			pitch: pitch,
	// 		}
	// 		return roll_pitch
	// 	}
}
