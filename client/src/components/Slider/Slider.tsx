import { useState } from "react"
import styles from "./Slider.module.css"

type SliderType = {
	label: string
	setter?: (arg1: number) => void
	value?: number
	min?: number
	max?: number
}

export default function Slider({ label, setter = () => {}, value = 0, min = 0, max = 100 }: SliderType) {
	const [sliderValue, setSliderValue] = useState<number>(value)
	return (
		<div className={styles.slider}>
			<label>{label}</label>
			<input
				className={styles["back-slider"]}
				type="range"
				min={min}
				max={max}
				step="1"
				value={sliderValue}
				onChange={(event) => {
					setSliderValue(Number(event.target.value))
				}}
				onMouseUp={() => {
					setter(sliderValue)
				}}
			/>
			<input
				aria-label="number-input"
				className={styles["number-input"]}
				type="number"
				min={min}
				max={max}
				value={sliderValue}
				onChange={(event) => {
					setSliderValue(Number(event.target.value))
				}}
				onMouseUp={() => {
					setter(sliderValue)
				}}
			/>
		</div>
	)
}
