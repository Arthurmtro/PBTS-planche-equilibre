import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

export default function Box() {
  const { runningProfile } = useRunningProfile();

  const startTimer = () => {
    const date = new Date();
    let time = date.getMilliseconds();

    console.log("time :>> ", time);
  };

  startTimer();

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
