import  { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { createAttendanceSession, getAttendanceBySession, getMyAttendance, getTodayAttendanceSession, getUserAttendance, markAttendance, updateAttendance } from "../controllers/attendance.controller.js";

const attendanceRoute = Router();

attendanceRoute.route("/create-attendance").post(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), createAttendanceSession);
attendanceRoute.route("/mark-attendance").post(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), markAttendance);
attendanceRoute.route("/get-todayattendance").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getTodayAttendanceSession);
attendanceRoute.route("/today").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getTodayAttendanceSession);
attendanceRoute.route("/get-session/:sessionId").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getAttendanceBySession);
attendanceRoute.route("/get-userattendance/:userId").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getUserAttendance);
attendanceRoute.route("/user/me").get(verifyJWT, getMyAttendance);
attendanceRoute.route("/user/:userId").get(verifyJWT, getUserAttendance);
attendanceRoute.route("/update-attendance/:recordId").patch(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), updateAttendance);

export default attendanceRoute;