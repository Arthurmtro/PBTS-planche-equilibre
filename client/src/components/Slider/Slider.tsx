import { CSSProperties } from "react";
import styles from "./Slider.module.css";



export default function Slider() {
  return (
  <div>
    <label>Pourcentage</label>
    <input type="range" id="Pourcentage" name="Pourcentage"min="0" max="100"/>

  </div>
  );
}
