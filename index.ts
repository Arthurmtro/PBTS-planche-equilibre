import MPU9250 from "./src/mpu9250"

const address = 0x68 // MPU9250 addess

async function updateTelemetry(gyro: MPU9250 | MPU9250[]) {
	if (!gyro) throw "MPU not detected"

	if (!Array.isArray(gyro)) {
		console.clear()
		console.log(`Bus N°${gyro.busNumber}`)
		console.log(gyro.getTelemetry())
	} else {
		console.clear()
		gyro.map((myGyro: MPU9250) => {
			console.log(`Bus N°${myGyro.busNumber}`)
			console.log(myGyro.getTelemetry())
		})
	}
}

(async () => {
	const gyro1 = new MPU9250(1, address)
	const gyro2 = new MPU9250(4, address)
	const gyro3 = new MPU9250(5, address)

	setInterval(() => updateTelemetry([gyro1, gyro2, gyro3]), 500)
})()
