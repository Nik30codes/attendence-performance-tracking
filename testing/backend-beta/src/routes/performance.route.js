import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.middleware.js";
import { createPerformanceMetric, getAllPerformanceMetrics, getPerformanceByUser, recordPerformance, updatePerformanceRecord } from "../controllers/performance.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const performanceRouter = Router();

performanceRouter.route("/create-performance-metric").post(verifyJWT, authorizeRoles("ADMIN"), createPerformanceMetric);
performanceRouter.route("/record-performance").post(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), recordPerformance);
performanceRouter.route("/get-performance-user").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getPerformanceByUser);
performanceRouter.route("/update-performance").patch(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), updatePerformanceRecord);
performanceRouter.route("/get-performance-metric").get(verifyJWT, authorizeRoles("ADMIN", "MANAGER"), getAllPerformanceMetrics);

export default performanceRouter;