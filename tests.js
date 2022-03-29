var assert = require("assert")

describe("Test Suite 1", function () {
	it("Test 1", function () {
		// metre sa fonction
		readBytes(adrs, length, callback)
		assert.ok(readBytes(adrs, length, callback), "Cela ne devrait pas échouer")
		return true
	})

	it("Test 2", function () {
		readBytes(adrs, length, callback)
		assert.ok(1 === 1, "Cela ne devrait pas échouer")
		assert.ok(false, "Cela devrait échouer")
	})
})
