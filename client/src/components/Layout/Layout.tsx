import styles from "./Layout.module.css"
import { useEffect } from "react"

// Context
import { useRunningProfile } from "../../contexts/runningProvider"

// Components
import NavBar from "../NavBar"
import StatusBar from "../StatusBar"
import { api_url } from "../../config"
import { io } from "socket.io-client"

type ParamsType = {
	children: React.ReactNode
}

var interval: NodeJS.Timer

const socket = io(api_url, {
	transports: ["websocket"],
})

socket.on("connect", () => console.log("socket.id: ", socket.id))
socket.on("connect_error", () => {
	setTimeout(() => socket.connect(), 5000)
})

export default function Layout({ children }: ParamsType) {
	const { runningProfile, setRunningProfile, timeSpend, setTimeSpend, gyroValues, setGyroValues } = useRunningProfile()

	socket.on("mpuInfos", (data) => {
		console.log("runningProfile :>> ", runningProfile)
		if (runningProfile === null) {
			console.log("No profile running")
			return
		}

		console.log("data :>> ", data)

		const newX = (gyroValues.gyroX += data.gyroX)
		const newY = (gyroValues.gyroY += data.gyroY)

		setGyroValues({
			gyroX: newX,
			gyroY: newY,
		})
		console.log("data :>> ", data)
	})

	useEffect(() => {
		console.log("runningProfile :>> ", runningProfile)
		if (!runningProfile) return clearInterval(interval)

		interval = setInterval(() => {
			setTimeSpend((prev) => prev + 10)
		}, 10)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [runningProfile])

	useEffect(() => {
		if (runningProfile === null) {
			setGyroValues({
				gyroX: 0,
				gyroY: 0,
			})
			return clearInterval(interval)
		}
		if (timeSpend >= runningProfile.duration) {
			clearInterval(interval)
			setRunningProfile(null)
			setTimeSpend(0)
			setGyroValues({
				gyroX: 0,
				gyroY: 0,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeSpend])

	return (
		<div className={styles.layout}>
			<StatusBar />
			<div className={styles["app-content"]}>
				<div className={styles["nav-bar"]}>
					<NavBar />
				</div>

				<div className={styles["page-content"]}>
					<div>{children}</div>
				</div>
			</div>
		</div>
	)
}
