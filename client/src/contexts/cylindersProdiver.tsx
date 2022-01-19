import { createContext, useContext } from "react";
import { useQuery } from "react-query";

// Api
import fetchAllCylinders from "../api/fetchAllCylinders";

// Types
import { ICylinderInfos } from "../types/Infos";

type cylinderInfosType = {
  cylinders: ICylinderInfos[] | undefined;
  status: "idle" | "error" | "loading" | "success";
  error: Error | null;
};

const CylindersData = createContext<cylinderInfosType>(undefined!);

export default function CylindersDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: cylinders,
    status,
    error,
  } = useQuery<ICylinderInfos[], Error>("cylinders", fetchAllCylinders);

  return (
    <CylindersData.Provider value={{ cylinders, status, error }}>
      {children}
    </CylindersData.Provider>
  );
}

export const useCylindersData = () => useContext(CylindersData);
