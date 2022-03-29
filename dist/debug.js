"use strict";
// var debugConsole = function (debug) {
//   this.enabled = debug || false;
// };
// debugConsole.prototype.Log = function (type, str) {
//   if (this.enabled) {
//     var date = new Date();
//     var strdate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
//     var strhour = date.getHours() + ':' + date.getMinutes();
//     console.log('[' + type.toUpperCase() + '][' + strhour + ' ' + strdate + ']:' + str);
//   }
// };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debug = void 0;
class Debug {
    constructor(isEnabled = false) {
        this.isEnabled = isEnabled;
    }
    log(type, str) {
        if (this.isEnabled) {
            const date = new Date();
            const strdate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const strhour = `${date.getHours()}:${date.getMinutes()}`;
            console.log(`[${type.toUpperCase() || "info"}][${strhour}-${strdate}]: ${str}`);
        }
    }
}
exports.Debug = Debug;
//# sourceMappingURL=debug.js.map