import { Router } from "express";
import { db } from "@workspace/db";
import { launchesTable } from "@workspace/db";
import { desc, sql } from "drizzle-orm";

const router = Router();

router.get("/v1/launches", async (req, res) => {
  try {
    const limit = Math.min(50, parseInt(String(req.query.limit || "20")));
    const launches = await db.select().from(launchesTable)
      .orderBy(desc(launchesTable.launchDate))
      .limit(limit);
    res.json({ data: launches });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
