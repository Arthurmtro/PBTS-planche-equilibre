import { api_url } from "../config";

export default async function initPlanche() {
  const response = await fetch(`${api_url}/init`);
  if (!response.ok) {
    return console.log("Problem init ", response);
  }

  return console.log("res", response);
}
