//import styles from "../styles/Running.module.css";

import { useTheme } from "../contexts/themeProvider"

// Components
import Button from "../components/Button"
import Box from "../components/Box"

export default function ConfigurationPage() {
	const { darkMode, setDarkMode } = useTheme()

	// console.log("darkMode :>> ", darkMode)

	return (
		<div>
			<Button
				onClick={() => {
					setDarkMode((prev) => !prev)
				}}>
				toggle Theme: {String(darkMode) ? "Dark" : "Light"}
			</Button>
		</div>
	)
}
