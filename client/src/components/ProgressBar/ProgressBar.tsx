import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

export default function Box() {
  const { runningProfile, timeSpend } = useRunningProfile();

  return (
    <div className={styles.background}>
      {runningProfile ? (
        <>
          <h4>timer: </h4>
          <p>
            {timeSpend / 1000} / {runningProfile.duration / 1000} s
          </p>
          <progress
            id="file"
            max={runningProfile.duration}
            value={timeSpend}
            className={styles.progress}
          />
        </>
      ) : (
        <h2>Bienvenue, lancez un profil</h2>
      )}
    </div>
  );
}
