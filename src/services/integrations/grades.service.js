import axios from "axios";
import { SERVICES } from "../../config/services.js";

export const GradesIntegration = {
    async getGrades(student_id) {
        try {
            const response = await axios.get(`${SERVICES.GRADES}/grades/student/${student_id}`);
            return response.data;
        } catch (err) {
            return []; 
        }
    }
};
