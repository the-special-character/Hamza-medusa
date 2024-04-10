import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const userService = req.scope.resolve("userService");

  try {
    const user0 = await userService.create(
      {
        email: "GoblinVendor@hamza.com",
        first_name: "Goblin",
        last_name: "Vendor",
      },
      "password",
    );

    const user1 = await userService.create(
      {
        email: "QualityVendor@hamza.com",
        first_name: "Quality",
        last_name: "Vendor",
      },
      "password",
    );

    const user2 = await userService.create(
      {
        email: "HeadphonesVendor@hamza.com",
        first_name: "Headphones",
        last_name: "Vendor",
      },
      "password",
    );

    return res.json({ user0, user1, user2 });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const userService = req.scope.resolve("userService");

  try {
    await userService.delete(req.params.id);
    return res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
