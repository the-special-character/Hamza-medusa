import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { getPackageManager } from "@medusajs/medusa-cli/dist/util/package-manager";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { wallet_address, signature, message } = req.body;
  const customerService = req.scope.resolve("customerService");

  try {
    const isVerified = await customerService.verifyWalletSignature(
      wallet_address,
      signature,
      message,
    );
    if (!isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
    res.json({ success: true, message: "Authentication successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerService = req.scope.resolve("customerService");
  try {
    const customer = await customerService.generateNonce();
    return res.json({ nonce: customer });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
