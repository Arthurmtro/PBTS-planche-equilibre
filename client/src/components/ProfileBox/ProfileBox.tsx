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
  const { runningProfile, setRunningProfile } = useRunningProfile();

  console.log("runningProfile :>> ", runningProfile);

  const setProfile = () => {
    setRunningProfile(profile);
    runProfile(profile.fileName);
  };

  const stopProfile = () => {
    setRunningProfile(null);
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
            <Button color="danger" onClick={() => stopProfile()}>
              Stop
            </Button>
          ) : (
            <Button color="secondary" onClick={() => setProfile()}>
              lancer
            </Button>
          )}
        </div>
      </div>
    </Box>
  );
}
