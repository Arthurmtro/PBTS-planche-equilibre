export const base_url = (process.env.RUNNING_MODE = "dev"
  ? `http://localhost:8080`
  : `http://${process.env.API_URL}:8080`);
export const api_url = `${base_url}/api`;
