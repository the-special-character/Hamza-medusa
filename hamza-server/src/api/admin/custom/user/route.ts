import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const userService = req.scope.resolve("userService");
  const storeService = req.scope.resolve("storeService");

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

    const store0 = await storeService.addUser(user0);

    return res.json({ user0, user1, user2, store0 });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
