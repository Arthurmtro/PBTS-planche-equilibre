/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { mpu9250 } = require("./dist/mpu9250")
// Instantiate and initialize.
;("use strict")

// These values were generated using calibrate_gyro.js - you will want to create your own.
// NOTE: These are temperature dependent.
var GYRO_OFFSET = {
	x: -1.068045801,
	y: -0.156656488,
	z: 1.3846259541,
}

// These values were generated using calibrate_accel.js - you will want to create your own.
var ACCEL_CALIBRATION = {
	//yd
	offset: {
		x: 0.00943176,
		y: 0.00170817,
		z: 0.05296142,
	},
	scale: {
		x: [-0.993164, 1.0102189],
		y: [-0.9981974, 1.0055884],
		z: [-0.9598844, 1.0665967],
	},
}

// Instantiate and initialize.
var mpu = new mpu9250({
	// i2c path (default is '/dev/i2c-1')
	device: "/dev/i2c-4",

	// Enable/Disable debug mode (default false)
	DEBUG: true,

	// Set the Gyroscope sensitivity (default 0), where:
	//      0 => 250 degrees / second
	//      1 => 500 degrees / second
	//      2 => 1000 degrees / second
	//      3 => 2000 degrees / second
	GYRO_FS: 3,
	ACCEL_FS: 0,
	scaleValues: true,
	gyroBiasOffset: GYRO_OFFSET,
	accelCalibration: ACCEL_CALIBRATION,
})

if (mpu.initialize()) {
	var ACCEL_NAME = "Accel (g)"
	var GYRO_NAME = "Gyro (°/sec)"
	var HEADING_NAME = "Heading (°)"
	var stats = new Stats([ACCEL_NAME, GYRO_NAME, HEADING_NAME], 1000)

	console.log("\nGyro.x   Gyro.y ")
	setInterval(function () {
		var m6
		m6 = mpu.getMotion6()

		// Make the numbers pretty
		var str = ""
		for (var i = 3; i <= 4; i++) {
			str += p(m6[i])
		}
		stats.add(GYRO_NAME, m6[3], m6[4], m6[5])

		// eslint-disable-next-line no-undef
		process.stdout.write(str + "  \r")
	}, 5)
}

function p(num) {
	if (num === undefined) {
		return "       "
	}
	var str = num.toFixed(3)
	while (str.length <= 7) {
		str = " " + str
	}
	return str + " "
}

/**
 * Calculate Statistics
 * @param {[string]} names The names of the vectors.
 */
function Stats(vectorNames, numStats) {
	this.vectorNames = vectorNames
	this.numStats = numStats
	this.vectors = {}
	this.done = false

	for (var i = 0; i < vectorNames.length; i += 1) {
		var name = vectorNames[i]
		this.vectors[name] = {
			x: [],
			y: [],
			z: [],
			pos: 0,
		}
	}

	function exitHandler(options, err) {
		if (err) {
			console.log(err.stack)
		} else {
			this.printStats()
		}
		if (options.exit) {
			var exit = process.exit
			exit()
		}
	}

	// do something when app is closing
	process.on("exit", exitHandler.bind(this, { cleanup: true }))

	// catches ctrl+c event
	process.on("SIGINT", exitHandler.bind(this, { exit: true }))

	// catches uncaught exceptions
	process.on("uncaughtException", exitHandler.bind(this, { exit: true }))
}
Stats.prototype.add = function (vectorName, x, y, z) {
	var v = this.vectors[vectorName]
	var len = v.x.length
	if (v.pos >= this.numStats) {
		v.pos = 0
	} else {
		v.pos += 1
	}
	v.x[v.pos] = x
	v.y[v.pos] = y
	v.z[v.pos] = z
}
Stats.prototype.addValue = function (vectorName, x) {
	var v = this.vectors[vectorName]
	v.isValue = true
	if (v.pos >= this.numStats) {
		v.pos = 0
	} else {
		v.pos += 1
	}
	v.x[v.pos] = x
}
Stats.prototype.printStats = function () {
	if (this.done) return
	this.done = true

	console.log("\n\n\nStatistics:")
	console.log("           average   std.dev.  num.same.values")
	for (var i = 0; i < this.vectorNames.length; i += 1) {
		var name = this.vectorNames[i]
		var v = this.vectors[name]
		console.log(name + ":")
		console.log(" -> x: ", average(v.x).toFixed(5), standardDeviation(v.x).toFixed(5), numSameValues(v.x))
		if (!v.isValue) {
			console.log(" -> y: ", average(v.y).toFixed(5), standardDeviation(v.y).toFixed(5), numSameValues(v.y))
			console.log(" -> z: ", average(v.z).toFixed(5), standardDeviation(v.z).toFixed(5), numSameValues(v.z))
		}
		console.log(" -> num samples: ", v.x.length)
		console.log()
	}

	function standardDeviation(values) {
		var avg = average(values)

		var squareDiffs = values.map(function (value) {
			var diff = value - avg
			var sqrDiff = diff * diff
			return sqrDiff
		})

		var avgSquareDiff = average(squareDiffs)

		var stdDev = Math.sqrt(avgSquareDiff)
		return stdDev
	}

	function average(values) {
		var sumData = values.reduce(function (sum, value) {
			return sum + value
		}, 0)

		var avg = sumData / values.length
		return avg
	}

	function numSameValues(values) {
		var same = 0
		var lastVal = NaN
		values.forEach(function (val) {
			if (val === lastVal) {
				same += 1
			}
			lastVal = val
		})
		return same
	}
}
