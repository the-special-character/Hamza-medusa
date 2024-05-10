import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ConfirmationTokenService from "../../../../services/confirmation-token";



export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {

        let { email, customerId } = req.body;
        let confirmationTokenService: ConfirmationTokenService = req.scope.resolve('confirmationTokenService');
        await confirmationTokenService.createConfirmationToken({ customerId, email });
        return res.send({ status: true });
    } catch (e) {
        console.log('error in generating token ', e);
        return res.send({ status: false, message: e.message })
    }
};