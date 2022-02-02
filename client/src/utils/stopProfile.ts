// Api
import initPlanche from "../api/initPlanche";

// Types
import { IProfile } from "../types/Infos";

export const stopProfile = (
  setTimeSpend: (value: React.SetStateAction<number>) => void,
  setRunningProfile: (arg1: IProfile | null) => void
) => {
  console.log("IT SHOULD STOP !!");
  setTimeSpend(0);
  setRunningProfile({
    label: "init",
    duration: 23000,
  });
  initPlanche();
};
