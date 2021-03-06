import { api_url } from "../config"

export default async function fetchAllProfiles() {
	const response = await fetch(`${api_url}/fetch-profiles`)
	if (!response.ok) {
		throw new Error("Problem fetching profiles infos")
	}

	const profiles = await response.json()
	return profiles
}
