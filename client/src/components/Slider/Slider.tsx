import { useState } from "react";
import styles from "./Slider.module.css";

type SliderType={
  label?: string
  nbverin: Number
  min?: number
  max?: number
}

export default function Slider({label,min=0,max=100}:SliderType) {
const [progressVal, setProgressVal] = useState<number>(0)

  return (
  <div className={styles.slider}>
    <label>{label}</label>
    <input type="range" id={label} name={label} min={min} max={max} step="1" value={progressVal} onChange={(event) => {
      setProgressVal(Number(event.target.value))
    }}/>
    <input type="number" name="" id="" min={min} max={max} value={progressVal} onChange={(event) => {
      setProgressVal(Number(event.target.value))
    }}/>

  </div>
  );
}