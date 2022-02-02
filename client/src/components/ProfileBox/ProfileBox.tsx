// types
import { IProfile } from "../../types/Infos";

// Contexts
import { useRunningProfile } from "../../contexts/runningProvider";

// Components
import styles from "./ProfileBox.module.css";
import Button from "../Button";
import Badge from "../Badge";
import Box from "../Box";
import { runProfile } from "../../utils/runProfile";
import { stopProfile } from "../../utils/stopProfile";

type ProfileBoxParams = {
  profile: IProfile;
};

export default function ProfileBox({ profile }: ProfileBoxParams) {
  const { runningProfile, setRunningProfile, setTimeSpend } =
    useRunningProfile();

  return (
    <Box size="fill">
      <div className={styles.content}>
        <div>
          <h1>{profile.label}</h1>
          <h3>{profile.category}</h3>
        </div>
        <div className={styles.actions}>
          <Badge
            disabled
            color={
              runningProfile && runningProfile.fileName === profile.fileName
                ? "success"
                : "danger"
            }
          />
          {runningProfile && runningProfile.fileName === profile.fileName ? (
            <Button
              disabled={runningProfile.label === "init"}
              color="danger"
              onClick={() => stopProfile(setTimeSpend, setRunningProfile)}
            >
              Stop
            </Button>
          ) : (
            <Button
              disabled={runningProfile !== null}
              color="secondary"
              onClick={() =>
                runProfile(profile, setTimeSpend, setRunningProfile)
              }
            >
              lancer
            </Button>
          )}
        </div>
      </div>
    </Box>
  );
}
