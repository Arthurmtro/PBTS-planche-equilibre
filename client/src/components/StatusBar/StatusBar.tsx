import styles from "./StatusBar.module.css";

// Contexts
import { useCylindersData } from "../../contexts/cylindersProdiver";

// Components
import Button from "../Button";
import { CSSProperties } from "react";
import Badge from "../Badge";

export default function StatusBar() {
  const { status, error } = useCylindersData();
  const isPlayingProfile = true;

  console.log("error :>> ", error?.message);

  return (
    <section className={styles["status-bar"]}>
      {isPlayingProfile ? (
        <div className={styles["playing-status"]}>
          <Button disabled color="white" thin>
            En cours actuellement:{" "}
            <span className={styles["profile-title"]}>PROFILE NAME</span>
          </Button>
          <Button color="danger">STOP</Button>
        </div>
      ) : (
        <span />
      )}
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
          <div><Badge disabled color="success" /></div>
          
      </div>
    </section>
  );
}
