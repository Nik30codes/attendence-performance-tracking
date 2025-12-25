import mongoose from "mongoose";

const attendanceSessionSchema = mongoose.Schema({
	date: {
		type: Date,
		required: true
	},
	startTime: {
		type: Date,
		required: true
	},
	endTime: {
		type: Date,
		required: true
	},
	type: {
		type: String,
		enum: ["WORKING-DAY", "TRAINING", "MEETING"],
		required: true
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
},
{
	timestamps: true
});

export const AttendanceSession = mongoose.model("AttendanceSession", attendanceSessionSchema);
