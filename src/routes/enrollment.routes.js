import { Router } from "express";
import {
    createEnrollment,
    getEnrollmentById,
    updateEnrollment,
    updateStatus,
    getUserEnrollments,
    addRequirement,
    updateRequirement
} from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/enrollment", createEnrollment);
router.get("/enrollment/:id", getEnrollmentById);
router.put("/enrollment/:id", updateEnrollment);
router.put("/enrollment/:id/status", updateStatus);

router.get("/users/:id/enrollments", getUserEnrollments);

router.post("/enrollment/:id/requirements", addRequirement);
router.put("/requirements/:id", updateRequirement);

export default router;
