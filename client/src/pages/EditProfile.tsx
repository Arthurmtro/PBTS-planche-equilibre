import styles from "../styles/EditProfile.module.css";
import { useState } from "react";

import Slider from "../components/Slider";


type CommandsType = {
	openner: number
	speed: number
}


const OptionList = ({idVerrin, commands} : {idVerrin: number, commands: CommandsType[] }) => {
	console.log("options = ", idVerrin)

	return (
		<>
			<p>Verin {idVerrin}</p>  
			<div className={styles.commands}>
			{
				commands.map(() => (
					<>
						<Slider label="Pourcentage deploiment" nbverin={idVerrin} min={0} max={100} /> 
						<Slider label="Pourcentage de la vites" nbverin={idVerrin} min={0} max={99}/>
					</>
				))
			}
			</div>
		</>
	)
}

export default function EditProfilePage() {
	const [verrinIds, setVerrinIds] = useState<number[]>([0,  1, 2])
	const [commands, setCommands] = useState<CommandsType[]>([])

	// Memo
	const handleClick = () => {
		setCommands(prev => [...prev, {
			openner: 0,
			speed: 0
		}])
	}

	return (
		<>
			<div className={styles.verrins}>
				{verrinIds.map((verrinId =>  <OptionList key={verrinId} idVerrin={verrinId}  commands={commands}  /> ))}
			</div>
			<button onClick={() => handleClick()}>Add Line</button>
		</>
	)}
