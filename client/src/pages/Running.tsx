import styles from "../styles/Running.module.css"

// Contexts
import { useRunningProfile } from "../contexts/runningProvider"

// Components
import ProgressBar from "../components/ProgressBar"
import Button from "../components/Button"
import Box from "../components/Box"

export default function RunningPage() {
	const { runningProfile } = useRunningProfile()

	return (
		<>
			{runningProfile !== null ? (
				<>
					<ProgressBar />
					<section className={styles.header}>
						<div className={styles["header-titles"]}>
							<h1>{runningProfile.label}</h1>
							<h5>{runningProfile.category}</h5>
						</div>
						<Button disabled={runningProfile.label === "init"}>Editer</Button>
					</section>

					<section className={styles["running-infos"]}>
						<div className={styles["infos-contents"]}>
							<Box size="block">
								<div className={styles.info}>
									<span />
									<h4>
										Durée : <strong>{runningProfile.duration / 1000} secondes</strong>
									</h4>
									<span />
								</div>
							</Box>
							<Box size="block">
								<div className={styles.info}>
									<span />
									<h4>Donnée temps `réel` :</h4>
									<span />
								</div>
							</Box>
						</div>
						<Box size="fill" />
					</section>
				</>
			) : (
				<>
					<h1>Aucun profil en cours</h1>
				</>
			)}
		</>
	)
}
