import styles from "./Layout.module.css"
import { io } from "socket.io-client"
import { useEffect } from "react"

// Context
import { useRunningProfile } from "../../contexts/runningProvider"

// Components
import { api_url } from "../../config"
import StatusBar from "../StatusBar"
import NavBar from "../NavBar"

type ParamsType = {
	children: React.ReactNode
}

var interval: NodeJS.Timer

export default function Layout({ children }: ParamsType) {
	const { runningProfile, setRunningProfile, timeSpend, setTimeSpend, setGyroValues } = useRunningProfile()

	useEffect(() => {
		console.log("runningProfile :>> ", runningProfile)
		if (!runningProfile) {
			clearInterval(interval)
		} else {
			interval = setInterval(() => {
				setTimeSpend((prev) => prev + 10)
			}, 10)
		}

		const socket = io(api_url, {
			transports: ["websocket"],
		})

		if (!runningProfile) {
			socket.disconnect()
			return
		}

		socket.on("connect", () => console.log("socket.id: ", socket.id))
		socket.on("connect_error", () => {
			setTimeout(() => socket.connect(), 5000)
		})

		socket.on("mpuInfos", (data: { gyroX: number; gyroY: number }) => {
			console.log("runningProfile :>> ", runningProfile)
			if (runningProfile === null) {
				return
			}

			setGyroValues((prev) => {
				const newValues = prev

				newValues.gyroX = Number(newValues.gyroX) + Number(data.gyroX)
				newValues.gyroY = Number(newValues.gyroY) + Number(data.gyroY)

				console.log("newValues :>> ", newValues)

				return newValues
			})
			console.log("data :>> ", data)
		})

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

				<div className={styles["page-content"]}>{children}</div>
			</div>
		</div>
	)
}
