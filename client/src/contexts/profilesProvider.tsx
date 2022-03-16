import { createContext, useContext } from "react"
import { useQuery } from "react-query"

// Api
import fetchAllProfiles from "../api/fetchAllProfiles"

// Types
import { IProfile } from "../types/Infos"

type cylinderInfosType = {
	status: "idle" | "error" | "loading" | "success"
	profiles: IProfile[] | undefined
	error: Error | null
}

const ProfilesData = createContext<cylinderInfosType>(undefined!)

export default function ProfilesDataProvider({ children }: { children: React.ReactNode }) {
	const { data: profiles, status, error } = useQuery<IProfile[], Error>("profiles", fetchAllProfiles)

	return <ProfilesData.Provider value={{ profiles, status, error }}>{children}</ProfilesData.Provider>
}

export const useProfilesData = () => useContext(ProfilesData)
