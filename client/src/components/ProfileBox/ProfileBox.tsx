import { useNavigate } from "react-router-dom"

// Api
import runProfile from "../../api/runProfile"
import initPlanche from "../../api/initPlanche"

// types
import { IProfile } from "../../types/Infos"

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider"

// Components
import styles from "./ProfileBox.module.css"
import Button from "../Button"
import Badge from "../Badge"
import Box from "../Box"
import deleteProfile from "../../api/deleteProfile"

type ProfileBoxParams = {
	profile: IProfile
}

export default function ProfileBox({ profile }: ProfileBoxParams) {
	const { runningProfile, setRunningProfile, setTimeSpend } = useRunningProfile()

	const navigate = useNavigate()

	const setProfile = () => {
		if (!profile.fileName) return

		setTimeSpend(0)
		setRunningProfile(profile)
		runProfile(profile.fileName)
		navigate("/running")
	}

	const stopProfile = () => {
		setTimeSpend(0)
		setRunningProfile({
			label: "init",
			duration: 23000,
		})
		initPlanche()
	}

	return (
		<Box size="fill">
			<div className={styles.content}>
				<div className={styles.infos}>
					<h1>{profile.label}</h1>
				</div>
				<div className={styles.actions}>
					<Badge disabled color={runningProfile && runningProfile.fileName === profile.fileName ? "success" : "danger"} />
					{runningProfile && runningProfile.fileName === profile.fileName ? (
						<Button disabled={runningProfile.label === "init"} color="danger" onClick={() => stopProfile()}>
							Stop
						</Button>
					) : (
						<>
							<Button disabled={runningProfile !== null} color="danger" onClick={() => deleteProfile(String(profile.fileName))}>
								Delete
							</Button>
							<Button disabled={runningProfile !== null} color="white" onClick={() => navigate(`/edit-profile/${profile.fileName}`)}>
								Edit
							</Button>
							<Button disabled={runningProfile !== null} color="secondary" onClick={() => setProfile()}>
								lancer
							</Button>
						</>
					)}
				</div>
			</div>
		</Box>
	)
}
