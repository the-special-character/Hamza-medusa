import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const userService = req.scope.resolve("userService");

  try {
    const user = await userService.create({
      email: "QualityVendor@hamza.com",
      first_name: "Quality",
      last_name: "Vendor",
      password: "password",
    });

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
