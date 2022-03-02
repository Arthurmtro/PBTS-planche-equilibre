/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
export class Stats {
	private vectorNames: string | any[]
	private numStats: number
	private vectors: Record<string, unknown> = {}
	private done = false

	constructor(vectorNames: string | any[], numStats: number) {
		this.vectorNames = vectorNames
		this.numStats = numStats
		this.vectors = {}
		this.done = false

		for (let i = 0; i < vectorNames.length; i += 1) {
			let name = vectorNames[i]
			this.vectors[name] = {
				x: [],
				y: [],
				z: [],
				pos: 0,
			}
		}

		// do something when app is closing
		// process.on
		process.on("exit", this.exitHandler.bind(this, { cleanup: true }))

		// catches ctrl+c event
		process.on("SIGINT", this.exitHandler.bind(this, { exit: true }))

		// catches uncaught exceptions
		process.on("uncaughtException", this.exitHandler.bind(this, { exit: true }))
	}

	exitHandler(options: any, err: any) {
		if (err) {
			console.log(err.stack)
		} else {
			this.printStats()
		}
		if (options.exit) {
			const exit = process.exit
			exit()
		}
	}

	add(vectorName: string, x: any, y: any, z: any) {
		const v: any = this.vectors[vectorName]
		// const len: number = v.x.length
		if (v.pos >= this.numStats) {
			v.pos = 0
		} else {
			v.pos += 1
		}
		v.x[v.pos] = x
		v.y[v.pos] = y
		v.z[v.pos] = z
	}

	addValue(vectorName: string, x: any) {
		const v: any = this.vectors[vectorName]
		v.isValue = true
		if (v.pos >= this.numStats) {
			v.pos = 0
		} else {
			v.pos += 1
		}
		v.x[v.pos] = x
	}

	printStats() {
		if (this.done) return
		this.done = true

		console.log("\n\n\nStatistics:")
		console.log("           average   std.dev.  num.same.values")
		for (let i = 0; i < this.vectorNames.length; i += 1) {
			const name = this.vectorNames[i]
			const v: any = this.vectors[name]
			console.log(name + ":")
			console.log(" -> x: ", average(v.x).toFixed(5), standardDeviation(v.x).toFixed(5), numSameValues(v.x))
			if (!v.isValue) {
				console.log(" -> y: ", average(v.y).toFixed(5), standardDeviation(v.y).toFixed(5), numSameValues(v.y))
				console.log(" -> z: ", average(v.z).toFixed(5), standardDeviation(v.z).toFixed(5), numSameValues(v.z))
			}
			console.log(" -> num samples: ", v.x.length)
			console.log()
		}

		function standardDeviation(values: any[]) {
			const avg = average(values)

			const squareDiffs = values.map(function (value: number) {
				const diff = value - avg
				const sqrDiff = diff * diff
				return sqrDiff
			})

			const avgSquareDiff = average(squareDiffs)

			const stdDev = Math.sqrt(avgSquareDiff)
			return stdDev
		}

		function average(values: any[]) {
			const sumData = values.reduce(function (sum: any, value: any) {
				return sum + value
			}, 0)

			const avg = sumData / values.length
			return avg
		}

		function numSameValues(values: any[]) {
			let same = 0
			let lastVal = NaN
			values.forEach(function (val: number) {
				if (val === lastVal) {
					same += 1
				}
				lastVal = val
			})
			return same
		}
	}
}
