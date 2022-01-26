import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

export default function Box() {
  const { runningProfile } = useRunningProfile();

  return (
    <div className={styles.background}>
      {runningProfile && (
        <>
          <h4>timer: {runningProfile.duration}</h4>
          <progress
            id="file"
            max={runningProfile.duration}
            value="30"
            className={styles.progress}
          />
        </>
      )}
    </div>
  );
}
