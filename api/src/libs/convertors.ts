const CYLINDER_SPEED = 4.35

export const speedPercentToRealSpeed = (speedPercent: number) => {
	// return (speedPercent * CYLINDER_SPEED) /  100
	return (speedPercent / 100) * CYLINDER_SPEED
}

export const convertToSpeed = (opening: number, speed: number) => {
	return (opening / speedPercentToRealSpeed(speed)) * 10e2
}
