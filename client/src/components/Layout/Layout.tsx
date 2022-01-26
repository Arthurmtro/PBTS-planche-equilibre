import styles from "./Layout.module.css";
import { useEffect, useState } from "react";

// Context
import { useRunningProfile } from "../../contexts/runningProvider";

// Components
import NavBar from "../NavBar";
import StatusBar from "../StatusBar";

type ParamsType = {
  children: React.ReactNode;
};

var interval: NodeJS.Timer;

export default function Layout({ children }: ParamsType) {
  const [startedTime, setStartedTime] = useState(0);

  const { runningProfile, setRunningProfile, timeSpend, setTimeSpend } =
    useRunningProfile();

  useEffect(() => {
    if (runningProfile === null) {
      return setTimeSpend(0);
    }

    const d = new Date();
    setStartedTime(d.getTime());

    console.log("StartedTime :>> ", d.getTime());

    interval = setInterval(() => {
      const d = new Date();
      setTimeSpend(d.getTime() - startedTime);

      console.log("timeSpend :>> ", d.getTime() - startedTime);
      console.log("runningProfile?.duration :>> ", runningProfile.duration);
    }, 1000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningProfile]);

  useEffect(() => {
    if (timeSpend === 0) return;
    if (runningProfile === null || timeSpend >= runningProfile?.duration) {
      clearInterval(interval);
      setTimeSpend(0);
      setRunningProfile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSpend]);

  return (
    <div className={styles.layout}>
      <NavBar />
      <div className={styles["app-content"]}>
        <StatusBar />
        <div className={styles["page-content"]}>{children}</div>
      </div>
    </div>
  );
}
