import styles from "./ProgressBar.module.css";

export default function Box() {
  return (
    <div className={styles.background}>
      <progress id="file" max="100" value="30" className={styles.progress} />
    </div>
  );
}
