import { Pca9685Driver } from "pca9685"

// Libs
import { delayFunction } from "./delayFunction"

// Types
import { cylinderType } from "./../types/cylinderType"
import { actionType } from "./../types/profileTypes"

export const executeProfile = async (isActive: boolean, pwm: Pca9685Driver, action: actionType, cylinder?: cylinderType) => {
	if (!isActive || !cylinder) return

	for (const command of action.commands) {
		if (!isActive) return
		console.log("Execution de la séquence ", command)
		pwm.channelOff(cylinder.forwardId)
		pwm.channelOff(cylinder.backwardId)

		if (command.action !== "stop") {
			pwm.setDutyCycle(cylinder[`${command.action}Id`], command.speed)
			pwm.setDutyCycle(cylinder[`${command.action}Id`], command.speed)
		}

		await delayFunction(command.time).then(() => command)
	}
	return
}
