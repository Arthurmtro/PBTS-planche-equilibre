var Mpu9250 = require("./Mpu9250.js")

var address = 0x68 //MPU6050 addess
var bus = 4 //i2c bus used

try {
	var Mpu = new Mpu9250(bus, address)
} catch (e) {
	console.log(e)
	// [Error: Uh oh!]
}

async function update_telemetry() {
	var gyro_xyz = Mpu.get_gyro_xyz()
	var accel_xyz = Mpu.get_accel_xyz()

	var gyro_data = {
		gyro_xyz: gyro_xyz,
		accel_xyz: accel_xyz,
		rollpitch: Mpu.get_roll_pitch(gyro_xyz, accel_xyz),
	}

	console.log(gyro_data)

	setTimeout(update_telemetry, 500)
}

if (gyro) {
	update_telemetry()
}
