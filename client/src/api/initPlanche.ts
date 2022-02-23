import { toast } from "react-toastify"
import { api_url } from "../config"

export default async function initPlanche() {
	const response = await fetch(`${api_url}/init`)
	if (!response.ok) {
		// toast.error(`Problem init, ${response}`)
		return console.log("Problem init ", response)
	}

	toast("Planche initialisée !")
	return console.log("res", response)
}
