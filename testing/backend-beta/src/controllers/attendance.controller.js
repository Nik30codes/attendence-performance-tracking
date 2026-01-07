import { AttendanceSession } from "../models/attendanceSession.model.js";
import { AttendanceRecord } from "../models/attendanceRecord.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAttendanceSession = asyncHandler(async (req, res) => {
	const { date, startTime, endTime, type } = req.body;
	if (!date || !startTime || !endTime || !type) {
		throw new ApiError(400, "All fields are required");
	}
	const session = await AttendanceSession.create({
		date,
		startTime,
		endTime,
		type,
		createdBy: req.user._id
	});

	return res
		.status(201)
		.json(new ApiResponse(201, session, "Attendance session created"));

})

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

	const existing = await AttendanceRecord.findOne({ userId, sessionId });

	if (existing) {
		throw new ApiError(409, "Attendance already marked for this session");
	}

	const record = await AttendanceRecord.create({
		userId,
		sessionId,
		status,
		leaveReason: status === "ABSENT" ? leaveReason : null,
		checkIn,
		checkOut
	});

	return res
		.status(201)
		.json(new ApiResponse(201, record, "Attendance recorded"));
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

const updateAttendance = async (req, res) => {
  const { recordId } = req.params;
  const updates = req.body;

  const record = await AttendanceRecord.findByIdAndUpdate(
    recordId,
    updates,
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, "Attendance record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Attendance updated"));
};

export {
	createAttendanceSession,
	markAttendance,	
	getAttendanceBySession,
	getUserAttendance,
	updateAttendance
}