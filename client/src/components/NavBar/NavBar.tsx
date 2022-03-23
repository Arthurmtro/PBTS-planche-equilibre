import NavLink from "../NavLink"
import styles from "./NavBar.module.css"

import logo from "../../assets/logo.gif"
import { useRunningProfile } from "../../contexts/runningProvider"

export default function NavBar() {
	const { runningProfile } = useRunningProfile()

	return (
		<section className={styles.navbar}>
			<ul>
				<NavLink path="/" label="Accueil" icon="home" />
				{!!runningProfile && <NavLink path="/running" label="En cours" icon="running" />}
				<NavLink path="/configuration" label="Options" icon="configuration" />
			</ul>
			<span>
				<img className={styles["app-logo"]} alt="404" src={logo} />
			</span>
		</section>
	)
}
