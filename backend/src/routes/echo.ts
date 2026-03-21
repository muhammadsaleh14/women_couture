import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { EchoBodySchema } from "./schemas";

export const echoRouter = Router();

echoRouter.post("/", validateBody(EchoBodySchema), (req, res) => {
  const { message } = req.body as { message: string };
  res.json({ echo: message });
});
