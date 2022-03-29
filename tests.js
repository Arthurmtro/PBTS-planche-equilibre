var assert = require("assert")

describe("Test Suite 1", function () {
	it("Test 1", function () {
		// metre sa fonction
		setInterval()
		assert.ok(setInterval(), "Cela ne devrait pas échouer")
		assert.ok(setInterval(), "Cela ne devrait échouer")
	})

	it("Test 2", function () {
		assert.ok(1 === 1, "Cela ne devrait pas échouer")
		assert.ok(false, "Cela devrait échouer")
	})
})
