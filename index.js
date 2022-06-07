const http = require('http');
const i2c = require('i2c-bus');

(async () => {
  const i2cBus = i2c.open(5, () => {
    setTimeout(() => {
      i2cBus.scan((err, addresses) => {
        console.log(addresses);
      });
  
      i2cBus.closeSync();
    }, 500);
  });

  // http.get({
  //   hostname: 'pied.local',
  //   port: 80,
  //   path: '/',
  // }, (res) => {
  //   console.log(res.statusCode);
  // })
})()


