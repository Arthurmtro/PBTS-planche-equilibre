// Api
import initPlanche from "../api/initPlanche";
import runProfileWithId from "../api/runProfile";

// Types
import { IProfile } from "../types/Infos";
import { stopProfile } from "./stopProfile";

export const runProfile = async (
  profile: IProfile,
  setTimeSpend: (value: React.SetStateAction<number>) => void,
  setRunningProfile: (arg1: IProfile | null) => void
) => {
  try {
    if (!profile.fileName) throw new Error("Le profile n'est pas correct");

    setTimeSpend(0);
    setRunningProfile(profile);
    const profileRes = await runProfileWithId(profile.fileName);

    if (profileRes) {
      stopProfile(setTimeSpend, setRunningProfile);
    }
  } catch (e) {}
};
