var i2c = require("i2c-bus")

// MPU6050 Registers
var PWR_MGMT_1 = 0x6b,
	SMPLRT_DIV = 0x19
var CONFIG = 0x1a,
	GYRO_CONFIG = 0x1b,
	INT_ENABLE = 0x38
var ACCEL_XOUT_H = 0x3b,
	ACCEL_YOUT_H = 0x3d,
	ACCEL_ZOUT_H = 0x3f
var GYRO_XOUT_H = 0x43,
	GYRO_YOUT_H = 0x45,
	GYRO_ZOUT_H = 0x47

class Mpu9250 {
	constructor(i2cbus, mpuaddress) {
		this.address = mpuaddress
		this.bus = i2c.openSync(i2cbus)

		// On Allume le capteur
		this.bus.writeByteSync(this.address, PWR_MGMT_1, 0)
		//écriture dans le registre de taux d'échantillonnage
		this.bus.writeByteSync(this.address, SMPLRT_DIV, 7)
		//Ecriture dans le registre de configuration
		this.bus.writeByteSync(this.address, CONFIG, 0)
		//Ecriture dans le registre de configuration du gyroscope
		this.bus.writeByteSync(this.address, GYRO_CONFIG, 24)
		//Écriture dans le registre de validation d'interruption
		this.bus.writeByteSync(this.address, INT_ENABLE, 1)
	}

	read_raw_data = function (addr) {
		var high = this.bus.readByteSync(this.address, addr)
		var low = this.bus.readByteSync(this.address, addr + 1)
		var value = (high << 8) + low
		if (value > 5456) {
			value = value - 65536
		}
		return value
	}

	//Read Gyroscope raw xyz
	get_gyro_xyz = function () {
		var x = this.read_raw_data(GYRO_XOUT_H)
		var y = this.read_raw_data(GYRO_YOUT_H)
		var z = this.read_raw_data(GYRO_ZOUT_H)
		var gyro_xyz = {
			x: x,
			y: y,
			z: z,
		}
		return gyro_xyz
	}

	//Read Accel raw xyz
	get_accel_xyz = function () {
		var x = this.read_raw_data(ACCEL_XOUT_H)
		var y = this.read_raw_data(ACCEL_YOUT_H)
		var z = this.read_raw_data(ACCEL_ZOUT_H)
		var accel_xyz = {
			x: x,
			y: y,
			z: z,
		}
		return accel_xyz
	}

	//Full scale range +/- 250 degree/C as per sensitivity scale factor
	get_roll_pitch = function (gyro_xyz, accel_xyz) {
		var Ax = accel_xyz.x / 16384.0
		var Ay = accel_xyz.y / 16384.0
		var Az = accel_xyz.z / 16384.0
		var Gx = gyro_xyz.x / 131.0
		var Gy = gyro_xyz.y / 131.0
		var Gz = gyro_xyz.z / 131.0
		var roll = Ax * -100
		var pitch = Ay * -100
		var roll_pitch = {
			roll: roll,
			pitch: pitch,
		}
		return roll_pitch
	}
}

//i2c read mpu6050 raw data

module.exports = Mpu9250
