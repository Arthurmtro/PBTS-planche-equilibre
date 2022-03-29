"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mpu9250 = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const maps_1 = require("./maps");
const extend_1 = __importDefault(require("extend"));
const debug_1 = require("./debug");
const i2c_service_1 = require("./i2c-service");
const sleep_1 = require("./sleep");
class mpu9250 {
    constructor(config) {
        this.accelScalarInv = 0;
        this.gyroScalarInv = 0;
        /** Default configuration */
        const _default = {
            device: "/dev/i2c-1",
            address: maps_1.MPU9250Map.I2C_ADDRESS_AD0_LOW,
            DEBUG: false,
            scaleValues: false,
            GYRO_FS: 0,
            ACCEL_FS: 2,
            gyroBiasOffset: mpu9250._DEFAULT_GYRO_OFFSET,
            accelCalibration: mpu9250._DEFAULT_ACCEL_CALIBRATION,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._config = (0, extend_1.default)({}, _default, config && config instanceof Object ? config : {});
        /** IF no device configured should not able to run this plugin */
        if (!this._config.device) {
            throw new Error("Device parameter required!");
        }
        /** If address not defined */
        if (!this._config.address) {
            throw new Error("Address parameter required!");
        }
        /** print debug */
        this.debug = new debug_1.Debug(this._config.DEBUG || false);
        /** I2C Service Read/Write */
        this.i2c = new i2c_service_1.I2cService(this._config.address, { device: this._config.device });
    }
    /**
     * @name initialize
     * @return {boolean}
     */
    initialize() {
        var _a, _b, _c, _d, _e;
        this.debug.log("info", "Initialization MPU9250 ....");
        // clear configuration
        this.resetConfig();
        // defined sample rate
        if (((_a = this._config) === null || _a === void 0 ? void 0 : _a.SAMPLE_RATE) && this.hasSampleRate) {
            this.setSampleRate(this._config.SAMPLE_RATE);
            (0, sleep_1.msleep)(100);
        }
        // define DLPF_CFG
        if ((_b = this._config) === null || _b === void 0 ? void 0 : _b.DLPF_CFG) {
            this.setDLPFConfig(this._config.DLPF_CFG);
            (0, sleep_1.msleep)(100);
        }
        // define A_DLPF_CFG
        if ((_c = this._config) === null || _c === void 0 ? void 0 : _c.A_DLPF_CFG) {
            this.setAccelDLPFConfig(this._config.A_DLPF_CFG);
            (0, sleep_1.msleep)(100);
        }
        // define clock source
        this.setClockSource(maps_1.MPU9250Map.CLOCK_PLL_XGYRO);
        (0, sleep_1.msleep)(10);
        // define gyro range
        this.setFullScaleGyroRange(this._getFsGyroValue(((_d = this._config) === null || _d === void 0 ? void 0 : _d.GYRO_FS) || -1));
        (0, sleep_1.msleep)(10);
        // define accel range
        this.setFullScaleAccelRange(this._getFsAccelValue(this._config.ACCEL_FS || -1));
        (0, sleep_1.msleep)(10);
        // disable sleepEnabled
        this.setSleepEnabled(false);
        (0, sleep_1.msleep)(10);
        this.debug.log("info", "END of MPU9150 initialization.");
        // Print out the configuration
        if ((_e = this._config) === null || _e === void 0 ? void 0 : _e.DEBUG) {
            this.printSettings();
            this.printAccelSettings();
            this.printGyroSettings();
        }
        return true;
    }
    /**
     * @name initialize
     * @return {Promise<boolean>}
     */
    initializeAsync() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this.debug.log("info", "Initialization MPU9250 ....");
            // clear configuration
            yield this.resetConfigAsync();
            // defined sample rate
            if (((_a = this._config) === null || _a === void 0 ? void 0 : _a.SAMPLE_RATE) && this.hasSampleRate) {
                yield this.setSampleRateAsync(this._config.SAMPLE_RATE);
            }
            // define DLPF_CFG
            if ((_b = this._config) === null || _b === void 0 ? void 0 : _b.DLPF_CFG) {
                yield this.setDLPFConfigAsync(this._config.DLPF_CFG);
            }
            // define A_DLPF_CFG
            if ((_c = this._config) === null || _c === void 0 ? void 0 : _c.A_DLPF_CFG) {
                yield this.setAccelDLPFConfigAsync(this._config.A_DLPF_CFG);
            }
            // define clock source
            yield this.setClockSourceAsync(maps_1.MPU9250Map.CLOCK_PLL_XGYRO);
            // define gyro range
            yield this.setFullScaleGyroRangeAsync(this._getFsGyroValue(((_d = this._config) === null || _d === void 0 ? void 0 : _d.GYRO_FS) || -1));
            // define accel range
            yield this.setFullScaleAccelRangeAsync(this._getFsAccelValue(this._config.ACCEL_FS || -1));
            // disable sleepEnabled
            yield this.setSleepEnabledAsync(false);
            this.debug.log("info", "END of MPU9150 initialization.");
            // Print out the configuration
            if ((_e = this._config) === null || _e === void 0 ? void 0 : _e.DEBUG) {
                this.printSettings();
                this.printAccelSettings();
                this.printGyroSettings();
            }
            return yield this.testDeviceAsync();
        });
    }
    /**
     * @name resetConfig
     * @description Reset configuration
     */
    resetConfig() {
        this.i2c.writeBit(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_DEVICE_RESET_BIT, 1);
        (0, sleep_1.msleep)(10);
        this.debug.log("info", "Reset configuration MPU9250.");
    }
    /**
     * @name resetConfigAsync
     * @description Reset Configuration
     */
    resetConfigAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.i2c.writeBitAsync(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_DEVICE_RESET_BIT, 1);
            this.debug.log("info", "Reset configuration MPU9250.");
        });
    }
    /**
     * @name testDevice
     * @return {boolean}
     */
    testDevice() {
        const currentDeviceID = this.getIDDevice();
        console.log(currentDeviceID);
        return !!(currentDeviceID && (currentDeviceID === maps_1.MPU9250Map.ID_MPU_9250 || currentDeviceID === maps_1.MPU9250Map.ID_MPU_9255));
    }
    /**
     * @name testDeviceAsync
     * @return {Promise<boolean>}
     */
    testDeviceAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDeviceID = yield this.getIDDeviceAsync();
            return !!(currentDeviceID && (currentDeviceID === maps_1.MPU9250Map.ID_MPU_9250 || currentDeviceID === maps_1.MPU9250Map.ID_MPU_9255));
        });
    }
    /** Getter */
    /**
     * @name getIDDevice
     * @return {number | false}
     */
    getIDDevice() {
        if (this.i2c) {
            return this.i2c.readByte(maps_1.MPU9250Map.WHO_AM_I);
        }
        return false;
    }
    /**
     * @name getIDDeviceAsync
     * @return {Promise<number | false>}
     */
    getIDDeviceAsync() {
        if (this.i2c) {
            return this.i2c.readByteAsync(maps_1.MPU9250Map.WHO_AM_I);
        }
        return Promise.resolve(false);
    }
    /**
     * @name getMotion6
     * @return {number[] | false}
     */
    getMotion6() {
        if (this.i2c) {
            const buffer = this.i2c.readBytes(maps_1.MPU9250Map.ACCEL_XOUT_H, 14);
            const gCal = this._config.gyroBiasOffset;
            const aCal = this._config.accelCalibration;
            if (!gCal || !aCal) {
                return false;
            }
            const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
            const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
            const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;
            return [
                mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
                mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
                mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
                // Skip Temperature - bytes 6:7
                buffer.readInt16BE(8) * this.gyroScalarInv + gCal.x,
                buffer.readInt16BE(10) * this.gyroScalarInv + gCal.y,
                buffer.readInt16BE(12) * this.gyroScalarInv + gCal.z,
            ];
        }
        return false;
    }
    /**
     * @name getMotion6Async
     * @return {Promise<number[] | false>}
     */
    getMotion6Async() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                const buffer = yield this.i2c.readBytesAsync(maps_1.MPU9250Map.ACCEL_XOUT_H, 14);
                const gCal = this._config.gyroBiasOffset;
                const aCal = this._config.accelCalibration;
                if (!gCal || !aCal) {
                    return false;
                }
                const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
                const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
                const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;
                return [
                    mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
                    mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
                    mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
                    // Skip Temperature - bytes 6:7
                    buffer.readInt16BE(8) * this.gyroScalarInv + gCal.x,
                    buffer.readInt16BE(10) * this.gyroScalarInv + gCal.y,
                    buffer.readInt16BE(12) * this.gyroScalarInv + gCal.z,
                ];
            }
            return false;
        });
    }
    /**
     * @name getAccel
     * @return {number[] | false}
     */
    getAccel() {
        if (this.i2c) {
            const buffer = this.i2c.readBytes(maps_1.MPU9250Map.ACCEL_XOUT_H, 6);
            const aCal = this._config.accelCalibration;
            if (!aCal) {
                return false;
            }
            const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
            const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
            const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;
            return [
                mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
                mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
                mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
            ];
        }
        return false;
    }
    /**
     * @name getAccelAsync
     * @return {Promise<number[] | false>}
     */
    getAccelAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                const buffer = yield this.i2c.readBytesAsync(maps_1.MPU9250Map.ACCEL_XOUT_H, 6);
                const aCal = this._config.accelCalibration;
                if (!aCal) {
                    return false;
                }
                const xAccel = buffer.readInt16BE(0) * this.accelScalarInv;
                const yAccel = buffer.readInt16BE(2) * this.accelScalarInv;
                const zAccel = buffer.readInt16BE(4) * this.accelScalarInv;
                return [
                    mpu9250.scaleAccel(xAccel, aCal.offset.x, aCal.scale.x),
                    mpu9250.scaleAccel(yAccel, aCal.offset.y, aCal.scale.y),
                    mpu9250.scaleAccel(zAccel, aCal.offset.z, aCal.scale.z),
                ];
            }
            return false;
        });
    }
    /**
     * @name getGyro
     * @return {number[] | false}
     */
    getGyro() {
        if (this.i2c) {
            const buffer = this.i2c.readBytes(maps_1.MPU9250Map.GYRO_XOUT_H, 6);
            const gCal = this._config.gyroBiasOffset;
            if (!gCal) {
                return false;
            }
            return [
                buffer.readInt16BE(0) * this.gyroScalarInv + gCal.x,
                buffer.readInt16BE(2) * this.gyroScalarInv + gCal.y,
                buffer.readInt16BE(4) * this.gyroScalarInv + gCal.z,
            ];
        }
        return false;
    }
    /**
     * @name getGyroAsync
     * @return {Async<number[] | false>}
     */
    getGyroAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                const buffer = yield this.i2c.readBytesAsync(maps_1.MPU9250Map.GYRO_XOUT_H, 6);
                const gCal = this._config.gyroBiasOffset;
                if (!gCal) {
                    return false;
                }
                return [
                    buffer.readInt16BE(0) * this.gyroScalarInv + gCal.x,
                    buffer.readInt16BE(2) * this.gyroScalarInv + gCal.y,
                    buffer.readInt16BE(4) * this.gyroScalarInv + gCal.z,
                ];
            }
            return false;
        });
    }
    /**
     * @name getSleepEnabled
     * @return {number | false}
     */
    getSleepEnabled() {
        if (this.i2c) {
            return this.i2c.readBit(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_SLEEP_BIT);
        }
        return false;
    }
    /**
     * @name getSleepEnabledAsync
     * @return {Promise<number | false>}
     */
    getSleepEnabledAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                return this.i2c.readBitAsync(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_SLEEP_BIT);
            }
            return false;
        });
    }
    /**
     * @name getClockSource
     * @return {number | false}
     */
    getClockSource() {
        if (this.i2c) {
            return this.i2c.readByte(maps_1.MPU9250Map.RA_PWR_MGMT_1) & 0x07;
        }
        return false;
    }
    /**
     * @name getClockSourceAsync
     * @return {Promise<number | false>}
     */
    getClockSourceAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                return (yield this.i2c.readByteAsync(maps_1.MPU9250Map.RA_PWR_MGMT_1)) & 0x07;
            }
            return false;
        });
    }
    /**
     * @name getFullScaleGyroRange
     * @return {number | false}
     */
    getFullScaleGyroRange() {
        if (this.i2c) {
            let byte = this.i2c.readByte(maps_1.MPU9250Map.RA_GYRO_CONFIG);
            byte = byte & 0x18;
            byte = byte >> 3;
            return byte;
        }
        return false;
    }
    /**
     * @name getFullScaleGyroRangeAsync
     * @return {Promise<number | false>}
     */
    getFullScaleGyroRangeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                let byte = yield this.i2c.readByteAsync(maps_1.MPU9250Map.RA_GYRO_CONFIG);
                byte = byte & 0x18;
                byte = byte >> 3;
                return byte;
            }
            return false;
        });
    }
    /**
     * @name getGyroPowerSettings
     * @return {number[] | false}
     */
    getGyroPowerSettings() {
        if (this.i2c) {
            let byte = this.i2c.readByte(maps_1.MPU9250Map.RA_PWR_MGMT_2);
            byte = byte & 0x07;
            return [
                (byte >> 2) & 1,
                (byte >> 1) & 1,
                (byte >> 0) & 1, // Z
            ];
        }
        return false;
    }
    /**
     * @name getGyroPowerSettingsAsync
     * @return {Promise<number[] | false>}
     */
    getGyroPowerSettingsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                let byte = yield this.i2c.readByteAsync(maps_1.MPU9250Map.RA_PWR_MGMT_2);
                byte = byte & 0x07;
                return [
                    (byte >> 2) & 1,
                    (byte >> 1) & 1,
                    (byte >> 0) & 1, // Z
                ];
            }
            return false;
        });
    }
    /**
     * @name getAccelPowerSettings
     * @return {number[] | false}
     */
    getAccelPowerSettings() {
        if (this.i2c) {
            let byte = this.i2c.readByte(maps_1.MPU9250Map.RA_PWR_MGMT_2);
            byte = byte & 0x38;
            return [
                (byte >> 5) & 1,
                (byte >> 4) & 1,
                (byte >> 3) & 1, // Z
            ];
        }
        return false;
    }
    /**
     * @name getAccelPowerSettingsAsync
     * @return {Promise<number[] | false>}
     */
    getAccelPowerSettingsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                let byte = yield this.i2c.readByteAsync(maps_1.MPU9250Map.RA_PWR_MGMT_2);
                byte = byte & 0x38;
                return [
                    (byte >> 5) & 1,
                    (byte >> 4) & 1,
                    (byte >> 3) & 1, // Z
                ];
            }
            return false;
        });
    }
    /**
     * @name getFullScaleAccelRange
     * @return {number | false}
     */
    getFullScaleAccelRange() {
        if (this.i2c) {
            let byte = this.i2c.readByte(maps_1.MPU9250Map.RA_ACCEL_CONFIG_1);
            byte = byte & 0x18;
            byte = byte >> 3;
            return byte;
        }
        return false;
    }
    /**
     * @name getFullScaleAccelRangeAsync
     * @return {Promise<number | false>}
     */
    getFullScaleAccelRangeAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                let byte = yield this.i2c.readByteAsync(maps_1.MPU9250Map.RA_ACCEL_CONFIG_1);
                byte = byte & 0x18;
                byte = byte >> 3;
                return byte;
            }
            return false;
        });
    }
    /**
     * @name getByPASSEnabled
     * @return {number | false}
     */
    getByPASSEnabled() {
        if (this.i2c) {
            return this.i2c.readBit(maps_1.MPU9250Map.RA_INT_PIN_CFG, maps_1.MPU9250Map.INTCFG_BYPASS_EN_BIT);
        }
        return false;
    }
    /**
     * @name getByPASSEnabled
     * @return {Promise<number | false>}
     */
    getByPASSEnabledAsync() {
        if (this.i2c) {
            return this.i2c.readBitAsync(maps_1.MPU9250Map.RA_INT_PIN_CFG, maps_1.MPU9250Map.INTCFG_BYPASS_EN_BIT);
        }
        return Promise.resolve(false);
    }
    /**
     * @name getI2CMasterMode
     * @return {number | false}
     */
    getI2CMasterMode() {
        if (this.i2c) {
            return this.i2c.readBit(maps_1.MPU9250Map.RA_USER_CTRL, maps_1.MPU9250Map.USERCTRL_I2C_MST_EN_BIT);
        }
        return false;
    }
    /**
     * @name getI2CMasterModeAsync
     * @return {Promise<number | false>}
     */
    getI2CMasterModeAsync() {
        if (this.i2c) {
            return this.i2c.readBitAsync(maps_1.MPU9250Map.RA_USER_CTRL, maps_1.MPU9250Map.USERCTRL_I2C_MST_EN_BIT);
        }
        return Promise.resolve(false);
    }
    /**
     * @name getPitch
     * @param {number[]} value
     * @return {number}
     */
    getPitch(value) {
        return (Math.atan2(value[0], value[2]) + Math.PI) * (180 / Math.PI) - 180;
    }
    /**
     * @name getRoll
     * @param {number[]} value
     * @return {number}
     */
    getRoll(value) {
        return (Math.atan2(value[1], value[2]) + Math.PI) * (180 / Math.PI) - 180;
    }
    /**
     * @name getYaw
     * @param {number[]} value
     * @return {number}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getYaw(value) {
        return 0;
    }
    /**
     * @name printAccelSettings
     */
    printSettings() {
        var _a;
        this.debug.log("info", "MPU9250:");
        if ((_a = this._config) === null || _a === void 0 ? void 0 : _a.address) {
            this.debug.log("info", `--> Device address: 0x${this._config.address.toString(16)}`);
            this.debug.log("info", `--> i2c bus: 0x${this.getIDDevice().toString(16)}`);
            this.debug.log("info", `--> Device ID: 0x${this.getIDDevice().toString(16)}`);
            this.debug.log("info", `--> BYPASS enabled: ${this.getByPASSEnabled() ? "Yes" : "No"}`);
            this.debug.log("info", `--> SleepEnabled Mode: ${this.getSleepEnabled() === 1 ? "On" : "Off"}`);
            this.debug.log("info", `--> i2c Master Mode: ${this.getI2CMasterMode() === 1 ? "Enabled" : "Disabled"}`);
            this.debug.log("info", "--> Power Management (0x6B, 0x6C):");
            this.debug.log("info", `  --> Clock Source: ${mpu9250._CLK_RNG[this.getClockSource() || 0]}`);
            this.debug.log("info", `  --> Accel enabled (x, y, z): ${mpu9250.vectorToYesNo(this.getAccelPowerSettings() || [1, 1, 1])}`);
            this.debug.log("info", `  --> Gyro enabled (x, y, z): ${mpu9250.vectorToYesNo(this.getGyroPowerSettings() || [1, 1, 1])}`);
        }
        else {
            this.debug.log("error", "No address defined!");
        }
    }
    /**
     * @name printAccelSettings
     */
    printAccelSettings() {
        var _a, _b, _c, _d;
        this.debug.log("info", "Accelerometer:");
        this.debug.log("info", `--> Full Scale Range (0x1C): ${mpu9250._STR_FS_ACCEL_RANGE[this.getFullScaleAccelRange() || 0]}`);
        this.debug.log("info", `--> Scalar: 1/${1 / this.accelScalarInv}`);
        this.debug.log("info", "--> Calibration:");
        this.debug.log("info", "  --> Offset:");
        if ((_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.accelCalibration) === null || _b === void 0 ? void 0 : _b.offset) {
            this.debug.log("info", `    --> x: ${this._config.accelCalibration.offset.x}`);
            this.debug.log("info", `    --> y: ${this._config.accelCalibration.offset.y}`);
            this.debug.log("info", `    --> z: ${this._config.accelCalibration.offset.z}`);
        }
        else {
            this.debug.log("error", "    --> accelCalibration offset not defined!");
        }
        this.debug.log("info", "  --> Scale:");
        if ((_d = (_c = this._config) === null || _c === void 0 ? void 0 : _c.accelCalibration) === null || _d === void 0 ? void 0 : _d.scale) {
            this.debug.log("info", `    --> x: ${this._config.accelCalibration.scale.x}`);
            this.debug.log("info", `    --> y: ${this._config.accelCalibration.scale.y}`);
            this.debug.log("info", `    --> z: ${this._config.accelCalibration.scale.z}`);
        }
        else {
            this.debug.log("error", "    --> accelCalibration scale not defined!");
        }
    }
    /**
     * @name printGyroSettings
     */
    printGyroSettings() {
        var _a;
        this.debug.log("info", "Gyroscope:");
        this.debug.log("info", `--> Full Scale Range (0x1B): ${mpu9250._STR_FS_GYRO_RANGE[this.getFullScaleGyroRange() || 0]}`);
        this.debug.log("info", `--> Scalar: 1/${1 / this.gyroScalarInv}`);
        this.debug.log("info", "--> Bias Offset:");
        if ((_a = this._config) === null || _a === void 0 ? void 0 : _a.gyroBiasOffset) {
            this.debug.log("info", `  --> x: ${this._config.gyroBiasOffset.x}`);
            this.debug.log("info", `  --> y: ${this._config.gyroBiasOffset.y}`);
            this.debug.log("info", `  --> z: ${this._config.gyroBiasOffset.z}`);
        }
        else {
            this.debug.log("error", "    --> gyroBiasOffset offset not defined!");
        }
    }
    /** Setter */
    /**
     * @name setClockSource
     * @param {number} adrs
     * @return {number | false}
     */
    setClockSource(adrs) {
        if (this.i2c) {
            this.i2c.writeBits(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_CLKSEL_BIT, maps_1.MPU9250Map.PWR1_CLKSEL_LENGTH, adrs);
            return adrs;
        }
        return false;
    }
    /**
     * @name setClockSourceAsync
     * @param {number} adrs
     * @return {Promise<number | false>}
     */
    setClockSourceAsync(adrs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                yield this.i2c.writeBitsAsync(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_CLKSEL_BIT, maps_1.MPU9250Map.PWR1_CLKSEL_LENGTH, adrs);
                return adrs;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setFullScaleGyroRange
     * @param {number} adrs
     * @return {number | false}
     */
    setFullScaleGyroRange(adrs) {
        if (this.i2c) {
            this._setGyroScalarInv(adrs);
            this.i2c.writeBits(maps_1.MPU9250Map.RA_GYRO_CONFIG, maps_1.MPU9250Map.GCONFIG_FS_SEL_BIT, maps_1.MPU9250Map.GCONFIG_FS_SEL_LENGTH, adrs);
            return adrs;
        }
        return false;
    }
    /**
     * @name setFullScaleGyroRangeAsync
     * @param {number} adrs
     * @return {Promise<undefined | false>}
     */
    setFullScaleGyroRangeAsync(adrs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                this._setGyroScalarInv(adrs);
                yield this.i2c.writeBitsAsync(maps_1.MPU9250Map.RA_GYRO_CONFIG, maps_1.MPU9250Map.GCONFIG_FS_SEL_BIT, maps_1.MPU9250Map.GCONFIG_FS_SEL_LENGTH, adrs);
                return adrs;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setFullScaleAccelRange
     * @param {number} adrs
     * @return {number | false}
     */
    setFullScaleAccelRange(adrs) {
        if (this.i2c) {
            this._setAccelScalarInv(adrs);
            this.i2c.writeBits(maps_1.MPU9250Map.RA_ACCEL_CONFIG_1, maps_1.MPU9250Map.ACONFIG_FS_SEL_BIT, maps_1.MPU9250Map.ACONFIG_FS_SEL_LENGTH, adrs);
            return adrs;
        }
        return false;
    }
    /**
     * @name setFullScaleAccelRangeAsync
     * @param {number} adrs
     * @return {Promise<number | false>}
     */
    setFullScaleAccelRangeAsync(adrs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                this._setAccelScalarInv(adrs);
                yield this.i2c.writeBitsAsync(maps_1.MPU9250Map.RA_ACCEL_CONFIG_1, maps_1.MPU9250Map.ACONFIG_FS_SEL_BIT, maps_1.MPU9250Map.ACONFIG_FS_SEL_LENGTH, adrs);
                return adrs;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setSleepEnabled
     * @param {boolean} enable
     * @return {number | false}
     */
    setSleepEnabled(enable) {
        const val = enable ? 1 : 0;
        if (this.i2c) {
            this.i2c.writeBit(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_SLEEP_BIT, val);
            return val;
        }
        return false;
    }
    /**
     * @name setSleepEnabledAsync
     * @param {boolean} enable
     * @return {Promise<number | false>}
     */
    setSleepEnabledAsync(enable) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = enable ? 1 : 0;
            if (this.i2c) {
                yield this.i2c.writeBitAsync(maps_1.MPU9250Map.RA_PWR_MGMT_1, maps_1.MPU9250Map.PWR1_SLEEP_BIT, val);
                return val;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setI2CMasterModeEnabled
     * @param {boolean} enable
     * @return {number | false}
     */
    setI2CMasterModeEnabled(enable) {
        const val = enable ? 1 : 0;
        if (this.i2c) {
            this.i2c.writeBit(maps_1.MPU9250Map.RA_USER_CTRL, maps_1.MPU9250Map.USERCTRL_I2C_MST_EN_BIT, val);
            return val;
        }
        return false;
    }
    /**
     * @name setI2CMasterModeEnabledAsync
     * @param {boolean} enable
     * @return {Promise<number | false>}
     */
    setI2CMasterModeEnabledAsync(enable) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = enable ? 1 : 0;
            if (this.i2c) {
                yield this.i2c.writeBitAsync(maps_1.MPU9250Map.RA_USER_CTRL, maps_1.MPU9250Map.USERCTRL_I2C_MST_EN_BIT, val);
                return val;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setByPASSEnabled
     * @param {boolean} enable
     * @return {number | false}
     */
    setByPASSEnabled(enable) {
        const val = enable ? 1 : 0;
        if (this.i2c) {
            this.i2c.writeBit(maps_1.MPU9250Map.RA_INT_PIN_CFG, maps_1.MPU9250Map.INTCFG_BYPASS_EN_BIT, val);
            return val;
        }
        return false;
    }
    /**
     * @name setByPASSEnabledAsync
     * @param {boolean} enable
     * @return {Promise<number | false>}
     */
    setByPASSEnabledAsync(enable) {
        return __awaiter(this, void 0, void 0, function* () {
            const val = enable ? 1 : 0;
            if (this.i2c) {
                yield this.i2c.writeBitAsync(maps_1.MPU9250Map.RA_INT_PIN_CFG, maps_1.MPU9250Map.INTCFG_BYPASS_EN_BIT, val);
                return val;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setConfig
     * @param {number} dlpf_cfg
     * @return {number | false}
     */
    setDLPFConfig(dlpf_cfg) {
        if (this.i2c) {
            this.i2c.writeBits(maps_1.MPU9250Map.RA_CONFIG, 0, 3, dlpf_cfg);
            return dlpf_cfg;
        }
        return false;
    }
    /**
     * @name setDLPFConfigAsync
     * @param {number} dlpf_cfg
     * @return {Promise<number | false>}
     */
    setDLPFConfigAsync(dlpf_cfg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                yield this.i2c.writeBitsAsync(maps_1.MPU9250Map.RA_CONFIG, 0, 3, dlpf_cfg);
                return dlpf_cfg;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setAccelDLPFConfig
     * @param {number} sample_rate
     * @return {number | false}
     */
    setAccelDLPFConfig(a_dlpf_cfg) {
        if (this.i2c) {
            this.i2c.writeBits(maps_1.MPU9250Map.RA_ACCEL_CONFIG_2, 0, 4, a_dlpf_cfg);
            return a_dlpf_cfg;
        }
        return false;
    }
    /**
     * @name setAccelDLPFConfig
     * @param {number} sample_rate
     * @return {Promise<number | false>}
     */
    setAccelDLPFConfigAsync(a_dlpf_cfg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                yield this.i2c.writeBitsAsync(maps_1.MPU9250Map.RA_ACCEL_CONFIG_2, 0, 4, a_dlpf_cfg);
                return a_dlpf_cfg;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name setSampleRate
     * @param {number} sample_rate
     * @return {number | false}
     */
    setSampleRate(sample_rate) {
        if (this.i2c) {
            this.i2c.writeBits(maps_1.MPU9250Map.SMPLRT_DIV, 0, 8, this._estimateRate(sample_rate));
            return sample_rate;
        }
        return false;
    }
    /**
     * @name setSampleRateAsync
     * @param {number} sample_rate
     * @return {Promise<number | false>}
     */
    setSampleRateAsync(sample_rate) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.i2c) {
                yield this.i2c.writeBitsAsync(maps_1.MPU9250Map.SMPLRT_DIV, 0, 8, this._estimateRate(sample_rate));
                return sample_rate;
            }
            return Promise.resolve(false);
        });
    }
    /**
     * @name scaleAccel
     * @description This wee function just simplifies the code.  It scales the Accelerometer values appropriately. The values are scaled to 1g and the offset it taken into account.
     * @param {number} val
     * @param {number} offset
     * @param {number[]} scalerArr
     */
    static scaleAccel(val, offset, scalerArr) {
        if (val < 0) {
            return -(val - offset) / (scalerArr[0] - offset);
        }
        else {
            return (val - offset) / (scalerArr[1] - offset);
        }
    }
    /**
     * @name vectorToYesNo
     * @param {number[]} v
     */
    static vectorToYesNo(v) {
        const YesNo = (val) => (val ? "No" : "Yes");
        return `(${YesNo(v[0])}, ${YesNo(v[1])}, ${YesNo(v[2])})`;
    }
    /**
     * @name _estimateRate
     * @description Calculate sample rate
     * @param {number} sample_rate
     * @return {number}
     */
    _estimateRate(sample_rate) {
        if (sample_rate < maps_1.MPU9250Map.SAMPLERATE_MAX && sample_rate >= 8000) {
            sample_rate = 8000;
        }
        if (sample_rate < 8000 && sample_rate > 1000) {
            sample_rate = 1000;
        }
        if (sample_rate < 1000) {
            sample_rate = 1000 / (1 + sample_rate);
        }
        return sample_rate;
    }
    /**
     * @name _setGyroScalarInv
     * @param {number} adrs
     * @return {number}
     */
    _setGyroScalarInv(adrs) {
        var _a;
        if ((_a = this._config) === null || _a === void 0 ? void 0 : _a.scaleValues) {
            this.gyroScalarInv = 1 / maps_1.MPU9250Map.GYRO_SCALE_FACTOR[adrs];
        }
        else {
            this.gyroScalarInv = 1;
        }
    }
    /**
     * @name _setAccelScalarInv
     * @param {number} adrs
     * @return {number}
     */
    _setAccelScalarInv(adrs) {
        var _a;
        if ((_a = this._config) === null || _a === void 0 ? void 0 : _a.scaleValues) {
            this.accelScalarInv = 1 / maps_1.MPU9250Map.ACCEL_SCALE_FACTOR[adrs];
        }
        else {
            this.accelScalarInv = 1;
        }
    }
    /**
     * @name _getFsGyroValue
     * @param {number} index
     * @return {number}
     */
    _getFsGyroValue(index) {
        var _a;
        let gyro_value = maps_1.MPU9250Map.GYRO_FS_250;
        if (((_a = this._config) === null || _a === void 0 ? void 0 : _a.GYRO_FS) && mpu9250._FS_GYRO_RANGE[index]) {
            gyro_value = mpu9250._FS_GYRO_RANGE[index];
        }
        return gyro_value;
    }
    /**
     * @name _getFsAccelValue
     * @param {number} index
     * @return {number}
     */
    _getFsAccelValue(index) {
        var _a;
        let accel_fs = maps_1.MPU9250Map.ACCEL_FS_4;
        if (((_a = this._config) === null || _a === void 0 ? void 0 : _a.GYRO_FS) && mpu9250._FS_ACCEL_RANGE[index]) {
            accel_fs = mpu9250._FS_ACCEL_RANGE[index];
        }
        return accel_fs;
    }
    /**
     * @return {boolean}
     */
    get hasSampleRate() {
        var _a;
        return !!(((_a = this._config) === null || _a === void 0 ? void 0 : _a.SAMPLE_RATE) &&
            this._config.SAMPLE_RATE > maps_1.MPU9250Map.SAMPLERATE_MIN &&
            this._config.SAMPLE_RATE < maps_1.MPU9250Map.SAMPLERATE_MAX);
    }
}
exports.mpu9250 = mpu9250;
/** Default gyro offset values */
mpu9250._DEFAULT_GYRO_OFFSET = { x: 0, y: 0, z: 0 };
/** Default accel calibration values */
mpu9250._DEFAULT_ACCEL_CALIBRATION = {
    offset: { x: 0, y: 0, z: 0 },
    scale: {
        x: [-1, 1],
        y: [-1, 1],
        z: [-1, 1],
    },
};
mpu9250._CLK_RNG = [
    "0 (Internal 20MHz oscillator)",
    "1 (Auto selects the best available clock source)",
    "2 (Auto selects the best available clock source)",
    "3 (Auto selects the best available clock source)",
    "4 (Auto selects the best available clock source)",
    "5 (Auto selects the best available clock source)",
    "6 (Internal 20MHz oscillator)",
    "7 (Stops the clock and keeps timing generator in reset)",
];
mpu9250._STR_FS_ACCEL_RANGE = ["±2g (0)", "±4g (1)", "±8g (2)", "±16g (3)"];
mpu9250._STR_FS_GYRO_RANGE = ["+250dps (0)", "+500 dps (1)", "+1000 dps (2)", "+2000 dps (3)"];
mpu9250._FS_GYRO_RANGE = [maps_1.MPU9250Map.GYRO_FS_250, maps_1.MPU9250Map.GYRO_FS_500, maps_1.MPU9250Map.GYRO_FS_1000, maps_1.MPU9250Map.GYRO_FS_2000];
mpu9250._FS_ACCEL_RANGE = [maps_1.MPU9250Map.ACCEL_FS_2, maps_1.MPU9250Map.ACCEL_FS_4, maps_1.MPU9250Map.ACCEL_FS_8, maps_1.MPU9250Map.ACCEL_FS_16];
mpu9250.MPU9250 = maps_1.MPU9250Map;
//# sourceMappingURL=mpu9250.js.map