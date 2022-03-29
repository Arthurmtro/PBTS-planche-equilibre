const Mpu9250 = require("./Mpu9250")
const assert = require("assert").strict

var address = 0x68 //MPU6050 addess
var bus = 4 //i2c bus used

describe("Test Suite 1", function () {
	const Mpu = new Mpu9250(bus, address)

	it("Test 1: Recuperation de données XYZ Test validée", function () {
		// metre sa fonction
		assert.ok(Mpu.get_gyro_xyz(), "Cela ne devrait pas échouer")
	})

	it("Test 2: Lire Accel  ", function () {
		// metre sa fonction
		assert.ok(Mpu.get_accel_xyz, "Cela ne devrait pas échouer")
	})

	it("Test 3: tangage du rouleau  ", function () {
		// metre sa fonction
		assert.ok(Mpu.get_roll_pitch, "Cela ne devrait pas échouer")
	})

	/*it("Test 2", function () {
		readBytes(adrs, length, callback)
		assert.ok(1 === 1, "Cela ne devrait pas échouer")
		assert.ok(false, "Cela devrait échouer")
	})*/
})
