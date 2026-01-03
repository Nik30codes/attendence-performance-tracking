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
app.use("/api/users", userRouter);
app.use("/api/dept", deptRouter);

export {app};