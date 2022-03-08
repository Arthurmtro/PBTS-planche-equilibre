import { createContext, useContext, useState, useMemo, useEffect, ReactNode, SetStateAction, Dispatch } from "react"

// Types
import { IProfile } from "../types/Infos"

type cylinderInfosType = {
	runningProfile: IProfile | null
	setRunningProfile: (arg1: IProfile | null) => void
	timeSpend: number
	setTimeSpend: Dispatch<SetStateAction<number>>
	gyroValues: gyroType
	setGyroValues: Dispatch<SetStateAction<gyroType>>
}

type gyroType = {
	gyroX: number
	gyroY: number
}

const RunningProfile = createContext<cylinderInfosType>(undefined!)

export default function RunningProfileProvider({ children }: { children: ReactNode }) {
	const [runningProfile, setRunningProfile] = useState<IProfile | null>(null)
	const [timeSpend, setTimeSpend] = useState<number>(0)
	const [gyroValues, setGyroValues] = useState<gyroType>({
		gyroX: 0,
		gyroY: 0,
	})
	const value = useMemo(
		() => ({ runningProfile, setRunningProfile, timeSpend, setTimeSpend, gyroValues, setGyroValues }),
		[runningProfile, timeSpend, gyroValues]
	)

	useEffect(() => {
		if (!runningProfile) return
		if (runningProfile?.label === "init") return
		if (timeSpend < runningProfile.duration) return

		setTimeSpend(0)
		setRunningProfile({
			label: "init",
			duration: 23000,
		})
		setGyroValues({
			gyroX: 0,
			gyroY: 0,
		})
	}, [runningProfile, timeSpend])

	return <RunningProfile.Provider value={value}>{children}</RunningProfile.Provider>
}

export const useRunningProfile = () => useContext(RunningProfile)
