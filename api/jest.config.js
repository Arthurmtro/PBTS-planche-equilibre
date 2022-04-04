// import type { Config } from "@jest/types"

// Sync object
// const config: Config.InitialOptions = {
const config = {
	verbose: false,
	preset: "ts-jest",
	testEnvironment: "node",
	modulePathIgnorePatterns: ["<rootDir>/src"],
}

// eslint-disable-next-line no-undef
module.exports = config
