import styles from "./StatusBar.module.css";
import { CSSProperties } from "react";

// Api
import initPlanche from "../../api/initPlanche";

// Contexts
import { useCylindersData } from "../../contexts/cylindersProdiver";
import { useRunningProfile } from "../../contexts/runningProvider";

// Components
import Button from "../Button";
import Badge from "../Badge";

export default function StatusBar() {
  const { status, error } = useCylindersData();
  const { runningProfile, setRunningProfile } = useRunningProfile();

  if (error) {
    console.log("error :>> ", error?.message);
  }

  const stopProfile = () => {
    setRunningProfile({
      label: "init",
      duration: 20000,
    });
    initPlanche();
  };

  return (
    <section className={styles["status-bar"]}>
      <div className={styles["playing-status"]}>
        {runningProfile !== null && runningProfile.label !== "init" ? (
          <>
            <Button disabled color="white" thin>
              En cours actuellement:{" "}
              <span className={styles["profile-title"]}>
                {runningProfile.label.toUpperCase()}
              </span>
            </Button>
            <Button color="danger" onClick={() => stopProfile()}>
              STOP
            </Button>
          </>
        ) : runningProfile !== null && runningProfile.label === "init" ? (
          <>
            <Button disabled color="white" thin>
              Initialising{" "}
              <span className={styles["profile-title"]}>planche</span>
            </Button>
          </>
        ) : (
          <>
            Aucun profil en cours:
            <Button color="primary" onClick={() => initPlanche()}>
              INIT PLANCHE
            </Button>
          </>
        )}
      </div>
      <div>
        Status infos :{" "}
        <span
          className={styles["status-text"]}
          style={
            {
              "--status-color":
                status === "success"
                  ? "#1FB112"
                  : status === "error"
                  ? "#DF0D0D"
                  : "var(--color-primary)",
            } as CSSProperties
          }
        >
          {status === "success" ? "Connecté" : status}
        </span>
        <Badge
          disabled
          color={
            status === "success"
              ? "success"
              : status === "loading"
              ? "primary"
              : "danger"
          }
        />
      </div>
    </section>
  );
}
