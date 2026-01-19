import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js";

const generateAccessAndRefreshToken = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		await User.findByIdAndUpdate(
			userId,
			{ refreshToken },
			{ new: true }
		);

		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(500, "Something went wrong while generating Access and Refresh Tokens");
	}
}

const refreshAccessToken = asyncHandler(async (req, res) => {
	const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken
	if (!incomingrefreshToken) {
		throw new ApiError(400, "Unauthorize Request")
	}

	try {
		const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)
		const user = await User.findById(decodedToken?._id);
		if (!user) {
			throw new ApiError(400, "Invalid Refresh Token!")
		}
		if (incomingrefreshToken !== user.refreshToken) {
			throw new ApiError(400, "Refresh Token Expired or Used")
		}

		const options = {
			httpOnly: true,
			secure: true
		}

		const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id);

		return res.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", newrefreshToken, options)
			.json(
				new ApiResponse(200, { accessToken, refreshToken: newrefreshToken } || "Access Token Refreshed")
			)
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid Refresh Token")
	}
})

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new ApiError(400, "All fields are required!")
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new ApiError(404, "user does not exist!")
	}

	const isPasswordValid = await user.isPasswordCorrect(password);
	if (!isPasswordValid) {
		throw new ApiError(401, "Invalid Credentials!");
	}

	const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
	const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
	const option = {
		httpOnly: true,
		secure: true
	}

	return res.status(200)
		.cookie("accessToken", accessToken, option)
		.cookie("refreshToken", refreshToken, option)
		.json(
			new ApiResponse(200, { loggedInUser }, "User Logged In Successfully")
		)
})

const createUser = asyncHandler(async (req, res) => {
	const { name, email, password, role, departmentName } = req.body;
	if ([name, email, password, role, departmentName].some((field) => field?.trim() === "")) {
		throw new ApiError(400, "Fields cannot be Empty!");
	}
	const existedUser = await User.findOne({ email });
	if (existedUser) {
		throw new ApiError(409, "Email Already Registered!");
	}

	const department = await Department.findOne({
		name: departmentName.trim()
	})
	if(!department){
		throw new ApiError(404, `Department ${departmentName} not found!`)
	}

	const user = await User.create({
		name,
		email,
		password,
		role,
		department: department._id,
	});

	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	).populate("department", "name")

	return res.status(201).json(
		new ApiResponse(201, createdUser, "User created Successfully")
	)
})

const getActiveUsers = asyncHandler(async (req, res) => {
	const users = await User.find({ status: "ACTIVE" })
		.select("_id name email role department")
		.populate("department", "name");

	return res.status(200).json(
		new ApiResponse(200, users, "Users Fetched Successfully")
	)
})

const getUsersByDepartment = asyncHandler(async (req, res) => {
	const { departmentId } = req.params;

	if (!departmentId) {
		throw new ApiError(400, 'Department Id is required!!')
	}
	const users = await User.find({
		department: departmentId,
		status: "ACTIVE"
	})
		.select("_id name email role")

	return res.status(200).json(
		new ApiResponse(200, users, "Department Users Fetched")
	)
})

const getUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id)
		.select("-password -refreshToken")
		.populate("department");

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	return res.status(200).json(
		new ApiResponse(200, user, "User fetched successfully")
	)
})

const updateUser = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { role, department, status } = req.body;

	const user = await User.findById(id)
		.select("-password -refreshToken");

	if (!user) {
		throw new ApiError(400, "User not found!");
	}

	if (role) user.role = role;
	if (department) user.department = department;
	if (status) user.status = status;

	await user.save();

	return res.status(200).json(
		new ApiResponse(200, user, "User details updated")
	)
})

export {
	loginUser,
	createUser,
	getActiveUsers,
	getUser,
	updateUser,
	getUsersByDepartment,
	refreshAccessToken
}