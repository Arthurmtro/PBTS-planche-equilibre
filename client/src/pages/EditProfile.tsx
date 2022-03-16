import styles from "../styles/EditProfile.module.css";
import { useState } from "react";

import { ActionsType } from "../types/commands";

// Api
import createProfile from "../api/createProfile"

// Components
import OptionList from "../components/OptionList";
import Button from "../components/Button"

const INITIAL_STATE = [
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
]

export default function EditProfilePage() {
	const [label, setLabel] = useState<string>("dawdawd")
	const [actions, setActions] = useState<ActionsType[]>(INITIAL_STATE)

	const handleFinishProfile = () => {
		// Appel api

		const profile = {
			label: label,
			actions: actions
		}

		console.log('profile', profile)

		createProfile(profile)
	}

	return (
		<>
			<h1>Ajouter un profile</h1>
			<input type="text" value={label} onChange={(event)=> setLabel(event.target.value) } />
			<div className={styles.verrins}>
				{actions.map(((action, key) =>  <OptionList key={action.cylinderId} actionId={key}  actions={actions} setActions={setActions} /> ))}
			</div>
			<Button color="secondary" onClick={()=> handleFinishProfile()}>Fini chef</Button>
		</>
	)}
