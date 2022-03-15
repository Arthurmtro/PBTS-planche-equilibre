import styles from "./OptionList.module.css"
import { Dispatch, SetStateAction } from "react"

// Types
import { ActionsType } from "../../types/commands";

// Libs
import { ConvertMsToS, convertToSpeed } from "../../libs/convertTime";

// Components
import Slider from "../Slider";

type OptionListType = {
	actionId: number, actions: ActionsType[], setActions: Dispatch<SetStateAction<ActionsType[]>> 
}

export default function OptionList({ actionId, actions, setActions }: OptionListType  ) {
	const updateCommands = (commandId: number, key: string, value: string | number) => {
		const newArray: ActionsType[] = [...actions]

		// @ts-ignore
		newArray[actionId].commands[commandId][key] = value

		console.log('newArray', newArray)

		setActions(newArray)
	}
	
	// Memo
	const handleClick = () => {
		let newArray: ActionsType[] = [...actions]

		newArray[actionId].commands = newArray[actionId].commands.concat({action: 'stop', time: 1, speed: 1, opening: 1})

		setActions(newArray)
	}

	return (
		<article className={styles['option-container']}>
			<h4>Verin:  {actionId}</h4>
			<div className={styles.commands}>
				{
					actions[actionId].commands && actions[actionId].commands.map((action, idx) => (
						<article className={styles['spacer-slider']} key={idx}>
							{
								action.action === "backward" || action.action === "forward" ? (
								<>
									<Slider label="Deploiment (en %)" min={1} max={100} value={action.opening} setter={(val) => updateCommands(idx, "opening", val)} />
									<Slider label="Vitesse (en %)" min={1} max={100} value={action.speed} setter={(val) => updateCommands(idx, "speed", val)} />
									{
										action.opening  && action.speed && <p>Temp: {ConvertMsToS(convertToSpeed(action.opening, action.speed))}s</p>
									}
								</>
								) : action.action === "stop"
								? (
									<>
										<Slider label="Temp d'arret (en ms)" min={1} max={25000} value={action.time} setter={(val) =>  updateCommands(idx, "time", val)} />
										{
											action.time && <p>Temp: {ConvertMsToS(action.time)}s</p>
										}
									</>
								) : (
									<div>No command.action</div>
								)
							}
							<select id="monselect" value={action.action} onChange={(e) => updateCommands(idx, "action", e.target.value)}>
								<option value="stop">Stop</option>
								<option value="forward">Ouvrir</option>
								<option value="backward">Fermer</option>
							</select>
						</article>
					))
				}
			</div>
			<button onClick={() => handleClick()}>Add Line</button>
		</article>
	)
}