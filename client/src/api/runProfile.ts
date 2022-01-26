import { api_url } from "../config";

export default async function runProfile(profileId: string) {
  const response = await fetch(`${api_url}/run-profile?profileId=${profileId}`);
  if (!response.ok) {
    throw new Error("Problem running profiles");
  }

  return console.log("res", response.json());
}
