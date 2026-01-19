import mongoose from "mongoose";

const attendanceRecordSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	sessionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "AttendanceSession"
	},
	status: {
		type: String,
		enum: ["PRESENT", "ABSENT", "LATE"],
		required: true
	},
	leaveReason: {
		type: String,
		enum: ["SICK", "PERSONAL", "OFFICIAL", "UNAPPROVED"],
		default: null
	},
	checkIn: {
		type: Date
	},
	checkOut: {
		type: Date
	}
},
{
	timestamps: true
});

export const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);