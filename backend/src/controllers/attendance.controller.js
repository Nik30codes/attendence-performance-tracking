import { AttendanceSession } from "../models/attendanceSession.model.js";
import { AttendanceRecord } from "../models/attendanceRecord.model.js";
import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAttendanceSession = asyncHandler(async (req, res) => {
	const { date, startTime, endTime, type } = req.body;
	let { departmentId } = req.body;

	if (
		!date?.day || !date?.month || !date?.year ||
		startTime?.hour === undefined || startTime?.minute === undefined ||
		endTime?.hour === undefined || endTime?.minute === undefined ||
		!type
	) {
		throw new ApiError(400, "Invalid or missing date/time fields");
	}

	const { day, month, year } = date;

	const sessionDate = new Date(year, month - 1, day);
	const start = new Date(year, month - 1, day, startTime.hour, startTime.minute);
	const end = new Date(year, month - 1, day, endTime.hour, endTime.minute);

	if (
		isNaN(sessionDate.getTime()) ||
		isNaN(start.getTime()) ||
		isNaN(end.getTime())
	) {
		throw new ApiError(400, "Invalid date or time values");
	}

	if (end <= start) {
		throw new ApiError(400, "End time must be after start time");
	}

	if (req.user.role === "MANAGER") {
		departmentId = req.user.department;
		if (!departmentId) throw new ApiError(400, "User is not assigned to any department");
	}
	if (req.user.role === "ADMIN") {
		const department = await Department.findOne({ name: departmentId });
		if (!department) throw new ApiError(400, "Department is required!");
		departmentId = department._id;
	}

	const existingSameTypeSession = await AttendanceSession.findOne({
		departmentId,
		date: sessionDate,
		type
	});

	if (existingSameTypeSession) {
		throw new ApiError(
			409,
			`A ${type} session already exists for this department on this date`
		);
	}

	const overlappingSession = await AttendanceSession.findOne({
		departmentId,
		date: sessionDate,
		startTime: { $lt: end },
		endTime: { $gt: start },
	});

	if (overlappingSession) {
		throw new ApiError(
			409,
			"Attendance session already exists for this department and time range"
		);
	}

	const session = await AttendanceSession.create({
		date: sessionDate,
		startTime: start,
		endTime: end,
		type: type,
		createdBy: req.user._id,
		departmentId
	});

	return res
		.status(201)
		.json(new ApiResponse(201, session, "Attendance session created"));
});


const markAttendance = asyncHandler(async (req, res) => {
	const {
		userId,
		sessionId,
		status,
		leaveReason,
		checkIn,
		checkOut
	} = req.body;

	if (!userId || !sessionId || !status) {
		throw new ApiError(400, "userId, sessionId and status are required");
	}

	const session = await AttendanceSession.findById(sessionId);
	if (!session) {
		throw new ApiError(404, "Attendance session not found");
	}

	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	if (!user.department?.equals(session.departmentId)) {
		throw new ApiError(
			403,
			"User does not belong to this attendance session"
		);
	}

	const existing = await AttendanceRecord.findOne({ userId, sessionId });
	if (existing) {
		throw new ApiError(409, "Attendance already marked for this session");
	}

	let checkInTime = null;
	let checkOutTime = null;

	if (checkIn) {
		checkInTime = new Date(
			session.date.getFullYear(),
			session.date.getMonth(),
			session.date.getDate(),
			checkIn.hour,
			checkIn.minute
		);
	}

	if (checkOut) {
		checkOutTime = new Date(
			session.date.getFullYear(),
			session.date.getMonth(),
			session.date.getDate(),
			checkOut.hour,
			checkOut.minute
		);
	}

	if (
		(checkInTime && isNaN(checkInTime.getTime())) ||
		(checkOutTime && isNaN(checkOutTime.getTime()))
	) {
		throw new ApiError(400, "Invalid check-in or check-out time");
	}

	if (checkInTime && checkInTime < session.startTime) {
		throw new ApiError(400, "Check-in cannot be before session start");
	}

	if (checkOutTime && checkOutTime > session.endTime) {
		throw new ApiError(400, "Check-out cannot be after session end");
	}

	if (checkInTime && checkOutTime && checkOutTime <= checkInTime) {
		throw new ApiError(400, "Check-out must be after check-in");
	}

	const record = await AttendanceRecord.create({
		userId,
		sessionId,
		status,
		leaveReason: status === "ABSENT" ? leaveReason : null,
		checkIn: checkInTime,
		checkOut: checkOutTime
	});

	return res
		.status(201)
		.json(new ApiResponse(201, record, "Attendance recorded"));
});


const getTodayAttendanceSession = asyncHandler(async (req, res) => {
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0);

	const endOfToday = new Date();
	endOfToday.setHours(23, 59, 59, 999);

	const query = {
		date: { $gte: startOfToday, $lte: endOfToday }
	};

	if (req.user.role === "MANAGER") {
		if (!req.user.department) {
			throw new ApiError(403, "User is not assigned to any department");
		}
		query.departmentId = req.user.department;
	}

	const sessions = await AttendanceSession.find(query)
		.sort({ startTime: 1 });

	if (!sessions.length) {
		throw new ApiError(404, "No attendance sessions found for today");
	}

	return res.status(200).json(
		new ApiResponse(200, sessions, "Today's attendance sessions fetched")
	);
});

const getAttendanceBySession = async (req, res) => {
	const { sessionId } = req.params;

	const records = await AttendanceRecord.find({ sessionId })
		.populate("userId", "name email role")
		.populate("sessionId");

	return res
		.status(200)
		.json(new ApiResponse(200, records, "Attendance fetched"));
};

const getUserAttendance = async (req, res) => {
	const { userId } = req.params;

	const records = await AttendanceRecord.find({ userId })
		.populate("sessionId")
		.sort({ createdAt: -1 });

	return res
		.status(200)
		.json(new ApiResponse(200, records, "User attendance history"));
};

const getMyAttendance = asyncHandler(async (req, res) => {
	const records = await AttendanceRecord.find({ userId: req.user._id })
		.populate("sessionId")
		.sort({ createdAt: -1 });

	return res
		.status(200)
		.json(new ApiResponse(200, records, "My attendance history"));
});

const updateAttendance = asyncHandler(async (req, res) => {
	const { recordId } = req.params;
	const updates = req.body;

	const allowedUpdates = ["status", "leaveReason", "checkIn", "checkOut"];
	if(!updates) throw new ApiError(400, "empty update fields");
	const updateKeys = Object.keys(updates);

	if (!updateKeys.every(key => allowedUpdates.includes(key))) {
		throw new ApiError(400, "Invalid fields in update request");
	}

	const record = await AttendanceRecord.findById(recordId)
		.populate({
			path: "userId",
			select: "-password -refreshToken"
		})
		.populate("sessionId");

	if (!record) {
		throw new ApiError(404, "Attendance record not found");
	}

	if (
		req.user.role === "MANAGER" &&
		!record.userId.department.equals(req.user.department)
	) {
		throw new ApiError(403, "Cannot update attendance of another department");
	}

	updateKeys.forEach(key => {
		record[key] = updates[key];
	});

	await record.save();

	return res
		.status(200)
		.json(new ApiResponse(200, record, "Attendance updated"));
});


export {
	createAttendanceSession,
	markAttendance,
	getTodayAttendanceSession,
	getAttendanceBySession,
	getUserAttendance,
	getMyAttendance,
	updateAttendance
}