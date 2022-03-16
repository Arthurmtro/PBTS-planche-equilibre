import styles from "../styles/EditProfile.module.css"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { ActionsType } from "../types/commands"

// Api
import createProfile from "../api/createProfile"

// Components
import OptionList from "../components/OptionList"
import { IProfile } from "../types/Infos"
import { useProfilesData } from "../contexts/profilesProvider"

const INITIAL_STATE = [
	{
		cylinderId: "Verin1",
		commands: [],
	},
	{
		cylinderId: "Verin12",
		commands: [],
	},
	{
		cylinderId: "Verin3",
		commands: [],
	},
]

export default function EditProfilePage() {
	const { profiles } = useProfilesData()
	const { profileId } = useParams()
	const navigate = useNavigate()

	const [label, setLabel] = useState<string>("")

	const findedProfile = profiles?.find((profile) => profile.fileName === profileId) as any

	const [actions, setActions] = useState<ActionsType[]>(profiles && findedProfile ? findedProfile : INITIAL_STATE)
	const [runningProfile] = useState<IProfile | null>(null)

	useEffect(() => {
		if (runningProfile) {
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
			<button disabled={label.length === 0} onClick={() => handleFinishProfile()}>
				Fini chef
			</button>
		</>
	)
}
