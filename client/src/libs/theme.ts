export const toggleTheme = () => {
	document.documentElement.classList.add("theming")
	document.documentElement.addEventListener(
		"transitionend",
		() => {
			if (document.documentElement) {
				document.documentElement.classList.remove("theming")
			}
		},
		{ once: true }
	)
	localStorage.setItem("planche-equilibre-theme", String(document.documentElement.classList.contains("dark")))
	document.documentElement.classList.toggle("dark")
}
