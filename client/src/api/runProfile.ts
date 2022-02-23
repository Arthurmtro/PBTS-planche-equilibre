import { toast } from "react-toastify"
import { api_url } from "../config"

export default async function runProfileWithId(profileId: string) {
	const response = await fetch(`${api_url}/run-profile?profileId=${profileId}`)
	if (!response.ok) {
		toast.error("Problem running profile !")
		throw new Error("Problem running profile")
	}

	console.log("response.json()", response.json())

	toast(response.json())
	console.log("res", response.statusText)
	return response.statusText
}
