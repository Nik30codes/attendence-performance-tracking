import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
		unique: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	authType: {
		type: String,
		enum: ["GOOGLE", "LOCAL"],
		default: "LOCAL"
	},
	role: {
		type: String,
		enum: ["ADMIN", "EMPLOYEE", "MANAGER"],
		default: "EMPLOYEE"

	},
	status: {
		type: String,
		enum: ["ACTIVE", "INACTIVE"],
		default: "ACTIVE"
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

userSchema.pre("save", async function(next){
	if(!this.isModified("password")) return next();
	this.password = bcrypt.hash(this.password, 10);
	next();
});
userSchema.methods.isPasswordCorrect = async function(password){
	return await bcrypt.compare(password, this.password);
}


// below two are methods for generating access and refresh token
userSchema.methods.generateAccessToken = async function (){
	return jwt.sign(
		{
			_id: this._id,
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