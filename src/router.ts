import express from "express";
import type { Request, Response } from "express";
import { getAll, get, post, put, deleteById } from "./model";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const surveys = await getAll();
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const survey = await get(req.params.id);
    if (!survey) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.status(200).json(survey);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.post("/", async (req: Request, res: Response) => {
  try {
    await post(req.body);
    res.status(201).json({ message: "Survey created" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
router.put("/:id", async (req: Request, res: Response) => {
  try {
    await put(req.params.id, req.body);
    res.status(200).json({ message: "Survey updated" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteById(req.params.id);
    res.status(200).json({ message: "Survey deleted" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
