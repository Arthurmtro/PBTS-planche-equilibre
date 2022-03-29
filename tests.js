const Mpu9250 = require("./Mpu9250")
var assert = require("assert").strict

describe("Test Suite 1", function () {
	var Mpu = new Mpu9250(4, 0x68)

	it("Test 1: Recuperation de données XYZ", function () {
		// metre sa fonction
		assert.ok(Mpu.get_gyro_xyz(), "Cela ne devrait pas échouer")
		return true
	})

	/*it("Test 2", function () {
		readBytes(adrs, length, callback)
		assert.ok(1 === 1, "Cela ne devrait pas échouer")
		assert.ok(false, "Cela devrait échouer")
	})*/
})
