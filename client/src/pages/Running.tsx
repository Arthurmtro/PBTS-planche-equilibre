import styles from "../styles/Running.module.css"

// Contexts
import { useRunningProfile } from "../contexts/runningProvider"

// Components
import ProgressBar from "../components/ProgressBar"
import Button from "../components/Button"
import Box from "../components/Box"
import ModelViewer from "../components/ModelViewer"

// import logo from "../assets/logo.gif"

export default function RunningPage() {
	const { runningProfile, gyroValues } = useRunningProfile()

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
							<Box size="fill">
								<div className={styles.info}>
									<h4>
										Durée : <strong>{Math.floor(runningProfile.duration / 1000)} secondes</strong>
									</h4>
									<h4>Donnée temps :</h4>
									<span>GyroX: {Math.floor(gyroValues?.gyroX)}</span>
									<span>GyroY: {Math.floor(gyroValues?.gyroY)}</span>
								</div>
							</Box>
						</div>

						<Box size="fill">
							<div className={styles["model-container"]}>
								<ModelViewer debug />
							</div>
						</Box>
					</section>
				</>
			) : (
				<div className={styles["no-profile"]}>
					<h1>Aucun profil en cours</h1>
					{/*
					<a href="https://www.youtube.com/watch?v=x0jPbnuZ3Rc">
						<img alt="404" src={logo} />
					</a> 
					*/}
				</div>
			)}
		</>
	)
}
