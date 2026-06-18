import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { canCreateUser } from "../middlewares/roles.middleware.js";
import { createUser, getActiveUsers, getDashboardStats, getMe, getUser, getUsersByDepartment, loginUser, refreshAccessToken, signupUser, updateUser, verifyHome } from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";

const userRouter = Router();

userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/login").post(loginUser);
userRouter.route("/signup").post(signupUser);
userRouter.route("/createuser").post(verifyJWT, canCreateUser, createUser);
userRouter.route("/getactiveusers").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getActiveUsers);
userRouter.route("/dept-users/:departmentId").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getUsersByDepartment)
userRouter.route("/getuser/:id").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getUser);
userRouter.route("/home").get(verifyJWT, verifyHome);
userRouter.route("/me").get(verifyJWT, getMe);
userRouter.route("/active").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getActiveUsers);
userRouter.route("/stats").get(verifyJWT, authorizeRoles("ADMIN"), getDashboardStats);

// update is not fixed yet (managers can also update managers and admin) so this need fix.
userRouter.route("/updateuser").patch(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), updateUser);

export default userRouter;														