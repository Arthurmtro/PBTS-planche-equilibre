import { api_url } from "../config"

import {ActionsType} from "../types/commands"

type profileType =  {
    label: string;
    actions: ActionsType[];
}

export default async function createProfile(profile: profileType) {
    try {
        if(!profile.label) throw new Error("Missing property: label")
        if(!profile.actions) throw new Error("Missing property: actions")

        const response = await fetch(`${api_url}/create-profile`, {
            body: JSON.stringify(profile),
            method: "POST",
        })

        if (!response.ok) {
            throw new Error("Problem fetching cylinders infos")
        }

        const cylinders = await response.json()

        return cylinders
    } catch (error) {
        console.log(error)
    }
}
