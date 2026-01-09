import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.use(cors({
	origin: process.env.CORS_ORIGIN,
	Credential: true
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

export {app};