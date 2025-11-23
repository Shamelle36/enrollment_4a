import axios from "axios";
import { SERVICES } from "../../config/services.js";

export const AuthIntegration = {
    async verifyStudent(student_id) {
        try {
            const response = await axios.get(`${SERVICES.AUTH}/users/${student_id}`);
            return response.data; 
        } catch (err) {
            throw new Error("Student does not exist in Auth Service");
        }
    }
};
