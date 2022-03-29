"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.msleep = void 0;
function msleep(n) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
exports.msleep = msleep;
function sleep(n) {
    msleep(n * 1000);
}
exports.sleep = sleep;
//# sourceMappingURL=sleep.js.map