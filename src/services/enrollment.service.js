import { pool } from "../config/db.js";

export const EnrollmentService = {

    async createEnrollment(data) {
        const { student_id, course_id, semester, academic_year, enrollment_date } = data;

        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const check = await client.query(
                `SELECT id FROM tbl_enrollment_enroll WHERE student_id = $1`,
                [student_id]
            );

            if (check.rows.length > 0) {
                throw new Error("This student is already enrolled.");
            }

            const result = await client.query(
                `INSERT INTO tbl_enrollment_enroll 
                (student_id, semester, academic_year, enrollment_date, status, payment_status)
                VALUES ($1, $2, $3, $4, 'PENDING', 'UNPAID')
                RETURNING *`,
                [student_id, semester, academic_year, enrollment_date]
            );

            const enrollment = result.rows[0];

            await client.query(
                `INSERT INTO tbl_enrollment_courses 
                (enrollment_id, course_id)
                VALUES ($1, $2)`,
                [enrollment.id, course_id]
            );

            await client.query("COMMIT");
            return enrollment;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    },

    async getEnrollmentById(id) {

        const enrollRes = await pool.query(
            `SELECT * FROM tbl_enrollment_enroll WHERE id = $1`,
            [id]
        );

        if (enrollRes.rows.length === 0) return null;

        const reqRes = await pool.query(
            `SELECT id, requirement_name, is_submitted
             FROM tbl_enrollment_requirements WHERE enrollment_id = $1`,
            [id]
        );

        const course = await pool.query(
            `SELECT course_id FROM tbl_enrollment_courses WHERE enrollment_id = $1`,
            [id]
        );

        return {
            ...enrollRes.rows[0],
            course_id: course.rows[0]?.course_id || null,
            requirements: reqRes.rows
        };
    },

    async updateEnrollment(id, data) {
        const { course_id, semester, enrollment_date } = data;

        // Update enrollment and return updated row
        const updateResult = await pool.query(
            `UPDATE tbl_enrollment_enroll 
            SET semester = $1, enrollment_date = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING *`,
            [semester, enrollment_date, id]
        );

        // If no rows were updated, enrollment does not exist
        if (updateResult.rowCount === 0) {
            throw new Error("Enrollment not found");
        }

        // Update course only if course_id is provided
        if (course_id) {
            await pool.query(
                `UPDATE tbl_enrollment_courses
                SET course_id = $1, updated_at = NOW()
                WHERE enrollment_id = $2`,
                [course_id, id]
            );
        }

        return updateResult.rows[0];
    },


    async updateStatus(id, status) {

        const payment_status = status === "APPROVED" ? "PAID" : "UNPAID";

        const res = await pool.query(
            `UPDATE tbl_enrollment_enroll
             SET status = $1, payment_status = $2, updated_at = NOW()
             WHERE id = $3 RETURNING *`,
            [status, payment_status, id]
        );

        return res.rows[0];
    },

    async getUserEnrollments(student_id) {
        const res = await pool.query(
            `SELECT id, semester, status, payment_status,
                    (SELECT course_id FROM tbl_enrollment_courses 
                     WHERE enrollment_id = tbl_enrollment_enroll.id LIMIT 1) AS course_id
             FROM tbl_enrollment_enroll WHERE student_id = $1`,
            [student_id]
        );

        return res.rows;
    },

    async addRequirement(enrollment_id, requirement_name) {
        const res = await pool.query(
            `INSERT INTO tbl_enrollment_requirements 
            (enrollment_id, requirement_name)
            VALUES ($1, $2)
            RETURNING *`,
            [enrollment_id, requirement_name]
        );

        return res.rows[0];
    },

    async updateRequirement(id, is_submitted) {
        const res = await pool.query(
            `UPDATE tbl_enrollment_requirements
             SET is_submitted = $1, updated_at = NOW()
             WHERE id = $2 RETURNING *`,
            [is_submitted, id]
        );

        return res.rows[0];
    }
};
