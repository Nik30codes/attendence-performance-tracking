import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { createDept } from "../controllers/department.controller.js";

const deptRouter = Router();

deptRouter.route("/createdept").post(verifyJWT, authorizeRoles("ADMIN"), createDept);

export default deptRouter;