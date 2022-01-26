import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";
import { useEffect, useState } from "react";

export default function Box() {
  const { runningProfile } = useRunningProfile();
  const [ecouledTime, setEcouledTime] = useState(0);

  useEffect(() => {
    if (!runningProfile) return;

    const interval = setInterval(function () {
      setEcouledTime((prev) => (prev += 100));
    }, 100);

    if (ecouledTime >= runningProfile.duration) {
      clearInterval(interval);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningProfile]);

  useEffect(() => {
    console.log("ecouledTime :>> ", ecouledTime);
    console.log("runningProfile.duration :>> ", runningProfile?.duration);
  }, [ecouledTime]);

  return (
    <div className={styles.background}>
      {runningProfile && (
        <>
          <h4>timer: {runningProfile.duration}</h4>
          <progress
            id="file"
            max={runningProfile.duration}
            value={ecouledTime}
            className={styles.progress}
          />
        </>
      )}
    </div>
  );
}
