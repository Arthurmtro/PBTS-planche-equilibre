import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";
import { useEffect, useState } from "react";

let interval: NodeJS.Timer;

export default function Box() {
  const { runningProfile } = useRunningProfile();
  const [ecouledTime, setEcouledTime] = useState(0);

  useEffect(() => {
    if (!runningProfile) return;

    interval = setInterval(() => {
      setEcouledTime((prev) => (prev += 100));
    }, 100);

    if (ecouledTime >= runningProfile.duration) {
      console.log("sheesh");
      clearInterval(interval);
      setEcouledTime(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningProfile]);

  useEffect(() => {
    if (!runningProfile) return;

    console.log("ecouledTime :>> ", ecouledTime);
    console.log("runningProfile.duration :>> ", runningProfile?.duration);

    if (ecouledTime >= runningProfile?.duration) {
      console.log("sheesh");
      clearInterval(interval);
      setEcouledTime(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
