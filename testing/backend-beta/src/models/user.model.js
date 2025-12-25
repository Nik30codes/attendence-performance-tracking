import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	}, 
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	role: {
		type: String,
		enum: ["ADMIN", "EMPLOYEE", "MANAGER"]
	},
	status: {
		type: String,
		enum: ["ACTIVE", "INACTIVE"]
	},
	department: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Department"
	},
	refreshToken: {
		type: String
	}
},
{
	timestamps: true
});

// below two are methods for generating access and refresh token
userSchema.methods.generateAccessToken = async function (){
	return jwt.sign(
		{
			_id: this._id,
			name: this.name,
			email: this.email
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY
		}
	)
}

userSchema.methods.generateRefreshToken = async function(){
	return jwt.sign(
		{
			_id: this._id
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY
		}
	)
}

export const User = mongoose.model("User", userSchema);