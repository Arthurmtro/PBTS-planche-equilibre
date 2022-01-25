const fs = require("fs");
const Pca9685Driver = require("pca9685").Pca9685Driver;

let i2cBus;

const os = require("os");

console.log('os.arch()  :>> ', os.arch() );
if (os.arch() === "arm" || os.arch() === "arm64" ) {
  // raspberrypi
  i2cBus = require("i2c-bus");
} else {
  console.warn("Not using I2C, You are not on raspberrypi", os.arch());
  i2cBus = null;
}

const cylindersData = require("../config/cylinders.json");
console.log("cylindersData", cylindersData);

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
    if (!pwm) throw new Error("PWM is not initialised !");

    fs.readFile(
      `./config/profiles/${profileName}.json`,
      {
        encoding: "utf8",
        flag: "r",
      },
      (err, data) => {
        if (err) throw new Error(err);
        const profile = JSON.parse(data);

        function executeProfile(action, verrin) {
          let commands = action.commands;
          return commands.reduce(
            (lastProm, val) =>
              lastProm.then((resultArrSoFar) =>
                delay(val.time)
                  .then(() => {
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
                    return val;
                  })
                  .then((result) => [...resultArrSoFar, result])
              ),
            Promise.resolve([])
          );
        }

        profile.actions.map((action) => {
          let verrin = cylindersData.find((x) => x.name === action.verrinName);

          console.log('cylindersData :>> ', cylindersData);


          executeProfile(action, verrin).then(() =>
            console.log(
              `Profil ${profile.name} pour le Verrin "${action.verrinName}" terminé !`
            )
          );
        });

        res.status(200).send({ profile });
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
