import { createContext, useContext, useState } from "react";

// Types
import { Iprofile } from "../types/Infos";

type cylinderInfosType = {
  runningProfile: Iprofile | null;
  setRunningProfile: (arg1: Iprofile | null) => void;
};

const RunningProfile = createContext<cylinderInfosType>(undefined!);

export default function RunningProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [runningProfile, setRunningProfile] = useState<Iprofile | null>(null);

  return (
    <RunningProfile.Provider value={{ runningProfile, setRunningProfile }}>
      {children}
    </RunningProfile.Provider>
  );
}

export const useRunningProfile = () => useContext(RunningProfile);
