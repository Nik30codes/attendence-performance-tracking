import mongoose from "mongoose";

const oauthSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	provider: {
		type: String,
		enum: ["GOOGLE"]
	},
	providerAccountId: {
		type: String,
		unique: true,
		required: true
	}
},
{
	timestamps: true
});

export const Oauth = mongoose.model("Oauth", oauthSchema);