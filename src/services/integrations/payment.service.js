import axios from "axios";
import { SERVICES } from "../../config/services.js";

export const PaymentIntegration = {
    async checkPayment(enrollment_id) {
        try {
            const response = await axios.get(`${SERVICES.PAYMENT}/payments/${enrollment_id}`);
            return response.data; 
        } catch (err) {
            return { paid: false }; 
        }
    }
};
