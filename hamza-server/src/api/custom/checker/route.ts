import {MedusaRequest, MedusaResponse} from "@medusajs/medusa";
import {generateNonce} from "siwe";

export const GET = (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    try {
        const nonce = generateNonce();
        console.log("nonce", nonce, "typeof nonce", typeof nonce);

        return res.json({
            message: nonce,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
};

