"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
exports.ak8963 = void 0
/* eslint-disable @typescript-eslint/no-explicit-any */
const sleep_1 = require("./sleep")
const debug_1 = require("./debug")
const i2c_service_1 = require("./i2c-service")
const maps_1 = require("./maps")
class ak8963 {
	constructor(_config, i2c) {
		var _a, _b
		this._config = _config
		this.i2c = i2c
		this.isEnabled = false
		this.asax = 1
		this.asay = 1
		this.asaz = 1
		this.isReady = false
		if (
			((_a = this._config) === null || _a === void 0 ? void 0 : _a.ak_address) &&
			((_b = this._config) === null || _b === void 0 ? void 0 : _b.device)
		) {
			/** I2C Service Read/Write */
			this.i2c = new i2c_service_1.I2cService(this._config.ak_address, { device: this._config.device })
			this.isEnabled = true
		}
		this.debug = new debug_1.Debug(this._config.DEBUG || false)
	}
	/**
	 * @name initialize
	 * @return {boolean}
	 */
	initialize() {
		if (this.isEnabled && !this.isReady) {
			;(0, sleep_1.msleep)(10)
			const buffer = this.getIDDevice()
			if (buffer === maps_1.AK8963Map.WHO_AM_I_RESPONSE) {
				this.debug.log("info", `AK8963: Setting magnetomater`)
				this.getSensitivityAdjustmentValues()
				;(0, sleep_1.msleep)(10)
				this.setCNTL(maps_1.AK8963Map.CNTL_MODE_CONTINUE_MEASURE_2)
				;(0, sleep_1.msleep)(10)
				this.isReady = true
				return true
			} else {
				this.debug.log(
					"error",
					`AK8963: Device ID is not equal to 0x${maps_1.AK8963Map.WHO_AM_I_RESPONSE.toString(16)}, device value is 0x${buffer.toString(16)}`
				)
				return false
			}
		} else {
			return this.isEnabled
		}
	}
	/**
	 * @name initializeAsync
	 * @return {Promise<boolean>}
	 */
	async initializeAsync() {
		if (this.isEnabled && !this.isReady) {
			const buffer = await this.getIDDeviceAsync()
			if (buffer === maps_1.AK8963Map.WHO_AM_I_RESPONSE) {
				this.debug.log("info", `AK8963: Setting magnetomater`)
				await this.getSensitivityAdjustmentValuesAsync()
				await this.setCNTLAsync(maps_1.AK8963Map.CNTL_MODE_CONTINUE_MEASURE_2)
				this.isReady = true
				return true
			} else {
				this.debug.log(
					"error",
					`AK8963: Device ID is not equal to 0x${maps_1.AK8963Map.WHO_AM_I_RESPONSE.toString(16)}, device value is 0x${buffer.toString(16)}`
				)
				return false
			}
		} else {
			return false
		}
	}
	/**
	 * @name printSettings
	 * @description Printing magnetometer settings
	 */
	printSettings() {
		if (this.isEnabled && this._config.ak_address) {
			this.debug.log("info", "Magnetometer (Compass):")
			this.debug.log("info", `--> i2c address: 0x${this._config.ak_address.toString(16)}`)
			this.debug.log("info", `--> Device ID: 0x${this.getIDDevice().toString(16)}`)
			this.debug.log("info", `--> Mode: ${ak8963._MODE_LST[this.getCNTL() || 0]}`)
			this.debug.log("info", "--> Scalars:")
			this.debug.log("info", `  --> x: ${this.asax}`)
			this.debug.log("info", `  --> y: ${this.asay}`)
			this.debug.log("info", `  --> z: ${this.asaz}`)
		}
	}
	/** Getter */
	/**
	 * @name getDataReady
	 * @return {number | false}
	 */
	getDataReady() {
		if (this.i2c) {
			return this.i2c.readBit(maps_1.AK8963Map.ST1, maps_1.AK8963Map.ST1_DRDY_BIT)
		}
		return false
	}
	/**
	 * @name getDataReadyAsync
	 * @return {number | false}
	 */
	getDataReadyAsync() {
		if (this.i2c) {
			return this.i2c.readBitAsync(maps_1.AK8963Map.ST1, maps_1.AK8963Map.ST1_DRDY_BIT)
		}
		return Promise.resolve(false)
	}
	/**
	 * @name getIDDevice
	 * @return {number | false}
	 */
	getIDDevice() {
		if (this.i2c) {
			return this.i2c.readByte(maps_1.AK8963Map.WHO_AM_I)
		}
		return false
	}
	/**
	 * @name getIDDeviceAsync
	 * @return {Promise<number | false>}
	 */
	getIDDeviceAsync() {
		if (this.i2c) {
			return this.i2c.readByteAsync(maps_1.AK8963Map.WHO_AM_I)
		}
		return Promise.resolve(false)
	}
	/**
	 * @name getSensitivityAdjustmentValues
	 * @description Get the Sensitivity Adjustment values.  These were set during manufacture and allow us to get the actual H values from the magnetometer.
	 */
	getSensitivityAdjustmentValues() {
		if (!this._config.scaleValues || !this.i2c) {
			this.asax = 1
			this.asay = 1
			this.asaz = 1
			return
		}
		// Need to set to Fuse mode to get valid values from this.
		const currentMode = this.getCNTL()
		this.setCNTL(maps_1.AK8963Map.CNTL_MODE_FUSE_ROM_ACCESS)
		;(0, sleep_1.msleep)(10)
		// Get the ASA* values
		this.asax = ((this.i2c.readByte(maps_1.AK8963Map.ASAX) - 128) * 0.5) / 128 + 1
		this.asay = ((this.i2c.readByte(maps_1.AK8963Map.ASAY) - 128) * 0.5) / 128 + 1
		this.asaz = ((this.i2c.readByte(maps_1.AK8963Map.ASAZ) - 128) * 0.5) / 128 + 1
		if (!currentMode) {
			return
		}
		// Return the mode we were in before
		this.setCNTL(currentMode)
	}
	/**
	 * @name getSensitivityAdjustmentValuesAsync
	 * @description Get the Sensitivity Adjustment values.  These were set during manufacture and allow us to get the actual H values from the magnetometer.
	 */
	async getSensitivityAdjustmentValuesAsync() {
		if (!this._config.scaleValues || !this.i2c) {
			this.asax = 1
			this.asay = 1
			this.asaz = 1
			return
		}
		// Need to set to Fuse mode to get valid values from this.
		const currentMode = await this.getCNTLAsync()
		await this.setCNTLAsync(maps_1.AK8963Map.CNTL_MODE_FUSE_ROM_ACCESS)
		// Get the ASA* values
		this.asax = (((await this.i2c.readByteAsync(maps_1.AK8963Map.ASAX)) - 128) * 0.5) / 128 + 1
		this.asay = (((await this.i2c.readByteAsync(maps_1.AK8963Map.ASAY)) - 128) * 0.5) / 128 + 1
		this.asaz = (((await this.i2c.readByteAsync(maps_1.AK8963Map.ASAZ)) - 128) * 0.5) / 128 + 1
		if (!currentMode) {
			return
		}
		// Return the mode we were in before
		await this.setCNTLAsync(currentMode)
	}
	/**
	 * @name getMagAttitude
	 * @description Get the raw magnetometer values
	 * @return {number[]}
	 */
	getMagAttitude() {
		if (this.i2c) {
			// Get the actual data
			const buffer = this.i2c.readBytes(maps_1.AK8963Map.XOUT_L, 6)
			const cal = this._config.magCalibration
			if (!cal || !cal.offset || !cal.scale || !this.i2c) {
				return [0, 0, 0]
			}
			// For some reason when we read ST2 (Status 2) just after reading byte, this ensures the
			// next reading is fresh.  If we do it before without a pause, only 1 in 15 readings will
			// be fresh.  The setTimeout ensures this read goes to the back of the queue, once all other
			// computation is done.
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			setTimeout(() => {
				if (this === null || this === void 0 ? void 0 : this.i2c) {
					this.i2c.readByte(maps_1.AK8963Map.ST2)
				}
			}, 0)
			return [
				(buffer.readInt16LE(0) * this.asax - cal.offset.x) * cal.scale.x,
				(buffer.readInt16LE(2) * this.asay - cal.offset.y) * cal.scale.y,
				(buffer.readInt16LE(4) * this.asaz - cal.offset.z) * cal.scale.z,
			]
		} else {
			return [0, 0, 0]
		}
	}
	/**
	 * @name getMagAttitudeAsync
	 * @description Get the raw magnetometer values
	 * @return {Promise<number[]>}
	 */
	async getMagAttitudeAsync() {
		if (this.i2c) {
			// Get the actual data
			const buffer = await this.i2c.readBytesAsync(maps_1.AK8963Map.XOUT_L, 6)
			const cal = this._config.magCalibration
			if (!cal || !cal.offset || !cal.scale || !this.i2c) {
				return [0, 0, 0]
			}
			// For some reason when we read ST2 (Status 2) just after reading byte, this ensures the
			// next reading is fresh.  If we do it before without a pause, only 1 in 15 readings will
			// be fresh.  The setTimeout ensures this read goes to the back of the queue, once all other
			// computation is done.
			// eslint-disable-next-line @typescript-eslint/no-this-alias
			setTimeout(async () => {
				if (this === null || this === void 0 ? void 0 : this.i2c) {
					await this.i2c.readByteAsync(maps_1.AK8963Map.ST2)
				}
			}, 0)
			return [
				(buffer.readInt16LE(0) * this.asax - cal.offset.x) * cal.scale.x,
				(buffer.readInt16LE(2) * this.asay - cal.offset.y) * cal.scale.y,
				(buffer.readInt16LE(4) * this.asaz - cal.offset.z) * cal.scale.z,
			]
		} else {
			return [0, 0, 0]
		}
	}
	/**
	 * @name getCNTL
	 * @return {byte | false}
	 */
	getCNTL() {
		if (this.i2c) {
			return this.i2c.readByte(maps_1.AK8963Map.CNTL)
		}
		return false
	}
	/**
	 * @name getCNTLAsync
	 * @return {Promise<byte | false>}
	 */
	getCNTLAsync() {
		if (this.i2c) {
			return this.i2c.readByteAsync(maps_1.AK8963Map.CNTL)
		}
		return Promise.resolve(false)
	}
	/** Setter */
	/**
	 * @name setCNTL
	 * @description CNTL_MODE_OFF: 0x00 => Power-down mode
	 * CNTL_MODE_SINGLE_MEASURE: 0x01 => Single measurement mode
	 * CNTL_MODE_CONTINUE_MEASURE_1: 0x02 => Continuous measurement mode 1
	 * CNTL_MODE_CONTINUE_MEASURE_2: 0x06 => Continuous measurement mode 2
	 * CNTL_MODE_EXT_TRIG_MEASURE: 0x04 => External trigger measurement mode
	 * CNTL_MODE_SELF_TEST_MODE: 0x08 => Self-test mode
	 * CNTL_MODE_FUSE_ROM_ACCESS: 0x0F => Fuse ROM access mode
	 * @param {number} mode
	 * @return {number | false}
	 */
	setCNTL(mode) {
		if (this.i2c) {
			this.i2c.writeBytes(maps_1.AK8963Map.CNTL, [mode])
			return mode
		}
		return false
	}
	/**
	 * @name setCNTLAsync
	 * @description CNTL_MODE_OFF: 0x00 => Power-down mode
	 * CNTL_MODE_SINGLE_MEASURE: 0x01 => Single measurement mode
	 * CNTL_MODE_CONTINUE_MEASURE_1: 0x02 => Continuous measurement mode 1
	 * CNTL_MODE_CONTINUE_MEASURE_2: 0x06 => Continuous measurement mode 2
	 * CNTL_MODE_EXT_TRIG_MEASURE: 0x04 => External trigger measurement mode
	 * CNTL_MODE_SELF_TEST_MODE: 0x08 => Self-test mode
	 * CNTL_MODE_FUSE_ROM_ACCESS: 0x0F => Fuse ROM access mode
	 * @param {number} mode
	 * @return {Promise<number | false>}
	 */
	setCNTLAsync(mode) {
		if (this.i2c) {
			return this.i2c.writeBytesAsync(maps_1.AK8963Map.CNTL, [mode]).then(() => {
				return mode
			})
		}
		return Promise.resolve(false)
	}
}
exports.ak8963 = ak8963
ak8963._MODE_LST = {
	0: "0x00 (Power-down mode)",
	1: "0x01 (Single measurement mode)",
	2: "0x02 (Continuous measurement mode 1: 8Hz)",
	6: "0x06 (Continuous measurement mode 2: 100Hz)",
	4: "0x04 (External trigger measurement mode)",
	8: "0x08 (Self-test mode)",
	15: "0x0F (Fuse ROM access mode)",
}
//# sourceMappingURL=ak8963.js.map
