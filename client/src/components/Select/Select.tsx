//import { CSSProperties, ReactNode } from "react"
import styles from "./Select.module.css"

interface ISelectnParams {
	idx: number
	setter: (arg1: number, arg2: string, arg3: string) => void
	value: string
}

export default function Button({ idx, setter, value }: ISelectnParams) {
	return (
		<select className={styles.select} id="monselect" value={value} onChange={(e) => setter(idx, "action", e.target.value)}>
			<option value="stop">Stop</option>
			<option value="forward">Ouvrir</option>
			<option value="backward">Fermer</option>
			<option value="bascule-arriere">Bascule arriere</option>
			<option value="bascule-avant">Bascule avant</option>
			<option value="basculeD">Bascule droite</option>
			<option value="basculeG">Bascule gauche</option>
			<option value="roulis">Roulis</option>
		</select>
	)
}
