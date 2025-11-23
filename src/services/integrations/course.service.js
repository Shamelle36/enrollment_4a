import axios from "axios";
import { SERVICES } from "../../config/services.js";

export const CourseIntegration = {
    async verifyCourse(course_id) {
        try {
            const response = await axios.get(`${SERVICES.COURSE}/courses/${course_id}`);
            return response.data;
        } catch (err) {
            throw new Error("Course does not exist in Course Service");
        }
    }
};
