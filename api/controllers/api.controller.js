const Pca9685Driver = require("pca9685").Pca9685Driver;
let i2cBus;

const os = require("os");
if (os.arch() == "arm") {
  // raspberrypi
  i2cBus = require("i2c-bus");
} else {
  console.warn("Not using I2C, You are not on raspberrypi", os.arch());
  i2cBus = null;
}

const cylindersData = require("../config/cylinders.json");
const profilesData = require("../config/profiles.json");

const options = {
  i2c: i2cBus?.openSync(1),
  address: 0x40,
  frequency: 50,
  debug: true,
};

const pwm =
  i2cBus &&
  new Pca9685Driver(options, (err) => {
    if (err) {
      throw new Error("Error initializing, PCA9685 is null");
    }
  });

const sendError = (error, res) => {
  console.log(`Errors => ${error.message}`);

  return res && res.status(500).json({ error: error.message ?? "Unknow" });
};

const fetchCylindersInfos = async (res) => {
  try {
    res.status(200).send(JSON.stringify(cylindersData));
  } catch (error) {
    return sendError(error, res);
  }
};

const fetchProfiles = async (res) => {
  try {
    res.status(200).send(JSON.stringify(profilesData));
  } catch (error) {
    return sendError(error, res);
  }
};

const changeCylinderState = async (state, res) => {
  try {
    if (!pwm) throw new Error("PWM is not initialised !");
    // Shutdown all chanels for security
    pwm.allChannelsOff((err) => {
      if (err) {
        throw new Error("Error canceling channels, ", err);
      }
      // (1er param: chanel, 2em: value 0-1)
      pwm.setDutyCycle(state.chanel, state.value);
    });

    return res
      .status(200)
      .send(`Chanel ${state.chanel} is ok : ${state.value * 100}%`);
  } catch (error) {
    return sendError(error, res);
  }
};

module.exports = {
  changeCylinderState,
  fetchCylindersInfos,
  fetchProfiles,
};
