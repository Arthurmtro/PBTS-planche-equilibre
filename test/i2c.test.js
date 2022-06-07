const i2c = require("i2c-bus")

const i2cBusesNumber = [1, 4, 5]
const i2cAdresses = [[64, 104, 112], [104], [104]]

describe('Start testing the I2C module', () => {
  test('Open I2C bus instances', (done) => {
    for (let busNumber = 0; busNumber < i2cBusesNumber.length; busNumber++) {
      const i2cBus = i2c.open(i2cBusesNumber[busNumber], () => {
        expect(i2cBus._busNumber).toBe(i2cBusesNumber[busNumber])
        expect(i2cBus._forceAccess).toBe(false)

        i2cBus.closeSync();

        done();
      });
    }
  });

  test('Scan all devices on each I2C bus', (done) => {
    for (let busNumber = 0; busNumber < i2cBusesNumber.length; busNumber++) {
      const i2cBus = i2c.open(i2cBusesNumber[busNumber], () => {
        setTimeout(() => {
          i2cBus.scan((err, addresses) => {
            expect(addresses).toEqual(i2cAdresses[busNumber])
            done()
          });

          i2cBus.closeSync();
        }, 500 * busNumber);
      });
    }
  })
})