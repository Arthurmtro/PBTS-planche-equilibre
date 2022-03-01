////////////////////////////////////////bibliothèque///////////////////////////////////////////////////////
var i2cBus = require("i2c-bus"); // bibliothèque pour l i2c ou on inport
var Pca9685Driver = require("pca9685").Pca9685Driver; // bibliothèque pour PCA9685 ou on import

/////////////////////////////////////////option/////////////////////////////////////////////////////////////

var options = {
  // option de la carte PCA9685
  i2c: i2cBus.openSync(1), //  ouvre le port i2c
  address: 0x40, // adresse carte
  frequency: 50,
  debug: true,
};

////////////////////////////////////////option/////////////////////////////////////////////////////////////////////

const pwm = new Pca9685Driver(options, function (err) {
  // gère les erreur sa revoie si
  //   il y a une ereure sur la carte avec une alocation dynamique
  if (err) {
    // si il y a un probleme avec la carte quand on log il nous renvoie une erreur
    console.error("Erreur d'initialisation PCA9685");
    process.exit(-1);
  }

  console.log("Initialisation effectuée");

  ////////////////////////////////////fonction////////////////////////////////////////////
  // le circuit electrique si on fais tourner plusier pro en meme temps il coup instantanément 1 pour faire marcher les autre

  // il fais avancer et reculer mais on choisie la vitesse sa vas de 0.1 a 1 (regler le cicle de service )
  pwm.setDutyCycle(5, 1); // gérer 1 verin 5 desendre / 4 monter
  pwm.setDutyCycle(2, 1); // gérer l autre 3 desendre / 2 monter
  pwm.setDutyCycle(6, 1); // gérer l autre 7 desendre / 6 monter
  pwm.setDutyCycle(15, 1); // teste osciloscope
  //pwm.allChannelsOff();// tout eteindre

  pwm.setPulseLength(0, 300); // pour le serveau moteur sa marche (regler sicle d inpultion)

  // a 100% le chanel il fais avancer et reculer le verrin
  //pwm.channelOff(5);
  //pwm.channelOn(4);
});



  /////////////////////////////////////////////////////////MPU9250//////////////////////////////////////////////////
  var mpu9250 = require('mpu9250');
// Instantiate and initialize.
var mpu = new mpu9250();
if (mpu.initialize()) {
  console.log(mpu.getMotion9());
}
// default value
var mpu = new mpu9250({
  // i2c path (default is '/dev/i2c-1')
  device: '/dev/i2c-1',

  // mpu9250 address (default is 0x68)
  address: 0x68,

  // Enable/Disable magnetometer data (default false)
  UpMagneto: true,

  // If true, all values returned will be scaled to actual units (default false).
  // If false, the raw values from the device will be returned.
  scaleValues: false,

  // Enable/Disable debug mode (default false)
  DEBUG: false,

  // ak8963 (magnetometer / compass) address (default is 0x0C)
  ak_address: 0x0C,

  // Set the Gyroscope sensitivity (default 0), where:
  //      0 => 250 degrees / second
  //      1 => 500 degrees / second
  //      2 => 1000 degrees / second
  //      3 => 2000 degrees / second
  GYRO_FS: 0,

  // Set the Accelerometer sensitivity (default 2), where:
  //      0 => +/- 2 g
  //      1 => +/- 4 g
  //      2 => +/- 8 g
  //      3 => +/- 16 g
  ACCEL_FS: 2,
  
  // Set DLPF Value
  DLPF_CFG: mpu9250.MPU9250.DLPF_CFG_3600HZ,
  // Set Accel DLPF Value
  A_DLPF_CFG: mpu9250.MPU9250.A_DLPF_CFG_460HZ,
  // Set ratio (between MPU9250.SAMPLERATE_MIN and MPU9250.SAMPLERATE_MAX)
  SAMPLE_RATE: 8000,
});

!/usr/local/bin/node
console.log('------------------(START SCRIPT)------------------');
var port = 3031;
var io = require('socket.io').listen(port);
var mpu9250 = require('mpu9250');
 
var mpu = new mpu9250({UpMagneto: true, DEBUG: false, GYRO_FS: 0, ACCEL_FS: 1});
 
var timer = 0;
 
var kalmanX = new mpu.Kalman_filter();
var kalmanY = new mpu.Kalman_filter();
 
if (mpu.initialize()) {
  console.log('MPU VALUE : ', mpu.getMotion9());
  console.log('listen to 0.0.0.0:' + port);
  console.log('Temperature : ' + mpu.getTemperatureCelsius());
  var values = mpu.getMotion9();
  var pitch = mpu.getPitch(values);
  var roll = mpu.getRoll(values);
  var yaw = mpu.getYaw(values);
  console.log('pitch value : ', pitch);
  console.log('roll value : ', roll);
  console.log('yaw value : ', yaw);
  kalmanX.setAngle(roll);
  kalmanY.setAngle(pitch);
 
  var micros = function() {
    return new Date().getTime();
  };
  var dt = 0;
 
  timer = micros();
 
  var interval;
 
  var kalAngleX = 0,
    kalAngleY = 0,
    kalAngleZ = 0,
    gyroXangle = roll,
    gyroYangle = pitch,
    gyroZangle = yaw,
    gyroXrate = 0,
    gyroYrate = 0,
    gyroZrate = 0,
    compAngleX = roll,
    compAngleY = pitch,
    compAngleZ = yaw;
 
  io.on('connection', function(socket) {
    var intervalTemp;
 
    socket.on('disconnect', function() {
      if (interval) {
        console.log('client is dead !');
        clearInterval(interval);
      }
      if (intervalTemp) {
        clearInterval(intervalTemp);
      }
    });
 
    socket.on('stop_data', function (data) {
      console.log('stop send data');
      if (interval) {
        clearInterval(interval);
      }
    });
 
    socket.on('send_data', function(data) {
      interval = setInterval(function() {
        var values = mpu.getMotion9();
 
        var dt = (micros() - timer) / 1000000;
        timer = micros();
 
        pitch = mpu.getPitch(values);
        roll = mpu.getRoll(values);
        yaw = mpu.getYaw(values);
 
        var gyroXrate = values[3] / 131.0;
        var gyroYrate = values[4] / 131.0;
        var gyroZrate = values[5] / 131.0;
 
        if ((roll < -90 && kalAngleX > 90) || (roll > 90 && kalAngleX < -90)) {
          kalmanX.setAngle(roll);
          compAngleX = roll;
          kalAngleX = roll;
          gyroXangle = roll;
        } else {
          kalAngleX = kalmanX.getAngle(roll, gyroXrate, dt);
        }
 
        if (Math.abs(kalAngleX) > 90) {
          gyroYrate = -gyroYrate;
        }
        kalAngleY = kalmanY.getAngle(pitch, gyroYrate, dt);
 
        gyroXangle += gyroXrate * dt;
        gyroYangle += gyroYrate * dt;
        compAngleX = 0.93 * (compAngleX + gyroXrate * dt) + 0.07 * roll;
        compAngleY = 0.93 * (compAngleY + gyroYrate * dt) + 0.07 * pitch;
 
        if (gyroXangle < -180 || gyroXangle > 180) gyroXangle = kalAngleX;
        if (gyroYangle < -180 || gyroYangle > 180) gyroYangle = kalAngleY;
 
        var accel = {
          pitch: compAngleY,
          roll: compAngleX
        };
 
        var magneto = mpu.getCompass(values[6], values[7], values[8]);
        console.log(values[6] + ' ' + values[7] + ' ' + values[8]);
        console.log(magneto);
        socket.emit('accel_data', {accel: accel, magneto: magneto});
      }, 1);
    });
 
    intervalTemp = setInterval(function() {
      socket.emit('temperature', {temperature: mpu.getTemperatureCelsiusDigital()});
    }, 300);
  });
};

