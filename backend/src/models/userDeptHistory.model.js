import mongoose from "mongoose";

const userDeptHistorySchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	departmentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Department"
	},
	startDate: {
		type: Date,
		required: true
	},
	endDate: {
		type: Date,
		default: null
	}
},
{
	timestamps: true
});

export const UserDeptHistory = mongoose.model("UserDeptHistory", userDeptHistorySchema);