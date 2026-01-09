import { PerformanceMetric } from "../models/performanceMetric.model.js";
import { PerformanceRecord } from "../models/performanceRecord.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPerformanceMetric = asyncHandler(async (req, res) => {
	const { name, description, maxScore } = req.body;

	if (!name) {
		throw new ApiError(400, "Metric name is required");
	}

	const existing = await PerformanceMetric.findOne({ name });
	if (existing) {
		throw new ApiError(409, "Performance metric already exists");
	}

	const metric = await PerformanceMetric.create({
		name,
		description,
		maxScore
	});

	return res
		.status(201)
		.json(new ApiResponse(201, metric, "Performance metric created"));
});

const getAllPerformanceMetrics = asyncHandler(async (req, res) => {
	const metrics = await PerformanceMetric.find()
		.select("name description maxScore createdAt")
		.sort({ createdAt: -1 });

	return res.status(200).json(
		new ApiResponse(200, metrics, "Performance metrics fetched")
	);
});


const recordPerformance = asyncHandler(async (req, res) => {
	const { userId, metricId, score, recordedDate } = req.body;

	if (!userId || !metricId || recordedDate === undefined) {
		throw new ApiError(400, "userId, metricId and recordedDate are required");
	}

	const user = await User.findById(userId);
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const metric = await PerformanceMetric.findById(metricId);
	if (!metric) {
		throw new ApiError(404, "Performance metric not found");
	}

	if (
		req.user.role === "MANAGER" &&
		!user.department.equals(req.user.department)
	) {
		throw new ApiError(403, "Cannot record performance for another department");
	}

	const date = new Date(recordedDate);
	date.setHours(0, 0, 0, 0);

	const existing = await PerformanceRecord.findOne({
		userId,
		metricId,
		recordedDate: date
	});

	if (existing) {
		throw new ApiError(
			409,
			"Performance already recorded for this metric on this date"
		);
	}

	if (metric.maxScore !== undefined && score > metric.maxScore) {
		throw new ApiError(400, "Score exceeds maximum allowed");
	}

	const record = await PerformanceRecord.create({
		userId,
		metricId,
		evaluatorId: req.user._id,
		score,
		recordedDate: date
	});

	return res
		.status(201)
		.json(new ApiResponse(201, record, "Performance recorded"));
});

const getPerformanceByUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	const records = await PerformanceRecord.find({ userId })
		.populate("metricId", "name maxScore")
		.populate({
			path: "evaluatorId",
			select: "name role"
		})
		.sort({ recordedDate: -1 });

	if (!records.length) {
		throw new ApiError(404, "No performance records found");
	}

	return res
		.status(200)
		.json(new ApiResponse(200, records, "Performance records fetched"));
});

const getAllPerformanceRecord = asyncHandler(async(req, res) => {
	const records = await PerformanceRecord.find()
	.populate({
		path: "userId",
		select: "-password -refreshToken"
	})
	.populate({
		path: "evaluatorId",
		select: "-password -refreshToken"
	});
	if(!records) throw new ApiError(404, "No records found");

	return res.status(200).json(
		new ApiResponse(200, records, "Records successfully fetched")
	);
})

const updatePerformanceRecord = asyncHandler(async (req, res) => {
	const { recordId } = req.params;
	const { score } = req.body;

	if (score === undefined || !score) {
		throw new ApiError(400, "Score is required for update");
	}

	const record = await PerformanceRecord.findById(recordId)
		.populate({
			path: "userId",
			select: "-password -refreshToken"
		})
		.populate("metricId");

	if (!record) {
		throw new ApiError(404, "Performance record not found");
	}

	if (
		req.user.role === "MANAGER" &&
		!record.userId.department.equals(req.user.department)
	) {
		throw new ApiError(403, "Cannot update performance of another department");
	}

	if (
		record.metricId.maxScore !== undefined &&
		score > record.metricId.maxScore
	) {
		throw new ApiError(400, "Score exceeds maximum allowed");
	}

	record.score = score;
	record.evaluatorId = req.user._id;

	await record.save();

	return res
		.status(200)
		.json(new ApiResponse(200, record, "Performance updated"));
});


export {
	createPerformanceMetric,
	recordPerformance,
	getPerformanceByUser,
	getAllPerformanceRecord,
	updatePerformanceRecord,
	getAllPerformanceMetrics
}