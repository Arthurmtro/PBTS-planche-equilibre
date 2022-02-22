import { SetStateAction, createContext, useContext, ReactNode, Dispatch, useState, useMemo, useEffect } from "react"
import { toggleTheme } from "../lib/theme"

interface IThemeContext {
	darkMode: boolean
	setDarkMode: Dispatch<SetStateAction<boolean>>
}

const ThemeContext = createContext<IThemeContext>({
	darkMode: false,
	setDarkMode: () => {},
})

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem("planche-equilibre-theme") === "false" ? false : true)
	const value = useMemo(() => ({ darkMode, setDarkMode }), [darkMode])

	useEffect(() => {
		const theme = localStorage.getItem("planche-equilibre-theme")

		//document.documentElement.classList.contains("dark")

		if (value.darkMode !== Boolean(theme)) {
			toggleTheme()
			setDarkMode(Boolean(localStorage.getItem("planche-equilibre-theme")))
		}

		console.groupEnd()
	}, [value.darkMode])

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
