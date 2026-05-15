import { Router } from "express";
import { db } from "@workspace/db";
import { dealsTable, productsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/v1/deals", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
    const offset = (page - 1) * limit;
    const [deals, total] = await Promise.all([
      db.select().from(dealsTable).orderBy(desc(dealsTable.discount)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(dealsTable),
    ]);
    res.json({ data: deals, pagination: { page, limit, total: total[0].count, pages: Math.ceil(total[0].count / limit) } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/deals/flash", async (req, res) => {
  try {
    const limit = Math.min(20, parseInt(String(req.query.limit || "8")));
    const deals = await db.select().from(dealsTable)
      .where(eq(dealsTable.isFlash, true))
      .orderBy(desc(dealsTable.discount))
      .limit(limit);
    res.json({ data: deals });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
