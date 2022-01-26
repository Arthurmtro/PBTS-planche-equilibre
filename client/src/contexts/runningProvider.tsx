import { createContext, useContext, useState, useMemo } from "react";

// Types
import { Iprofile } from "../types/Infos";

type cylinderInfosType = {
  runningProfile: Iprofile | null;
  setRunningProfile: (arg1: Iprofile | null) => void;
  timeSpend: number;
  setTimeSpend: (arg1: number) => void;
};

const RunningProfile = createContext<cylinderInfosType>(undefined!);

export default function RunningProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [runningProfile, setRunningProfile] = useState<Iprofile | null>(null);
  const [timeSpend, setTimeSpend] = useState<number>(0);
  const value = useMemo(
    () => ({ runningProfile, setRunningProfile, timeSpend, setTimeSpend }),
    [runningProfile, timeSpend]
  );

  return (
    <RunningProfile.Provider value={value}>{children}</RunningProfile.Provider>
  );
}

export const useRunningProfile = () => useContext(RunningProfile);
