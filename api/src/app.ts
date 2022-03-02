/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import cookieParser from "cookie-parser"
import createError from "http-errors"
import { createServer } from "http"
import { Server } from "socket.io"
import express from "express"
import logger from "morgan"
import cors from "cors"

import routes from "./routes"

const app = express()

const server = createServer(app)

const io = new Server(server)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(logger("dev"))
app.use(cors())

app.use("/", routes)

app.use((req, res, next) => {
	next(createError(404))
})

io.on("connection", (socket) => {
	console.log("a user connected")
})

// @ts-ignore
app.use((err, req, res, _next) => {
	// set locals, only providing error in developmentd
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.sendStatus(err.status || 500)
})

export default app
