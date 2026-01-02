import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
	try{
		const user = await User.findById(userId);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({validateBeforeSave: false});

		return {accessToken, refreshToken};
	} catch(error) {
		throw new ApiError(500, "Something went wrong while generating Access and Refresh Tokens");
	}
}

const createUser = asyncHandler(async (req, res) => {
	const {name, email, password, role, department} = req.body;
	if([name, email, password].some((field) => field?.trim() === "")){
		throw new ApiError(400, "Fields cannot be Empty!");
	}
	const existedUser = await User.findOne({email});
	if(existedUser){
		throw new ApiError(409, "Email Already Registered!");
	}

	const user = await User.create({
		name,
		email,
		password,
		role,
		department,
	});

	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	)

	return res.status(201).json(
		new ApiResponse(201, createdUser, "User created Successfully")
	)
})

const getActiveUsers = asyncHandler(async(req, res) => {
	const users = await User.find({status: "ACTIVE"})
	.select("_id, name, email role department")
	.populate("department", "name");

	return res.status(200).json(
		new ApiResponse(200, users, "Users Fetched Successfully")
	)
})

const getUsersByDepartment = asyncHandler(async(req, res) => {
	const {departmentId} = req.params;

	if(!departmentId){
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

const getUser = asyncHandler(async(req, res) => {
	const {id} = req.params;
	const user = await User.findById(id).populate("department");

	if(!user){
		throw new ApiError(404, "User not found");
	}

	const selectedUser = user.select(
		"-password, -refreshToken"
	)

	return res.status(200).json(
		new ApiResponse(200, selectedUser, "User fetched successfully")
	)
})

const updateUser = asyncHandler(async(req, res) => {
	const {id} = req.params;
	const {role, department, status} = req.body;

	const user = await User.findById(id);
	if(!user){
		throw new ApiError(400, "User not found!");
	}

	if(role) user.role = role;
	if(department) user.department = department;
	if(status) user.status = status;

	await user.save();

	const updatedUser = user.select(
		"-password, -refreshToken"
	)

	return res.status(200).jason(
		new ApiResponse(200, updateUser, "User details updated")
	)
})

export {
	createUser,
	getActiveUsers,
	getUser,
	updateUser,
	getUsersByDepartment
}