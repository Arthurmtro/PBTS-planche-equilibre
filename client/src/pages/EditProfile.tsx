import styles from "../styles/EditProfile.module.css";
import { useState } from "react";

import { ActionsType } from "../types/commands";

// Components
import OptionList from "../components/OptionList";

export default function EditProfilePage() {
	const [label, setLabel] = useState<string>("dawdawd")
	const [actions, setActions] = useState<ActionsType[]>([
		{
			cylinderId: "Verin1",
			commands:[]
		},
		{
			cylinderId: "Verin12",
			commands:[]
		},
		{
			cylinderId: "Verin3",
			commands:[]
		},
	])

	const handleFinishProfile = () => {
		// Appel api

		// Formatage du json

		const profile = {
			label: label,
			actions: actions
		}

		console.log('profile', profile)
	}

	return (
		<>
			<h1>Ajouter un profile</h1>
			<input type="text" value={label} onChange={(event)=> setLabel(event.target.value) } />
			<div className={styles.verrins}>
				{actions.map(((action, key) =>  <OptionList key={action.cylinderId} actionId={key}  actions={actions} setActions={setActions} /> ))}
			</div>
			<button onClick={()=> handleFinishProfile()}>Fini chef</button>
		</>
	)}
