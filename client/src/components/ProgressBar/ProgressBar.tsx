import styles from "./ProgressBar.module.css";

interface IBoxParams {}

export default function Box() {
  return (
    <div className={styles.background}>
      <div>Action button</div>
    </div>
  );
}
