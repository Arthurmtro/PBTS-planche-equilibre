import { CSSProperties, ReactNode } from "react"
import styles from "./Box.module.css"

export interface IBoxParams {
	size?: "lg" | "md" | "sm" | "fill" | "block"
	children?: ReactNode
}

export default function Box({ size = "md", children }: IBoxParams) {
	const convertSizeParamToSize = () => {
		switch (size) {
			case "lg":
				return { height: "25rem", width: "35rem" }
			case "md":
				return { height: "15rem", width: "25rem" }
			case "sm":
				return { height: "25rem", width: "30rem" }
			case "fill":
				return { height: "15vw", width: "100%" }
			case "block":
				return { height: "5vw", width: "100%" }
			default:
				return { height: "15rem", width: "25rem" }
		}
	}

	return (
		<div
			className={styles.background}
			style={
				{
					"--height": convertSizeParamToSize().height,
					"--width": convertSizeParamToSize().width,
				} as CSSProperties
			}>
			{children}
		</div>
	)
}
