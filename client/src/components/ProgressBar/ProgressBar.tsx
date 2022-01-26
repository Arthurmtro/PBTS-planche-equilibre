import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

export default function Box() {
  const { runningProfile } = useRunningProfile();

  return (
    <div className={styles.background}>
      timer: {runningProfile?.duration}
      <progress id="file" max="100" value="30" className={styles.progress} />
    </div>
  );
}
