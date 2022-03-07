import styles from "../styles/Running.module.css"
import { useState, useEffect } from "react"
import { io } from "socket.io-client"

// Contexts
import { useRunningProfile } from "../contexts/runningProvider"

// Components
import ProgressBar from "../components/ProgressBar"
import Button from "../components/Button"
import Box from "../components/Box"
import ModelViewer from "../components/ModelViewer"

import logo from "../assets/logo.gif"
import { api_url } from "../config"

type mpuInfosType = {
	gyroX: number
	gyroY: number
}

export default function RunningPage() {
	const { runningProfile } = useRunningProfile()
	const [mpuInfos, setMpuInfos] = useState<mpuInfosType>()

	useEffect(() => {
		console.log("api_url :>> ", api_url)
		const socket = io(api_url, {
			transports: ["websocket"],
		})

		socket.on("connect", () => console.log(socket.id))
		socket.on("connect_error", () => {
			setTimeout(() => socket.connect(), 5000)
		})

		socket.on("mpuInfos", (data) => {
			setMpuInfos(data)
			console.log("data :>> ", data)
		})
	}, [])

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
									<h4>
										Donnée temps `réel` : GyroX : {mpuInfos?.gyroX} GyroT: {mpuInfos?.gyroY}{" "}
									</h4>
									<span />
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
					<a href="https://www.youtube.com/watch?v=x0jPbnuZ3Rc">
						<img alt="404" src={logo} />
					</a>
				</div>
			)}
		</>
	)
}
