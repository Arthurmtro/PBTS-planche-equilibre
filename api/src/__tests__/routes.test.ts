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

describe("GET /fetch-status", () => {
	describe("Fetch Server Status", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/fetch-status").end()

			return expect(response.statusCode).toBe(200)
		})
	})

	describe("Init cylinder", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/init").end()

			expect(response.statusCode).toBe(200)
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
				.end()

			expect(response.statusCode).toBe(200)
		})
	})

	describe("Delete Profile", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/create-profile?fileName=jest_test_of_the_dead").end()

			expect(response.statusCode).toBe(200)
		})
	})
})
