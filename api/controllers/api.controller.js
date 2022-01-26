const fs = require("fs");
const Pca9685Driver = require("pca9685").Pca9685Driver;
const cylindersData = require("../config/cylinders.json");

let i2cBus;

const os = require("os");
if (os.arch() === "arm" || os.arch() === "arm64") {
  // raspberrypi
  i2cBus = require("i2c-bus");
} else {
  console.warn("Not using I2C, You are not on raspberrypi", os.arch());
  i2cBus = null;
}

let isActive = false;

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
  return res && res.status(666).json({ error: error.message ?? "Unknow" });
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
    const profilesFiles = fs.readdirSync(`./config/profiles/`);
    if (profilesFiles.length === 0) throw new Error("No profiles detected !");

    const allProfiles = [];

    for (let index = 0; index < profilesFiles.length; index++) {
      const file = fs.readFileSync(
        `./config/profiles/${profilesFiles[index]}`,
        {
          encoding: "utf8",
          flag: "r",
        }
      );

      const stringifiedFile = JSON.parse(file);

      Object.assign(stringifiedFile, {
        fileName: profilesFiles[index].slice(
          0,
          profilesFiles[index].indexOf(".")
        ),
      });

      allProfiles.push(stringifiedFile);
    }

    res.status(200).send(allProfiles);
  } catch (error) {
    return sendError(error, res);
  }
};

const runProfileWithId = async (profileId, res) => {
  try {
    if (!pwm) throw new Error("PWM is not initialised !");

    fs.readFile(
      `./config/profiles/${profileId}.json`,
      {
        encoding: "utf8",
        flag: "r",
      },
      (err, data) => {
        if (err) throw new Error(err.message);
        const profile = JSON.parse(data);

        isActive = true;

        function executeProfile(action, verrin) {
          if (!isActive) return;

          profile.actions.map((action) => {
          if (!isActive) return;
          let verrin = cylindersData.find((x) => x.id === action.cylinderId);

          let commands = action.commands;

          for (let index = 0; index < commands; index++) {
            if (!isActive) return;

            console.log("isActive ======>> ", isActive);

            console.log("Execution de la séquence");
            pwm.channelOff(verrin.forwardId);
            pwm.channelOff(verrin.backwardId);
            switch (val.action) {
              case "forward":
                pwm.setDutyCycle(verrin.forwardId, val.speed);
                break;

              case "backward":
                pwm.setDutyCycle(verrin.backwardId, val.speed);
                break;
            }

            delay(commands[index].time);
          }
        });

        res.status(200).send({ profile });
      }
    );
  } catch (error) {
    return sendError(error, res);
  }
};

const init = async (res) => {
  try {
    if (!pwm) throw new Error("PWM is not initialised !");

    isActive = false;

    console.log("Execution de la séquence");
    for (let index = 0; index < cylindersData.length; index++) {
      console.log("Cylinder " + cylindersData[index].id);
      pwm.channelOff(cylindersData[index].backwardId);
      pwm.channelOff(cylindersData[index].forwardId);
      pwm.setDutyCycle(cylindersData[index].backwardId, 1);
    }
    delay(20000).then(() => {
      res.sendStatus(200);
    });
  } catch (error) {
    return sendError(error, res);
  }
};

module.exports = {
  fetchCylindersInfos,
  fetchProfiles,
  runProfileWithId,
  init,
};
