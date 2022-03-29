var i2c = require("./dist/i2c-service")
var assert = require("assert").strict
var adrs = 0
var length = 0

describe("Test Suite 1", function () {
	it("Test 1", function () {
		// metre sa fonction
		let readBytes = new ReadBit()
		assert.ok(readBytes.readBytes(adrs, length).length, 1, "Cela ne devrait pas échouer")
		return true
	})

	/*it("Test 2", function () {
		readBytes(adrs, length, callback)
		assert.ok(1 === 1, "Cela ne devrait pas échouer")
		assert.ok(false, "Cela devrait échouer")
	})*/
})
