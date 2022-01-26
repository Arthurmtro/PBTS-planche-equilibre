import styles from "./ProgressBar.module.css";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";
import { useEffect, useState } from "react";

let interval: NodeJS.Timer;

export default function Box() {
  const { runningProfile, setRunningProfile } = useRunningProfile();
  const [ecouledTime, setEcouledTime] = useState(0);
  const [startedTime, setStartedTime] = useState(0);

  useEffect(() => {
    if (!runningProfile) return;

    const minute = 1000 * 60;
    const d = new Date();
    setStartedTime(Math.round(d.getTime() / minute));

    console.log("StartedTime :>> ", Math.round(d.getTime() / minute));

    interval = setInterval(() => {
      const minute = 1000 * 60;
      const d = new Date();
      setEcouledTime(Math.round(d.getTime() / minute) - startedTime);
      console.log(
        "EcouledTime :>> ",
        Math.round(d.getTime() / minute) - startedTime
      );
    }, 100);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningProfile]);

  useEffect(() => {
    if (!runningProfile) return;
    if (ecouledTime >= runningProfile?.duration) {
      clearInterval(interval);
      setEcouledTime(0);
      setRunningProfile(null);
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
