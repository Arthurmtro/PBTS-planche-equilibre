/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import cookieParser from "cookie-parser"
import createError from "http-errors"
import express from "express"
import logger from "morgan"
import path from "path"
import cors from "cors"

import routes from "./routes"

const app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", routes)

app.use((req, res, next) => {
	next(createError(404))
})

// @ts-ignore
app.use((err, req, res, _next) => {
	// set locals, only providing error in developmentd
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render("error")
})

export default app
