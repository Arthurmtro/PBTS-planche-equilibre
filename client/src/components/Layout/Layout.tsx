import styles from "./Layout.module.css";
import { useEffect } from "react";

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
  const { runningProfile, setRunningProfile, timeSpend, setTimeSpend } =
    useRunningProfile();

  useEffect(() => {
    if (!runningProfile) return;

    interval = setInterval(() => {
      setTimeSpend((prev) => prev + 100);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningProfile]);

  useEffect(() => {
    // if (timeSpend === 0) return;
    if (runningProfile === null) {
      return clearInterval(interval);
    }

    console.log("runningProfile :>> ", runningProfile);
    console.log("timeSpend :>> ", timeSpend);

    if (timeSpend >= runningProfile.duration) {
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
