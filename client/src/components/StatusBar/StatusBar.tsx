import styles from "./StatusBar.module.css"
import { CSSProperties } from "react"

// Contexts
import { useCylindersData } from "../../contexts/cylindersProdiver"
import { useRunningProfile } from "../../contexts/runningProvider"

// Components
import Button from "../Button"
import Badge from "../Badge"
import { stopProfile } from "../../utils/stopProfile"

export default function StatusBar() {
	const { status, error } = useCylindersData()
	const { runningProfile, setRunningProfile, setTimeSpend } = useRunningProfile()

	if (error) {
		console.log("error :>> ", error?.message)
	}

	return (
		<section className={styles["status-bar"]}>
			<div className={styles["playing-status"]}>
				{runningProfile !== null && runningProfile.label !== "init" ? (
					<>
						<Button disabled color="white" thin>
							En cours actuellement: <span className={styles["profile-title"]}>{runningProfile.label.toUpperCase()}</span>
						</Button>
						<Button color="danger" onClick={() => stopProfile(setTimeSpend, setRunningProfile)}>
							STOP
						</Button>
					</>
				) : runningProfile !== null && runningProfile.label === "init" ? (
					<>
						<Button disabled color="secondary" thin>
							initialisation planche...
						</Button>
					</>
				) : (
					<>
						<Button color="primary" onClick={() => stopProfile(setTimeSpend, setRunningProfile)}>
							initialiser planche
						</Button>
					</>
				)}
			</div>
			<div className={styles.status}>
				Status :{" "}
				<span
					className={styles["status-text"]}
					style={
						{
							"--status-color": status === "success" ? "#1FB112" : status === "error" ? "#DF0D0D" : "var(--color-primary)",
						} as CSSProperties
					}>
					{status === "success" ? "Connecté" : status}
				</span>
				<Badge disabled color={status === "success" ? "success" : status === "loading" ? "primary" : "danger"} />
			</div>
		</section>
	)
}
