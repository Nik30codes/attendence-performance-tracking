import mongoose from "mongoose";
import dns from "dns";
import { db_name } from "../db_name.js";

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

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