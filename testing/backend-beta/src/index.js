import {app} from "./app.js";
import connectDb from "./db/db_connect.js";
import dotenv from "dotenv";

dotenv.config({path: "./.env"});
const port = process.env.PORT;
connectDb()
.then(() => {
	app.listen(port, () => {
		console.log("server is listening on port: ", port);
	})
})
.catch((error) => {
	console.log("server connection failed!", error);
})