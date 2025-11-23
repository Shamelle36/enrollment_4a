import { EnrollmentService } from "../services/enrollment.service.js";

export const createEnrollment = async (req, res) => {
    try {
        const data = await EnrollmentService.createEnrollment(req.body);
        res.status(201).json({
            message: "Enrollment created successfully",
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEnrollmentById = async (req, res) => {
    try {
        const data = await EnrollmentService.getEnrollmentById(req.params.id);

        if (!data) {
            return res.status(404).json({ message: "Enrollment not found" });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEnrollment = async (req, res) => {
    try {
        const data = await EnrollmentService.updateEnrollment(req.params.id, req.body);
        res.json({
            message: "Enrollment updated successfully",
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const data = await EnrollmentService.updateStatus(req.params.id, req.body.status);
        res.json({
            message: "Status updated successfully",
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserEnrollments = async (req, res) => {
    try {
        const enrollments = await EnrollmentService.getUserEnrollments(req.params.id);
        res.json({
            student_id: req.params.id,
            enrollments
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addRequirement = async (req, res) => {
    try {
        const data = await EnrollmentService.addRequirement(
            req.params.id,
            req.body.requirement_name
        );

        res.status(201).json({
            message: "Requirement added",
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRequirement = async (req, res) => {
    try {
        const data = await EnrollmentService.updateRequirement(
            req.params.id,
            req.body.is_submitted
        );

        res.json({
            message: "Requirement updated",
            data
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
