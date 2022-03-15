import styles from "./Slider.module.css";

type SliderType = {
  label: string
  setter: (arg1: number) => void
  value?: number
  min?: number
  max?: number
}

export default function Slider({ label, setter, value = 0, min = 0, max = 100 }: SliderType) {

  return (
    <div className={styles.slider}>
      <label>{label}</label>
      <input className={styles['back-slider']} type="range" id={label} name={label} min={min} max={max} step="1" value={value} onChange={(event) => {
        setter(Number(event.target.value))
      }} />
      <input className={styles["number-input"]} type="number" name="" id="" min={min} max={max} value={value} onChange={(event) => {
        setter(Number(event.target.value))
      }} />

    </div>
  );
}