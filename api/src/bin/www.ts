import { getMpuInfos } from "./../services/Controller"
/* eslint-disable indent */
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { Server, Socket } from "socket.io"
import { createServer } from "http"

import app from "../app"

const port = 8080

app.set("port", port)

const server = createServer(app)

server.listen(port, () => {
	console.log(`SERVER RUNNING ON ${port}`)
})
server.on("error", onError)
server.on("listening", onListening)

function onError(error: { syscall: string; code: string }) {
	if (error.syscall !== "listen") throw error

	const bind = typeof port === "string" ? "Pipe " + port : "Port " + port

	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges")
			process.exit(1)
			break
		case "EADDRINUSE":
			console.error(bind + " is already in use")
			process.exit(1)
			break
		default:
			throw error
	}
}

function onListening() {
	const addr = server.address()
	const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port
	console.log("Listening on " + bind)
}

const io = new Server(server)

let interval: NodeJS.Timer

io.on("connection", (socket) => {
	console.error("New client connected")

	if (interval) {
		clearInterval(interval)
	}
	interval = setInterval(() => getApiAndEmit(socket), 1000)
	socket.on("disconnect", () => {
		console.log("Client disconnected")
		clearInterval(interval)
	})
})

const getApiAndEmit = (socket: Socket<DefaultEventsMap>) => {
	// Emitting a new message. Will be consumed by the client
	socket.emit("mpuInfos", getMpuInfos())

	// console.log(getMpuInfos()) // Debug
}
