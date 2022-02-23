//import styles from "../styles/Running.module.css";

import { useTheme } from "../contexts/themeProvider"

// Components
import Box from "../components/Box"
import ModelViewer from "../components/ModelViewer"

export default function ConfigurationPage() {
	const { darkMode, setDarkMode } = useTheme()

	// console.log("darkMode :>> ", darkMode)

	return (
		<div>
			<Box />
			<button
				onClick={() => {
					setDarkMode((prev) => !prev)
				}}>
				toggle Theme: {String(darkMode)}
			</button>

			<ModelViewer enableRotate />
		</div>
	)
}
