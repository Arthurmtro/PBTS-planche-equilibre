import { arch } from "os"

export const runningOnRasberry = arch() === "arm" || arch() === "arm64"
