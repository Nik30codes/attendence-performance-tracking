import { User } from "../models/user.model.js";
import connectDb from "../db/db_connect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
	path: path.resolve(__dirname, "../../.env")
});

if(process.env.ALLOW_ADMIN_SCRIPT !== "true"){
	throw new Error("Admin script not enabled!");
}

await connectDb();

const existingAdmin = await User.findOne({role: "ADMIN"});
if(existingAdmin){
	console.log("Admin Already Exist!");
	process.exit(0);
}

await User.create({
	name: process.env.ADMIN_NAME,
	email: process.env.ADMIN_EMAIL,
	password: process.env.ADMIN_PASSWD,
	role: "ADMIN"
});

console.log("Admin created Successfully!");
process.exit(0);