const fs = require("fs");
const Pca9685Driver = require("pca9685").Pca9685Driver;

let i2cBus;

const os = require("os");
if (os.arch() === "arm" || os.arch() === "arm64") {
  // raspberrypi
  i2cBus = require("i2c-bus");
} else {
  console.warn("Not using I2C, You are not on raspberrypi", os.arch());
  i2cBus = null;
}

const cylindersData = require("../config/cylinders.json");

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
          let verrin = cylindersData.find((x) => x.id === action.cylinderId);

          console.log("cylindersData :>> ", cylindersData);

          executeProfile(action, verrin).then(() =>
            console.log(
              `Profil ${profile.name} pour le Verrin "${action.cylinderId}" terminé !`
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
  runProfileWithId,
};
