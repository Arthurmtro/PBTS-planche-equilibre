import styles from "../styles/EditProfile.module.css"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { ActionsType } from "../types/commands"

// Api
import createProfile from "../api/createProfile"
import updateProfile from "../api/updateProfile"

// Components
import OptionList from "../components/OptionList"
import { IProfile } from "../types/Infos"
import { useProfilesData } from "../contexts/profilesProvider"
import Button from "../components/Button"

const INITIAL_STATE = [
	{
		cylinderId: 0,
		commands: [],
	},
	{
		cylinderId: 1,
		commands: [],
	},
	{
		cylinderId: 2,
		commands: [],
	},
]

export default function EditProfilePage() {
	const { profiles } = useProfilesData()
	const { profileId } = useParams()
	const navigate = useNavigate()

	const [label, setLabel] = useState<string>("")

	const findedProfile = profiles?.find((profile) => profile.fileName === profileId) as any

	// console.log("findedProfile :>> ", findedProfile)

	const [actions, setActions] = useState<ActionsType[]>(profiles && findedProfile ? findedProfile.actions : INITIAL_STATE)
	const [runningProfile] = useState<IProfile | null>(null)

	console.log("actions :>> ", actions)

	useEffect(() => {
		if ((profileId && !profiles) || runningProfile) {
			navigate("/")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleFinishProfile = async () => {
		const profile = {
			label: label,
			actions: actions,
		}

		console.log("profile", profile)

		if (profileId) {
			const success = await updateProfile(profile)

			if (!success) return

			navigate("/")

			return window.location.reload()
		}
		const success = await createProfile(profile)

		if (!success) return

		navigate("/")

		window.location.reload()
	}

	return (
		<>
			<h1>{!profileId ? "Ajouter un profile" : "Edit profile"}</h1>
			<input type="text" value={label} onChange={(event) => setLabel(event.target.value)} />
			<div className={styles.verrins}>
				{actions.map((action, key) => (
					<OptionList key={action.cylinderId} actionId={key} actions={actions} setActions={setActions} />
				))}
			</div>
			<Button color="secondary" onClick={() => handleFinishProfile()}>
				Fini chef
			</Button>
		</>
	)
}
