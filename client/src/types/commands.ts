export type CommandsType = {
	time?: number
	action: string
	opening?: number
	speed?: number
}

export type ActionsType = {
	cylinderId: string
	commands: CommandsType[]
}
