import styles from "../styles/Running.module.css";

// Contexts
import { useRunningProfile } from "../contexts/runningProvider";

// Components
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import Box from "../components/Box";

export default function RunningPage() {
  const { runningProfile } = useRunningProfile();

  return (
    <>
      {runningProfile !== null ? (
        <>
          <section className={styles.header}>
            <div className={styles["header-titles"]}>
              <h1>{runningProfile.label}</h1>
              <h5>{runningProfile.category}</h5>
            </div>
            <Button disabled={runningProfile.label === "init"}>
              Edit Profile
            </Button>
          </section>
          <ProgressBar />

          <Box size="fill">
            <h5>Durée : {runningProfile.duration}</h5>
          </Box>
          <div className={styles["infos-contents"]}>
            {runningProfile.actions &&
              runningProfile.actions.map((action) => (
                <div key={action.cylinderId} className={styles.commands}>
                  {action.commands.map((command, idx) => (
                    <Box key={idx}>{command.action}</Box>
                  ))}
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <h1>No profile Running</h1>
        </>
      )}
    </>
  );
}
