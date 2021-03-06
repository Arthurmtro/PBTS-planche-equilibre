import { api_url } from "../config"

import { ActionsType } from "../types/commands"

type profileType = {
	label: string
	actions: ActionsType[]
}

export default async function createProfile(profile: profileType) {
	try {
		if (!profile.label) throw new Error("Missing property: label")
		if (!profile.actions) throw new Error("Missing property: actions")

		const response = await fetch(`${api_url}/create-profile`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(profile),
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
