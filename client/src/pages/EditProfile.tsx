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
import deleteProfile from "../api/deleteProfile"

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

	const findedProfile = profiles?.find((profile) => profile.fileName === profileId) as any

	const [label, setLabel] = useState<string>(profiles && findedProfile ? findedProfile.label : "")
	// console.log("findedProfile :>> ", findedProfile)

	const [actions, setActions] = useState<ActionsType[]>(profiles && findedProfile ? findedProfile.actions : INITIAL_STATE)
	const [runningProfile] = useState<IProfile | null>(null)

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
			const success = await updateProfile(profile, findedProfile.fileName)

			if (!success) return

			navigate("/")

			return window.location.reload()
		}
		const success = await createProfile(profile)

		if (!success) return

		navigate("/")

		window.location.reload()
	}

	const handleDelete = (fileName: string) => {
		deleteProfile(fileName)
		window.location.reload()
	}

	return (
		<>
			<div className={styles.header}>
				<div className={styles.title}>
					<h1>{!profileId ? "Ajouter un profil" : "Modifier le profil"}</h1>
					<input type="text" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Nom du profil" required maxLength={25} />
				</div>
				<div>
					{profileId && (
						<Button color="danger" onClick={() => handleDelete(findedProfile.fileName)}>
							Supprimer
						</Button>
					)}
					<Button color="primary" onClick={() => handleFinishProfile()}>
						Terminer
					</Button>
				</div>
			</div>

			<div className={styles.verrins}>
				{actions.map((action, key) => (
					<OptionList key={action.cylinderId} actionId={key} actions={actions} setActions={setActions} />
				))}
			</div>
		</>
	)
}
