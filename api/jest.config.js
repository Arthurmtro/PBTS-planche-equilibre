/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line no-undef
const { defaults } = require("jest-config")
// import type { Config } from "@jest/types"

// Sync object
// const config: Config.InitialOptions = {
const config = {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx", "coffee"],
}
export default config
