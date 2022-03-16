export type profileType = {
	actions: actionType[]
	fileName: string
	duration: number
	category: string
	label: string
}

export type actionType = {
	commands: commandType[]
	cylinderId: number
}

export type commandType = {
	time: number
	action: string
	opening: number
	speed: number
}
