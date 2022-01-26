import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

export default function Box() {
  const { runningProfile } = useRunningProfile();

  const startTimer = () => {
    const start = Date.now();

    // After a certain amount of time, run this to see how much time passed.
    const milliseconds = Date.now() - start;

    console.log("Seconds passed = " + milliseconds / 1000);
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
