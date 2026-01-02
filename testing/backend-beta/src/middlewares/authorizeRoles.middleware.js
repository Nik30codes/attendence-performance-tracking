import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...allowedRoles) => {
	return (req, _, next) => {
		if(!req.user || !req.user.role) {
			throw new ApiError(403, "Unauthorized Access");
		}

		if(!allowedRoles.includes(req.user.role)){
			throw new ApiError(403, "Sorry, You are not allowed to access this resource");
		}
		next();
	}
};