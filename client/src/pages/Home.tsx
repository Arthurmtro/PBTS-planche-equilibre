import { useNavigate } from "react-router-dom"
import styles from "../styles/Home.module.css"

// Contexts
import { useProfilesData } from "../contexts/profilesProvider"

// Components
import ProgressBar from "../components/ProgressBar"
import ProfileBox from "../components/ProfileBox"
import Button from "../components/Button"

export default function HomePage() {
	const { profiles, status, error } = useProfilesData()
	const navigate = useNavigate()
	return (
		<>
			<ProgressBar />
			<div className={styles.shortcut}>
				<Button onClick={() => navigate("/edit-profile")}>Ajouter un profil</Button>
			</div>
			{status === "loading" || status === "idle" ? (
				<h1>Chargement ...</h1>
			) : (
				<div className={styles["profiles-boxes"]}>
					{status === "error" && <h1>Erreur : {error?.message}</h1>}
					{status === "success" && profiles?.map((profile) => <ProfileBox key={profile.fileName} profile={profile} />)}
				</div>
			)}
		</>
	)
}
