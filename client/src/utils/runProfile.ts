// Api
import runProfileWithId from "../api/runProfile";

// Types
import { IProfile } from "../types/Infos";

export const runProfile = async (
  profile: IProfile,
  setTimeSpend: (value: React.SetStateAction<number>) => void,
  setRunningProfile: (arg1: IProfile | null) => void
) => {
  try {
    if (!profile.fileName) throw new Error("Le profile n'est pas correct");
    setTimeSpend(0);
    setRunningProfile(profile);
    runProfileWithId(profile.fileName);
  } catch (error) {
    console.log("error running profile => ", error);
  }
};
