import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const GET = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "[GET] Hello world!",
  });
};

export const POST = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "[POST] Hello world!",
  });
};
// s%3A9k7yoVAJFARexFBhpEWPf8qv7NUra0Zn.A7jbZdHZ%2FKukjyd6qf1rohdHgYfUmLcwJle9epE8cn4
