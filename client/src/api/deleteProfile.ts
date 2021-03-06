import { api_url } from "../config"

export default async function deleteProfile(profileName: string) {
	try {
		if (!profileName) throw new Error("Missing property: profileName")

		const response = await fetch(`${api_url}/delete-profile?fileName=${profileName}`, {
			method: "GET",
		})

		if (!response.ok) {
			throw new Error("Problem fetching cylinders infos")
		}

		// await response.json()

		return true
	} catch (error) {
		console.log(error)
		return false
	}
}
