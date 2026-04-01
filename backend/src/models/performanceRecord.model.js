import mongoose from "mongoose";

const performanceRecordSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	metricId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "PerformanceMetric",
		required: true
	},
	evaluatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	score: {
		type: Number
	},
	recordedDate: {
		type: Date,
		required: true
	}
},
{
	timestamps: true
});

export const PerformanceRecord = mongoose.model("PerformanceRecord", performanceRecordSchema);