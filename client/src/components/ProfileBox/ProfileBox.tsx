import styles from "./ProfileBox.module.css";
import Box from "../Box";
import Button from "../Button";
import Badge from "../Badge";

import { Iprofile } from "../../types/Infos";
import runProfile from "../../api/runProfile";
import { useRunningProfile } from "../../contexts/runningProvider";

type ProfileBoxParams = {
  profile: Iprofile;
};

export default function ProfileBox({ profile }: ProfileBoxParams) {
  const { runningProfile, setRunningProfile } = useRunningProfile();

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
            <Button color="danger" onClick={() => setRunningProfile(null)}>
              Stop
            </Button>
          ) : (
            <Button
              color="secondary"
              onClick={() => runProfile(profile.fileName)}
            >
              lancer
            </Button>
          )}
        </div>
      </div>
    </Box>
  );
}
