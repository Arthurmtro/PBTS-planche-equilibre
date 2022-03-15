export type profileType = {
	actions: actionType[]
	fileName: string
	duration: number
	category: string
	label: string
}

export type actionType = {
	commands: commandType[]
	cylinderId: string
}

export type commandType = {
	action: "forward" | "backward" | "stop"
	speed: number
	time: number
}
