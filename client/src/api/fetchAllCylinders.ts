import { api_url } from "../config";

export default async function fetchAllCylinders() {
  const response = await fetch(`${api_url}/fetch-cylinders-infos`);
  if (!response.ok) {
    throw new Error("Problem fetching cylinders infos");
  }
  const cylinders = await response.json();
  return cylinders;
}
