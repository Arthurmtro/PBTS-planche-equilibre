const fs = require("fs");
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
  frequency: 1000,
  debug: true,
};

const delay = (value) => new Promise((res) => setTimeout(res, value));

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

const runProfileWithName = async (profileName, res) => {
  try {
    fs.readFile(
      `./config/profiles/${profileName}.json`,
      {
        encoding: "utf8",
        flag: "r",
      },
      (err, data) => {
        if (err) throw new Error(err);
        const config = JSON.parse(data);

        res.status(200).send({ data: config });
      }
    );
  } catch (error) {
    return sendError(error, res);
  }
};

module.exports = {
  fetchCylindersInfos,
  fetchProfiles,
  runProfileWithName,
};
