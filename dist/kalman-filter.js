"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KalmanFilter = void 0;
class KalmanFilter {
    constructor() {
        this.Q_angle = 0.001;
        this.Q_bias = 0.003;
        this.R_measure = 0.03;
        this.angle = 0;
        this.bias = 0;
        this.rate = 0;
        this.P = [
            [0, 0],
            [0, 0],
        ];
        this.S = 0;
        this.K = [0, 0];
        this.Y = 0;
    }
    getAngle(newAngle, newRate, dt) {
        this.rate = newRate - this.bias;
        this.angle += dt * this.rate;
        this.P[0][0] += dt * (dt * this.P[1][1] - this.P[0][1] - this.P[1][0] + this.Q_angle);
        this.P[0][1] -= dt * this.P[1][1];
        this.P[1][0] -= dt * this.P[1][1];
        this.P[1][1] += this.Q_bias * dt;
        this.S = this.P[0][0] + this.R_measure;
        this.K[0] = this.P[0][0] / this.S;
        this.K[1] = this.P[1][0] / this.S;
        this.Y = newAngle - this.angle;
        this.angle += this.K[0] * this.Y;
        this.bias += this.K[1] * this.Y;
        this.P[0][0] -= this.K[0] * this.P[0][0];
        this.P[0][1] -= this.K[0] * this.P[0][1];
        this.P[1][0] -= this.K[1] * this.P[0][0];
        this.P[1][1] -= this.K[1] * this.P[0][1];
        return this.angle;
    }
    getRate() {
        return this.rate;
    }
    getQangle() {
        return this.Q_angle;
    }
    getQbias() {
        return this.Q_bias;
    }
    getRmeasure() {
        return this.R_measure;
    }
    setAngle(value) {
        this.angle = value;
    }
    setQangle(value) {
        this.Q_angle = value;
    }
    setQbias(value) {
        this.Q_bias = value;
    }
    setRmeasure(value) {
        this.R_measure = value;
    }
}
exports.KalmanFilter = KalmanFilter;
//# sourceMappingURL=kalman-filter.js.map