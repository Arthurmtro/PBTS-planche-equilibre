const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;

const options = {
  i2c: i2cBus.openSync(1),
  address: 0x40,
  frequency: 50,
  debug: true,
};

const pwm = new Pca9685Driver(options, (err) => {
  if (err) {
    throw new Error("Error initializing, PCA9685 is null");
  }
});

const sendError = (errorMessage, res) => {
  console.log(`error ${res} => ${errorMessage}`);
  return res !== undefined
    ? res.status(417).json({ errors: errorMessage })
    : null;
};

export const changeMoteurValue = async (value, res) => {
  try {
    pwm.setPulseLength(4, value, 0, (error) => console.log("error => ", error));

    return res.status(200).send(`Pca9685Driver is ok`);
  } catch (error) {
    return sendError(error);
  }
};

export const changeMoteurValue = async (state, res) => {
  try {
    // (1er param: chanel, 2em: value 0-1)
    pwm.setDutyCycle(state.chanel, state.value);

    return res
      .status(200)
      .send(`Chanel ${state.chanel} is ok : ${state.value * 100}%`);
  } catch (error) {
    return sendError(error);
  }
};
