import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({path: "./.env"});

const app = express();

app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true
}));

app.use(express.json({
	limit:"64kb"
}))

app.use(express.urlencoded({
	limit: "16Kb",
	extended: true
}))

app.use(cookieparser());

import userRouter from "./routes/user.route.js";
import deptRouter from "./routes/department.route.js";
import attendanceRoute from "./routes/attendance.route.js";
import performanceRouter from "./routes/performance.route.js";

app.use("/api/users", userRouter);
app.use("/api/dept", deptRouter);
app.use("/api/attendance", attendanceRoute);
app.use("/api/performance", performanceRouter);

// Global error handler
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Something went wrong";
	return res.status(statusCode).json({
		statusCode,
		message,
		success: false,
		errors: err.errors || []
	});
});

export {app};