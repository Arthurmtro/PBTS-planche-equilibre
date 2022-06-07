import i2cBus from 'i2c-bus';
import { Pca9685Driver } from 'pca9685'

import chalk from 'chalk';
import fs from 'fs';

let profiles = fs.readFileSync('profiles.json');
let profilesJson = JSON.parse(profiles)

let verrins = fs.readFileSync('verrins.json');
let verrinsJson = JSON.parse(verrins)

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x40,
    frequency: 1000,
    debug: true
};

const delay = (value) => new Promise(res => setTimeout(res, value));


const pwm = new Pca9685Driver(options, function (err) {
    if (err) {
        console.error(`[ ${chalk.red.bold("ERROR")} ] Error initializing PCA9685`)
        process.exit(-1);
    }
    console.log(`[ ${chalk.green.bold("INFO")} ] Initialisation de l'instance terminée !`)

    function executeProfile(action, verrin) {
        let commands = action.commands;
        return commands.reduce((lastProm, val) => lastProm.then(
            (resultArrSoFar) => delay(val.time).then(() => {
                console.log(`[ ${chalk.green.bold("INFO")} ] Execution de la séquence`)
                pwm.channelOff(verrin.forwardId)
                pwm.channelOff(verrin.backwardId)
                switch (val.action) {
                    case "forward":
                        pwm.setDutyCycle(verrin.forwardId, val.speed);
                        break;

                    case "backward":
                        pwm.setDutyCycle(verrin.backwardId, val.speed);
                        break;
                }
                console.log()
                return val;
            }).then(result => [...resultArrSoFar, result])
        ), Promise.resolve([]));
    }
    profilesJson.actions.map(action => {
        let verrin = verrinsJson.find(x => x.name === action.verrinName)
        executeProfile(action, verrin).then(() => {
            setTimeout(() => {
                console.log(`[ ${chalk.green.bold("INFO")} ] Profil "${chalk.bold(profilesJson.name)}" pour le Verrin "${chalk.bold(action.verrinName)}" terminé !`)
            }, 500);
        });
    })

    process.on('exit', (code) => {
        console.log(`[ ${chalk.green.bold("INFO")} ] Sortie du programme avec le code : ${chalk.yellow.bold(code)}`)
        pwm.allChannelsOff()
    });
});