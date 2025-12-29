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

const registerUser = asyncHandler(async (req, res) => {
	const {name, email, password, role} = req.body;
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
	})
})