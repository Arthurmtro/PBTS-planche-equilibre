import { toast } from "react-toastify"
import { api_url } from "../config"

export default async function runProfileWithId(profileId: string) {
	const response = await fetch(`${api_url}/run-profile?profileId=${profileId}`)
	if (!response.ok) {
		toast.error("Problem running profile !")
		console.log("error >> ", response)
		return
	}
	response.json().then((json) => toast.success(json.message))
	return response.statusText
}
