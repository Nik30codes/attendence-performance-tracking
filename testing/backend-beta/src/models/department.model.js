import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true
	},
	description: {
		type: String
	}
},
{
	timestamps: true
});

export const Department = mongoose.model("Department", departmentSchema);