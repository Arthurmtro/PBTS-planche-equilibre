import styles from "./OptionList.module.css"
import { Dispatch, SetStateAction, useState } from "react"

// Types
import { ActionsType, CommandsType } from "../../types/commands"

// Libs
import { ConvertMsToS, convertToSpeed } from "../../libs/convertTime"

// Components
import Slider from "../Slider"
import Button from "../Button"
import Select from "../Select"
import Box from "../Box"
import { IBoxParams } from "../Box/Box"

type OptionListType = {
	actionId: number
	actions: ActionsType[]
	setActions: Dispatch<SetStateAction<ActionsType[]>>
	// boxSize: IBoxParams["size"]
}

type SlidersProps = {
	idx: number
	action: CommandsType
}

export default function OptionList({ actionId, actions, setActions }: OptionListType) {
	const [boxSize, setBoxSize] = useState<IBoxParams["size"]>("md")

	const updateCommands = (commandId: number, key: string, value: string | number) => {
		const newArray: ActionsType[] = [...actions]

		// @ts-ignore
		newArray[actionId].commands[commandId][key] = value

		console.log("newArray", newArray)

		setActions(newArray)
	}

	const handleClick = () => {
		let newArray: ActionsType[] = [...actions]

		newArray[actionId].commands = newArray[actionId].commands.concat({ action: "stop", time: 1, speed: 1, opening: 1 })

		setActions(newArray)
	}

	const deleteCommand = (indexToDelete: number) => {
		let newArray: ActionsType[] = [...actions]

		newArray[actionId].commands = newArray[actionId].commands.filter((command, idx) => idx !== indexToDelete)
		setActions(newArray)
	}

	const Sliders = ({ idx, action }: SlidersProps) => {
		switch (action.action) {
			case "backward":
			case "forward":
				return (
					<>
						<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
						<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
						{action.opening && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>}
					</>
				)
			case "stop":
				setBoxSize("md")
				return (
					<>
						<Slider
							label="Temp d'arret (en ms)"
							min={1}
							max={25000}
							value={action.time}
							setter={(val) => {
								console.log(val)
								updateCommands(idx, "time", val)
							}}
						/>
						{console.log(action.time)}
						{action.time && <p>Temp: {ConvertMsToS(action.time)}s</p>}
					</>
				)

			case "bascule-avant":
				setBoxSize("fill")
				return (
					<>
						<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
						<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
						{action.opening && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>}
					</>
				)
			case "bascule-arriere":
				setBoxSize("fill")
				return (
					<>
						<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
						<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
						{action.opening && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>}
					</>
				)

			case "basculeD":
				setBoxSize("fill")
				return (
					<>
						<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
						<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
						{action.opening && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>}
					</>
				)

			case "basculeG":
				setBoxSize("fill")
				return (
					<>
						<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
						<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
						{action.opening && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>}
					</>
				)
			case "roulis":
				setBoxSize("fill")
				return (
					<>
						<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
						<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
						{action.opening && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>}
					</>
				)
			default:
				return <div>No command.action</div>
		}
	}

	return (
		<article className={styles["option-container"]}>
			{console.log("Refresh")}
			<h4>Verin: {actionId}</h4>
			<div className={styles.commands}>
				{actions[actionId].commands &&
					actions[actionId].commands.map((action, idx) => (
						<div key={idx} className={styles.test}>
							<Box size={boxSize}>
								<div className={styles.content}>
									<Select idx={idx} setter={updateCommands} value={action.action} />
									<Button onClick={() => deleteCommand(idx)} color="danger">
										Delete
									</Button>
									<Sliders idx={idx} action={action} />
								</div>
							</Box>
						</div>
					))}
			</div>
			<Button onClick={() => handleClick()}>Add Line</Button>
		</article>
	)
}
