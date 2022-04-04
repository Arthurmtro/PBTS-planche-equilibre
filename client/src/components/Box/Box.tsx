import { CSSProperties, ReactNode } from "react"
import styles from "./Box.module.css"

export interface IBoxParams {
	size?: "lg" | "md" | "sm" | "fill" | "block" | "fit"
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
				return { height: "15rem", width: "100%" }
			case "block":
				return { height: "5rem", width: "100%" }
			case "fit":
				return { height: "fit-content", width: "fit-content" }
			default:
				return { height: "fit-content", width: "fit-content" }
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
