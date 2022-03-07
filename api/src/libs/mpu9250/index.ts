/* eslint-disable @typescript-eslint/no-explicit-any */
import { MPU9250Map } from "./maps"
import { IConfig } from "./iconfig"
import extend from "extend"
import { Debug } from "./debug"
import { I2cService } from "./i2c-service"
import { msleep } from "./sleep"

export class mpu9250 {
	private static readonly _DEFAULT_GYRO_OFFSET = { x: 0, y: 0, z: 0 }

	private static readonly _DEFAULT_ACCEL_CALIBRATION = {
		offset: { x: 0, y: 0, z: 0 },
		scale: {
			x: [-1, 1],
			y: [-1, 1],
			z: [-1, 1],
		},
	}

	private static readonly _CLK_RNG = [
		"0 (Internal 20MHz oscillator)",
		"1 (Auto selects the best available clock source)",
		"2 (Auto selects the best available clock source)",
		"3 (Auto selects the best available clock source)",
		"4 (Auto selects the best available clock source)",
		"5 (Auto selects the best available clock source)",
		"6 (Internal 20MHz oscillator)",
		"7 (Stops the clock and keeps timing generator in reset)",
	]

	private static readonly _STR_FS_ACCEL_RANGE = ["±2g (0)", "±4g (1)", "±8g (2)", "±16g (3)"]

	private static readonly _STR_FS_GYRO_RANGE = ["+250dps (0)", "+500 dps (1)", "+1000 dps (2)", "+2000 dps (3)"]

	private static readonly _FS_GYRO_RANGE = [MPU9250Map.GYRO_FS_250, MPU9250Map.GYRO_FS_500, MPU9250Map.GYRO_FS_1000, MPU9250Map.GYRO_FS_2000]

	private static readonly _FS_ACCEL_RANGE = [MPU9250Map.ACCEL_FS_2, MPU9250Map.ACCEL_FS_4, MPU9250Map.ACCEL_FS_8, MPU9250Map.ACCEL_FS_16]

	public static readonly MPU9250 = MPU9250Map

	public accelScalarInv = 0
	public gyroScalarInv = 0
	public readonly i2c: I2cService
	public readonly debug: Debug

	private readonly _config: IConfig

	constructor(config: IConfig) {
		const _default = {
			device: "/dev/i2c-1",
			address: MPU9250Map.I2C_ADDRESS_AD0_LOW,
			DEBUG: false,
			scaleValues: false,
			GYRO_FS: 0,
			ACCEL_FS: 2,
			gyroBiasOffset: mpu9250._DEFAULT_GYRO_OFFSET,
			accelCalibration: mpu9250._DEFAULT_ACCEL_CALIBRATION,
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this._config = extend({}, _default, config && config instanceof Object ? config : {})

		if (!this._config.device) {
			throw new Error("Device parameter required!")
		}
		if (!this._config.address) {
			throw new Error("Address parameter required!")
		}

		this.debug = new Debug(this._config.DEBUG || false)
		this.i2c = new I2cService(this._config.address, { device: this._config.device })
	}

	public initialize(): boolean {
		this.debug.log("info", "Initialization MPU9250 ....")
		// clear configuration
		this.resetConfig()

		// defined sample rate
		if (this._config?.SAMPLE_RATE && this.hasSampleRate) {
			this.setSampleRate(this._config.SAMPLE_RATE)
			msleep(100)
		}

		// define DLPF_CFG
		if (this._config?.DLPF_CFG) {
			this.setDLPFConfig(this._config.DLPF_CFG)
			msleep(100)
		}

		// define A_DLPF_CFG
		if (this._config?.A_DLPF_CFG) {
			this.setAccelDLPFConfig(this._config.A_DLPF_CFG)
			msleep(100)
		}

		// define clock source
		this.setClockSource(MPU9250Map.CLOCK_PLL_XGYRO)
		msleep(10)

		// define gyro range
		this.setFullScaleGyroRange(this._getFsGyroValue(this._config?.GYRO_FS || -1))
		msleep(10)

		// define accel range
		this.setFullScaleAccelRange(this._getFsAccelValue(this._config.ACCEL_FS || -1))
		msleep(10)

		// disable sleepEnabled
		this.setSleepEnabled(false)
		msleep(10)

		this.debug.log("info", "END of MPU9150 initialization.")

		// Print out the configuration
		if (this._config?.DEBUG) {
			this.printSettings()
			this.printAccelSettings()
			this.printGyroSettings()
		}

		return true
	}

	public async initializeAsync(): Promise<boolean> {
		this.debug.log("info", "Initialization MPU9250 ....")
		// clear configuration
		await this.resetConfigAsync()

		// defined sample rate
		if (this._config?.SAMPLE_RATE && this.hasSampleRate) {
			await this.setSampleRateAsync(this._config.SAMPLE_RATE)
		}

		// define DLPF_CFG
		if (this._config?.DLPF_CFG) {
			await this.setDLPFConfigAsync(this._config.DLPF_CFG)
		}

		// define A_DLPF_CFG
		if (this._config?.A_DLPF_CFG) {
			await this.setAccelDLPFConfigAsync(this._config.A_DLPF_CFG)
		}

		// define clock source
		await this.setClockSourceAsync(MPU9250Map.CLOCK_PLL_XGYRO)

		// define gyro range
		await this.setFullScaleGyroRangeAsync(this._getFsGyroValue(this._config?.GYRO_FS || -1))

		// define accel range
		await this.setFullScaleAccelRangeAsync(this._getFsAccelValue(this._config.ACCEL_FS || -1))

		// disable sleepEnabled
		await this.setSleepEnabledAsync(false)

		this.debug.log("info", "END of MPU9150 initialization.")

		// Print out the configuration
		if (this._config?.DEBUG) {
			this.printSettings()
			this.printAccelSettings()
			this.printGyroSettings()
		}

		return await this.testDeviceAsync()
	}

	public resetConfig(): void {
		this.i2c.writeBit(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_DEVICE_RESET_BIT, 1)
		msleep(10)
		this.debug.log("info", "Reset configuration MPU9250.")
	}

	public async resetConfigAsync(): Promise<void> {
		await this.i2c.writeBitAsync(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_DEVICE_RESET_BIT, 1)
		this.debug.log("info", "Reset configuration MPU9250.")
	}

	public testDevice(): boolean {
		const currentDeviceID = this.getIDDevice()
		console.log(currentDeviceID)
		return !!(currentDeviceID && (currentDeviceID === MPU9250Map.ID_MPU_9250 || currentDeviceID === MPU9250Map.ID_MPU_9255))
	}

	public async testDeviceAsync(): Promise<boolean> {
		const currentDeviceID = await this.getIDDeviceAsync()
		return !!(currentDeviceID && (currentDeviceID === MPU9250Map.ID_MPU_9250 || currentDeviceID === MPU9250Map.ID_MPU_9255))
	}

	public getIDDevice(): number | false {
		if (this.i2c) {
			return this.i2c.readByte(MPU9250Map.WHO_AM_I)
		}
		return false
	}

	public getIDDeviceAsync(): Promise<number | false> {
		if (this.i2c) {
			return this.i2c.readByteAsync(MPU9250Map.WHO_AM_I)
		}
		return Promise.resolve(false)
	}

	public getMotion6(): number[] | false {
		if (this.i2c) {
			const buffer = this.i2c.readBytes(MPU9250Map.ACCEL_XOUT_H, 14)

			const gCal = this._config.gyroBiasOffset
			const aCal = this._config.accelCalibration

			if (!gCal || !aCal) {
				return false
			}

			const xAccel = buffer.readInt16BE(0) * this.accelScalarInv
			const yAccel = buffer.readInt16BE(2) * this.accelScalarInv
			const zAccel = buffer.readInt16BE(4) * this.accelScalarInv

			return [
				mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
				mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
				mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
				// Skip Temperature - bytes 6:7
				buffer.readInt16BE(8) * this.gyroScalarInv + gCal.x,
				buffer.readInt16BE(10) * this.gyroScalarInv + gCal.y,
				buffer.readInt16BE(12) * this.gyroScalarInv + gCal.z,
			]
		}
		return false
	}

	public async getMotion6Async(): Promise<number[] | false> {
		if (this.i2c) {
			const buffer = await this.i2c.readBytesAsync(MPU9250Map.ACCEL_XOUT_H, 14)

			const gCal = this._config.gyroBiasOffset
			const aCal = this._config.accelCalibration

			if (!gCal || !aCal) {
				return false
			}

			const xAccel = buffer.readInt16BE(0) * this.accelScalarInv
			const yAccel = buffer.readInt16BE(2) * this.accelScalarInv
			const zAccel = buffer.readInt16BE(4) * this.accelScalarInv

			return [
				mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
				mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
				mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
				// Skip Temperature - bytes 6:7
				buffer.readInt16BE(8) * this.gyroScalarInv + gCal.x,
				buffer.readInt16BE(10) * this.gyroScalarInv + gCal.y,
				buffer.readInt16BE(12) * this.gyroScalarInv + gCal.z,
			]
		}
		return false
	}

	public getAccel(): number[] | false {
		if (this.i2c) {
			const buffer = this.i2c.readBytes(MPU9250Map.ACCEL_XOUT_H, 6)
			const aCal = this._config.accelCalibration

			if (!aCal) {
				return false
			}

			const xAccel = buffer.readInt16BE(0) * this.accelScalarInv
			const yAccel = buffer.readInt16BE(2) * this.accelScalarInv
			const zAccel = buffer.readInt16BE(4) * this.accelScalarInv

			return [
				mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
				mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
				mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
			]
		}
		return false
	}

	public async getAccelAsync(): Promise<number[] | false> {
		if (this.i2c) {
			const buffer = await this.i2c.readBytesAsync(MPU9250Map.ACCEL_XOUT_H, 6)
			const aCal = this._config.accelCalibration

			if (!aCal) {
				return false
			}

			const xAccel = buffer.readInt16BE(0) * this.accelScalarInv
			const yAccel = buffer.readInt16BE(2) * this.accelScalarInv
			const zAccel = buffer.readInt16BE(4) * this.accelScalarInv

			return [
				mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
				mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
				mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
			]
		}
		return false
	}

	public getGyro(): number[] | false {
		if (this.i2c) {
			const buffer = this.i2c.readBytes(MPU9250Map.GYRO_XOUT_H, 6)
			const gCal = this._config.gyroBiasOffset

			if (!gCal) {
				return false
			}

			return [
				buffer.readInt16BE(0) * this.gyroScalarInv + gCal.x,
				buffer.readInt16BE(2) * this.gyroScalarInv + gCal.y,
				buffer.readInt16BE(4) * this.gyroScalarInv + gCal.z,
			]
		}
		return false
	}

	public async getGyroAsync(): Promise<number[] | false> {
		if (this.i2c) {
			const buffer = await this.i2c.readBytesAsync(MPU9250Map.GYRO_XOUT_H, 6)
			const gCal = this._config.gyroBiasOffset

			if (!gCal) {
				return false
			}

			return [
				buffer.readInt16BE(0) * this.gyroScalarInv + gCal.x,
				buffer.readInt16BE(2) * this.gyroScalarInv + gCal.y,
				buffer.readInt16BE(4) * this.gyroScalarInv + gCal.z,
			]
		}
		return false
	}

	public getSleepEnabled(): number | false {
		if (this.i2c) {
			return this.i2c.readBit(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_SLEEP_BIT)
		}
		return false
	}

	public async getSleepEnabledAsync(): Promise<number | false> {
		if (this.i2c) {
			return this.i2c.readBitAsync(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_SLEEP_BIT)
		}
		return false
	}

	public getClockSource(): number | false {
		if (this.i2c) {
			return this.i2c.readByte(MPU9250Map.RA_PWR_MGMT_1) & 0x07
		}
		return false
	}

	public async getClockSourceAsync(): Promise<number | false> {
		if (this.i2c) {
			return (await this.i2c.readByteAsync(MPU9250Map.RA_PWR_MGMT_1)) & 0x07
		}
		return false
	}

	public getFullScaleGyroRange(): number | false {
		if (this.i2c) {
			let byte = this.i2c.readByte(MPU9250Map.RA_GYRO_CONFIG)
			byte = byte & 0x18
			byte = byte >> 3
			return byte
		}
		return false
	}

	public async getFullScaleGyroRangeAsync(): Promise<number | false> {
		if (this.i2c) {
			let byte = await this.i2c.readByteAsync(MPU9250Map.RA_GYRO_CONFIG)
			byte = byte & 0x18
			byte = byte >> 3
			return byte
		}
		return false
	}

	public getGyroPowerSettings(): number[] | false {
		if (this.i2c) {
			let byte = this.i2c.readByte(MPU9250Map.RA_PWR_MGMT_2)
			byte = byte & 0x07
			return [
				(byte >> 2) & 1, // X
				(byte >> 1) & 1, // Y
				(byte >> 0) & 1, // Z
			]
		}
		return false
	}

	public async getGyroPowerSettingsAsync(): Promise<number[] | false> {
		if (this.i2c) {
			let byte = await this.i2c.readByteAsync(MPU9250Map.RA_PWR_MGMT_2)
			byte = byte & 0x07
			return [
				(byte >> 2) & 1, // X
				(byte >> 1) & 1, // Y
				(byte >> 0) & 1, // Z
			]
		}
		return false
	}

	public getAccelPowerSettings(): number[] | false {
		if (this.i2c) {
			let byte = this.i2c.readByte(MPU9250Map.RA_PWR_MGMT_2)
			byte = byte & 0x38
			return [
				(byte >> 5) & 1, // X
				(byte >> 4) & 1, // Y
				(byte >> 3) & 1, // Z
			]
		}
		return false
	}

	public async getAccelPowerSettingsAsync(): Promise<number[] | false> {
		if (this.i2c) {
			let byte = await this.i2c.readByteAsync(MPU9250Map.RA_PWR_MGMT_2)
			byte = byte & 0x38
			return [
				(byte >> 5) & 1, // X
				(byte >> 4) & 1, // Y
				(byte >> 3) & 1, // Z
			]
		}
		return false
	}

	public getFullScaleAccelRange(): number | false {
		if (this.i2c) {
			let byte = this.i2c.readByte(MPU9250Map.RA_ACCEL_CONFIG_1)
			byte = byte & 0x18
			byte = byte >> 3
			return byte
		}
		return false
	}

	public async getFullScaleAccelRangeAsync(): Promise<number | false> {
		if (this.i2c) {
			let byte = await this.i2c.readByteAsync(MPU9250Map.RA_ACCEL_CONFIG_1)
			byte = byte & 0x18
			byte = byte >> 3
			return byte
		}
		return false
	}

	public getByPASSEnabled(): number | false {
		if (this.i2c) {
			return this.i2c.readBit(MPU9250Map.RA_INT_PIN_CFG, MPU9250Map.INTCFG_BYPASS_EN_BIT)
		}
		return false
	}

	public getByPASSEnabledAsync(): Promise<number | false> {
		if (this.i2c) {
			return this.i2c.readBitAsync(MPU9250Map.RA_INT_PIN_CFG, MPU9250Map.INTCFG_BYPASS_EN_BIT)
		}
		return Promise.resolve(false)
	}

	public getI2CMasterMode(): number | false {
		if (this.i2c) {
			return this.i2c.readBit(MPU9250Map.RA_USER_CTRL, MPU9250Map.USERCTRL_I2C_MST_EN_BIT)
		}
		return false
	}

	public getI2CMasterModeAsync(): Promise<number | false> {
		if (this.i2c) {
			return this.i2c.readBitAsync(MPU9250Map.RA_USER_CTRL, MPU9250Map.USERCTRL_I2C_MST_EN_BIT)
		}
		return Promise.resolve(false)
	}

	public getPitch(value: number[]): number {
		return (Math.atan2(value[0], value[2]) + Math.PI) * (180 / Math.PI) - 180
	}

	public getRoll(value: number[]): number {
		return (Math.atan2(value[1], value[2]) + Math.PI) * (180 / Math.PI) - 180
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getYaw(value: number[]): 0 {
		return 0
	}

	printSettings(): void {
		this.debug.log("info", "MPU9250:")
		if (this._config?.address) {
			this.debug.log("info", `--> Device address: 0x${this._config.address.toString(16)}`)
			this.debug.log("info", `--> i2c bus: 0x${this.getIDDevice().toString(16)}`)
			this.debug.log("info", `--> Device ID: 0x${this.getIDDevice().toString(16)}`)
			this.debug.log("info", `--> BYPASS enabled: ${this.getByPASSEnabled() ? "Yes" : "No"}`)
			this.debug.log("info", `--> SleepEnabled Mode: ${this.getSleepEnabled() === 1 ? "On" : "Off"}`)
			this.debug.log("info", `--> i2c Master Mode: ${this.getI2CMasterMode() === 1 ? "Enabled" : "Disabled"}`)
			this.debug.log("info", "--> Power Management (0x6B, 0x6C):")
			this.debug.log("info", `  --> Clock Source: ${mpu9250._CLK_RNG[this.getClockSource() || 0]}`)
			this.debug.log("info", `  --> Accel enabled (x, y, z): ${mpu9250.vectorToYesNo(this.getAccelPowerSettings() || [1, 1, 1])}`)
			this.debug.log("info", `  --> Gyro enabled (x, y, z): ${mpu9250.vectorToYesNo(this.getGyroPowerSettings() || [1, 1, 1])}`)
		} else {
			this.debug.log("error", "No address defined!")
		}
	}

	public printAccelSettings(): void {
		this.debug.log("info", "Accelerometer:")
		this.debug.log("info", `--> Full Scale Range (0x1C): ${mpu9250._STR_FS_ACCEL_RANGE[this.getFullScaleAccelRange() || 0]}`)
		this.debug.log("info", `--> Scalar: 1/${1 / this.accelScalarInv}`)
		this.debug.log("info", "--> Calibration:")
		this.debug.log("info", "  --> Offset:")
		if (this._config?.accelCalibration?.offset) {
			this.debug.log("info", `    --> x: ${this._config.accelCalibration.offset.x}`)
			this.debug.log("info", `    --> y: ${this._config.accelCalibration.offset.y}`)
			this.debug.log("info", `    --> z: ${this._config.accelCalibration.offset.z}`)
		} else {
			this.debug.log("error", "    --> accelCalibration offset not defined!")
		}
		this.debug.log("info", "  --> Scale:")
		if (this._config?.accelCalibration?.scale) {
			this.debug.log("info", `    --> x: ${this._config.accelCalibration.scale.x}`)
			this.debug.log("info", `    --> y: ${this._config.accelCalibration.scale.y}`)
			this.debug.log("info", `    --> z: ${this._config.accelCalibration.scale.z}`)
		} else {
			this.debug.log("error", "    --> accelCalibration scale not defined!")
		}
	}

	public printGyroSettings(): void {
		this.debug.log("info", "Gyroscope:")
		this.debug.log("info", `--> Full Scale Range (0x1B): ${mpu9250._STR_FS_GYRO_RANGE[this.getFullScaleGyroRange() || 0]}`)
		this.debug.log("info", `--> Scalar: 1/${1 / this.gyroScalarInv}`)
		this.debug.log("info", "--> Bias Offset:")
		if (this._config?.gyroBiasOffset) {
			this.debug.log("info", `  --> x: ${this._config.gyroBiasOffset.x}`)
			this.debug.log("info", `  --> y: ${this._config.gyroBiasOffset.y}`)
			this.debug.log("info", `  --> z: ${this._config.gyroBiasOffset.z}`)
		} else {
			this.debug.log("error", "    --> gyroBiasOffset offset not defined!")
		}
	}

	public setClockSource(adrs: number): number | false {
		if (this.i2c) {
			this.i2c.writeBits(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_CLKSEL_BIT, MPU9250Map.PWR1_CLKSEL_LENGTH, adrs)
			return adrs
		}
		return false
	}

	public async setClockSourceAsync(adrs: number): Promise<number | false> {
		if (this.i2c) {
			await this.i2c.writeBitsAsync(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_CLKSEL_BIT, MPU9250Map.PWR1_CLKSEL_LENGTH, adrs)
			return adrs
		}
		return Promise.resolve(false)
	}

	public setFullScaleGyroRange(adrs: number): number | false {
		if (this.i2c) {
			this._setGyroScalarInv(adrs)
			this.i2c.writeBits(MPU9250Map.RA_GYRO_CONFIG, MPU9250Map.GCONFIG_FS_SEL_BIT, MPU9250Map.GCONFIG_FS_SEL_LENGTH, adrs)
			return adrs
		}
		return false
	}

	public async setFullScaleGyroRangeAsync(adrs: number): Promise<number | false> {
		if (this.i2c) {
			this._setGyroScalarInv(adrs)
			await this.i2c.writeBitsAsync(MPU9250Map.RA_GYRO_CONFIG, MPU9250Map.GCONFIG_FS_SEL_BIT, MPU9250Map.GCONFIG_FS_SEL_LENGTH, adrs)
			return adrs
		}
		return Promise.resolve(false)
	}

	public setFullScaleAccelRange(adrs: number): number | false {
		if (this.i2c) {
			this._setAccelScalarInv(adrs)
			this.i2c.writeBits(MPU9250Map.RA_ACCEL_CONFIG_1, MPU9250Map.ACONFIG_FS_SEL_BIT, MPU9250Map.ACONFIG_FS_SEL_LENGTH, adrs)
			return adrs
		}
		return false
	}

	public async setFullScaleAccelRangeAsync(adrs: number): Promise<number | false> {
		if (this.i2c) {
			this._setAccelScalarInv(adrs)
			await this.i2c.writeBitsAsync(MPU9250Map.RA_ACCEL_CONFIG_1, MPU9250Map.ACONFIG_FS_SEL_BIT, MPU9250Map.ACONFIG_FS_SEL_LENGTH, adrs)
			return adrs
		}
		return Promise.resolve(false)
	}

	public setSleepEnabled(enable: boolean): number | false {
		const val = enable ? 1 : 0
		if (this.i2c) {
			this.i2c.writeBit(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_SLEEP_BIT, val)
			return val
		}
		return false
	}

	public async setSleepEnabledAsync(enable: boolean): Promise<number | false> {
		const val = enable ? 1 : 0
		if (this.i2c) {
			await this.i2c.writeBitAsync(MPU9250Map.RA_PWR_MGMT_1, MPU9250Map.PWR1_SLEEP_BIT, val)
			return val
		}
		return Promise.resolve(false)
	}

	public setI2CMasterModeEnabled(enable: boolean): number | false {
		const val = enable ? 1 : 0
		if (this.i2c) {
			this.i2c.writeBit(MPU9250Map.RA_USER_CTRL, MPU9250Map.USERCTRL_I2C_MST_EN_BIT, val)
			return val
		}
		return false
	}

	public async setI2CMasterModeEnabledAsync(enable: boolean): Promise<number | false> {
		const val = enable ? 1 : 0
		if (this.i2c) {
			await this.i2c.writeBitAsync(MPU9250Map.RA_USER_CTRL, MPU9250Map.USERCTRL_I2C_MST_EN_BIT, val)
			return val
		}
		return Promise.resolve(false)
	}

	public setByPASSEnabled(enable: boolean): number | false {
		const val = enable ? 1 : 0
		if (this.i2c) {
			this.i2c.writeBit(MPU9250Map.RA_INT_PIN_CFG, MPU9250Map.INTCFG_BYPASS_EN_BIT, val)
			return val
		}
		return false
	}

	public async setByPASSEnabledAsync(enable: boolean): Promise<number | false> {
		const val = enable ? 1 : 0
		if (this.i2c) {
			await this.i2c.writeBitAsync(MPU9250Map.RA_INT_PIN_CFG, MPU9250Map.INTCFG_BYPASS_EN_BIT, val)
			return val
		}
		return Promise.resolve(false)
	}

	public setDLPFConfig(dlpf_cfg: number): number | false {
		if (this.i2c) {
			this.i2c.writeBits(MPU9250Map.RA_CONFIG, 0, 3, dlpf_cfg)
			return dlpf_cfg
		}
		return false
	}

	public async setDLPFConfigAsync(dlpf_cfg: number): Promise<number | false> {
		if (this.i2c) {
			await this.i2c.writeBitsAsync(MPU9250Map.RA_CONFIG, 0, 3, dlpf_cfg)
			return dlpf_cfg
		}
		return Promise.resolve(false)
	}

	public setAccelDLPFConfig(a_dlpf_cfg: number): number | false {
		if (this.i2c) {
			this.i2c.writeBits(MPU9250Map.RA_ACCEL_CONFIG_2, 0, 4, a_dlpf_cfg)
			return a_dlpf_cfg
		}
		return false
	}

	public async setAccelDLPFConfigAsync(a_dlpf_cfg: number): Promise<number | false> {
		if (this.i2c) {
			await this.i2c.writeBitsAsync(MPU9250Map.RA_ACCEL_CONFIG_2, 0, 4, a_dlpf_cfg)
			return a_dlpf_cfg
		}
		return Promise.resolve(false)
	}

	public setSampleRate(sample_rate: number): number | false {
		if (this.i2c) {
			this.i2c.writeBits(MPU9250Map.SMPLRT_DIV, 0, 8, this._estimateRate(sample_rate))
			return sample_rate
		}
		return false
	}

	public async setSampleRateAsync(sample_rate: number): Promise<number | false> {
		if (this.i2c) {
			await this.i2c.writeBitsAsync(MPU9250Map.SMPLRT_DIV, 0, 8, this._estimateRate(sample_rate))
			return sample_rate
		}
		return Promise.resolve(false)
	}

	public static scaleAccel(val: number, offset: number, scalerArr: number[]): number {
		if (val < 0) {
			return -(val - offset) / (scalerArr[0] - offset)
		} else {
			return (val - offset) / (scalerArr[1] - offset)
		}
	}

	public static vectorToYesNo(v: number[]): string {
		const YesNo = (val: number) => (val ? "No" : "Yes")
		return `(${YesNo(v[0])}, ${YesNo(v[1])}, ${YesNo(v[2])})`
	}

	private _estimateRate(sample_rate: number): number {
		if (sample_rate < MPU9250Map.SAMPLERATE_MAX && sample_rate >= 8000) {
			sample_rate = 8000
		}
		if (sample_rate < 8000 && sample_rate > 1000) {
			sample_rate = 1000
		}
		if (sample_rate < 1000) {
			sample_rate = 1000 / (1 + sample_rate)
		}
		return sample_rate
	}

	private _setGyroScalarInv(adrs: number): void {
		if (this._config?.scaleValues) {
			this.gyroScalarInv = 1 / MPU9250Map.GYRO_SCALE_FACTOR[adrs]
		} else {
			this.gyroScalarInv = 1
		}
	}

	private _setAccelScalarInv(adrs: number): void {
		if (this._config?.scaleValues) {
			this.accelScalarInv = 1 / MPU9250Map.ACCEL_SCALE_FACTOR[adrs]
		} else {
			this.accelScalarInv = 1
		}
	}

	private _getFsGyroValue(index: number): number {
		let gyro_value = MPU9250Map.GYRO_FS_250
		if (this._config?.GYRO_FS && mpu9250._FS_GYRO_RANGE[index]) {
			gyro_value = mpu9250._FS_GYRO_RANGE[index]
		}
		return gyro_value
	}

	private _getFsAccelValue(index: number): number {
		let accel_fs = MPU9250Map.ACCEL_FS_4
		if (this._config?.GYRO_FS && mpu9250._FS_ACCEL_RANGE[index]) {
			accel_fs = mpu9250._FS_ACCEL_RANGE[index]
		}
		return accel_fs
	}

	public get hasSampleRate(): boolean {
		return !!(
			this._config?.SAMPLE_RATE &&
			this._config.SAMPLE_RATE > MPU9250Map.SAMPLERATE_MIN &&
			this._config.SAMPLE_RATE < MPU9250Map.SAMPLERATE_MAX
		)
	}
}
