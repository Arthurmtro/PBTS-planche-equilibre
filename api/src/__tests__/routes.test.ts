import request from "supertest"
import { createServer, Server } from "http"

let server: Server

import app from "../app"

beforeEach(() => {
	server = createServer(app)
})

afterEach(() => {
	server.close()
})

describe("API TESTS: ", () => {
	describe("Fetch Server Status", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/fetch-status")

			if (response) {
				return expect(response.statusCode).toBe(200)
			}
		})
	})

	describe("Init cylinder", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/init")

			if (response) {
				return expect(response.statusCode).toBe(200)
			}
		})
	})

	describe("Create Profile", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server)
				.post("/create-profile")
				.send({
					label: "jest test of the dead",
					actions: [
						{ cylinderId: 0, commands: [{ action: "stop", time: 8975, speed: 1, opening: 1 }] },
						{ cylinderId: 1, commands: [] },
						{ cylinderId: 2, commands: [] },
					],
				})

			if (response) {
				return expect(response.statusCode).toBe(200)
			}
		})
	})

	// Test create a profile with error to handle de problem
	describe("Create Profile with error", () => {
		test("Should respond with a 400 status code because their is no actions", async () => {
			const response = await request(server).post("/create-profile").send({
				label: "jest test of the dead",
			})

			if (response) {
				return expect(response.statusCode).toBe(400)
			}
		})
	})

	// Test deletion of the previousely created profile
	describe("Delete Profile", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/delete-profile?fileName=jest_test_of_the_dead")

			if (response) {
				return expect(response.statusCode).toBe(200)
			}
		})
	})
})
