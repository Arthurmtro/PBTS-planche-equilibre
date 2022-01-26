import { api_url } from "../config";

export default async function initPlanche() {
  const response = await fetch(`${api_url}/init`);
  if (!response.ok) {
    throw new Error("Problem init");
  }

  return console.log("res", response.json());
}
