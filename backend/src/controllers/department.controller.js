import { Department } from "../models/department.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createDept = asyncHandler(async(req, res) => {
	const {departmentName, description} = req.body;
	if(!departmentName){
		throw new ApiError(400, `Department name cannot be empty!`);
	}
	const deptName = departmentName.trim().toLowerCase();

	const existingDept = await Department.findOne({name: deptName})
	if(existingDept){
		throw new ApiError(409, "Department already exist!");
	}

	const dept = await Department.create({
		name: deptName,
		description: description?.trim() || ""
	});

	return res.status(201).json(
		new ApiResponse(201, dept, "Department Created Succesfully")
	)
})

export {
	createDept
}
