import request from "supertest"
import { createServer, Server } from "http"

let server: Server

import app from "../app"

beforeEach(async () => {
	server = await createServer(app)
})

afterEach(async () => {
	await server.close()
})

describe("GET /fetch-status", () => {
	describe("Fetch Server Status", () => {
		test("Should respond with a 200 status code", async () => {
			const response = await request(server).get("/fetch-status")

			return expect(response.statusCode).toBe(200)
		})
	})

	// describe("Init cylinder", () => {
	// 	test("Should respond with a 200 status code", async () => {
	// 		const response = await request(server).get("/init")

	// 		expect(response.statusCode).toBe(200)
	// 	})
	// })

	// describe("Create Profile", () => {
	// 	test("Should respond with a 200 status code", async () => {
	// 		const response = await request(server)
	// 			.post("/create-profile")
	// 			.send({
	// 				label: "jest test of the dead",
	// 				actions: [
	// 					{ cylinderId: 0, commands: [Array] },
	// 					{ cylinderId: 1, commands: [] },
	// 					{ cylinderId: 2, commands: [] },
	// 				],
	// 			})

	// 		expect(response.statusCode).toBe(200)
	// 	})
	// })

	// describe("Delete Profile", () => {
	// 	test("Should respond with a 200 status code", async () => {
	// 		const response = await request(server).get("/create-profile?fileName=jest_test_of_the_dead").send()

	// 		expect(response.statusCode).toBe(200)
	// 	})
	// })
})
