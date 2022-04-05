////////////////////////////////////////bibliothèque///////////////////////////////////////////////////////

var i2cBus = require("i2c-bus"); // bibliothèque pour la liaison  hard et saufte
var Pca9685Driver = require("pca9685").Pca9685Driver; // bibliothèque pour PCA9685

/////////////////////////////////////////option/////////////////////////////////////////////////////////////

var options = {
  // option de la carte bleu
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

  // il fais avancer et reculer mais on choisie la vitesse sa vas de 0.1 a 1

  pwm.setDutyCycle(2, 1); // gérer 1 verin 7 desendre / 8 monter
  //pwm.setDutyCycle(4, 1); // gérer l autre 5 desendre / 6 monter
  //pwm.setDutyCycle(4, 1); // gérer l autre 5 desendre / 6 monter

  /* pwm.setPulseRange(1, 50, 255, function() {
         if (err) {
             console.error("Error setting pulse range.");
         } else {
             console.log("Pulse range set.");
            }
 */
  //pwm.setPulseLength(0, 300);// pour le serveau moteur sa marche

  // a 100% le chanel il fais avancer et reculer le verrin
  //pwm.channelOff(7);
  //pwm.channelOn(8);

  // a voir
  //pwm.setPWM(pin, 0, 4096); //allumer
  //pwm.setPWM(pin, 4096, 0);// eteindre
  /////////////////////////////////////////////////////////profile inclinaisonss//////////////////////////////////////////////////
});
//pwm.allChannelsOff(); // tout eteindre
