import mongoose from "mongoose";
import { db_name } from "../db_name.js";

const connectDb = async () => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`);
		console.log("MongoDb succesfully connected! Host:", connectionInstance.connection.host);
	} catch (error) {
		console.log("MongoDb connection Failed!", error);
		process.exit(1);		
	}
}
export default connectDb;