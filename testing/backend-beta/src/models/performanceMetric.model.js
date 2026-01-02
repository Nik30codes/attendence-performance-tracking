import mongoose from "mongoose";

const performanceMetricSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	maxScore: {
		type: Number,
	}
},
{
	timestamps: true
});

export const PerformanceMetric = mongoose.model("PerformanceMetric", performanceMetricSchema);