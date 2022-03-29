import type { Config } from "@jest/types"
import { defaults } from "jest-config"

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx", "coffee"],
}
export default config
