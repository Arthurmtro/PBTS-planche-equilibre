import { readdirSync, readFileSync } from "fs"

// Types
import { profileType } from "../types/profileTypes"

export const fetchAllProfiles = () => {
	try {
		const profilesFiles = readdirSync("./config/profiles/")

		if (profilesFiles.length === 0) throw "No profiles detected !"

		const allProfiles: profileType[] = []

		for (let index = 0; index < profilesFiles.length; index++) {
			const file = readFileSync(`./config/profiles/${profilesFiles[index]}`, {
				encoding: "utf8",
				flag: "r",
			})

			const stringifiedFile: profileType = JSON.parse(file)

			Object.assign(stringifiedFile, {
				fileName: profilesFiles[index].slice(0, profilesFiles[index].indexOf(".")),
			})

			allProfiles.push(stringifiedFile)
		}

		return allProfiles

		// res.status(200).send(allProfiles)
	} catch (error) {
		console.log("error =>", error)
		return []
	}
}
