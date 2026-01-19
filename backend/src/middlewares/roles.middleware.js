import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const roleCreate = {
	ADMIN: ["MANAGER", "EMPLOYEE"],
	MANAGER: ["EMPLOYEE"]
}

export const canCreateUser = asyncHandler(async(req, _, next) => {
	const creatorRole = req.user?.role;
	const targetRole = req.body?.role || "EMPLOYEE";

	if (!creatorRole) {
		throw new ApiError(401, "Unauthorized");
	}

	const allowedRoles = roleCreate[creatorRole];

	if (!allowedRoles || !allowedRoles.includes(targetRole)) {
		throw new ApiError(
			403,
			`${creatorRole} is not allowed to create ${targetRole}`
		);
	}

	next();
})