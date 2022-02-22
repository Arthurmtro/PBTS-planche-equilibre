export type profileType = {
	label: string
	cateory: string
	duration: number
	actions: actionType[]
}

export type actionType = {
	cylinderId: string
	commands: commandType[]
}
export type commandType = {
	action: "forward" | "backward" | "stop"
	speed: number
	time: number
}
