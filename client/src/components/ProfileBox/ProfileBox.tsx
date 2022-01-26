// Api
import runProfile from "../../api/runProfile";
import initPlanche from "../../api/initPlanche";

// types
import { Iprofile } from "../../types/Infos";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

// Components
import styles from "./ProfileBox.module.css";
import Button from "../Button";
import Badge from "../Badge";
import Box from "../Box";

type ProfileBoxParams = {
  profile: Iprofile;
};

export default function ProfileBox({ profile }: ProfileBoxParams) {
  const { runningProfile, setRunningProfile, timeSpend } = useRunningProfile();

  const setProfile = () => {
    if (!profile.fileName) return;

    setRunningProfile(profile);
    runProfile(profile.fileName);
  };

  const stopProfile = () => {
    setRunningProfile({
      label: "init",
      duration: 20000,
    });
    initPlanche();
  };

  return (
    <Box>
      <div className={styles.content}>
        <div>
          <h1>{profile.label}</h1>
          <h3>Category</h3>
        </div>
        <div className={styles.actions}>
          <Badge disabled color="danger" />
          {runningProfile && runningProfile.fileName === profile.fileName ? (
            <Button
              disabled={runningProfile.label === "init"}
              color="danger"
              onClick={() => stopProfile()}
            >
              Stop
            </Button>
          ) : (
            <Button
              disabled={timeSpend > 0}
              color="secondary"
              onClick={() => setProfile()}
            >
              lancer
            </Button>
          )}
        </div>
      </div>
    </Box>
  );
}
