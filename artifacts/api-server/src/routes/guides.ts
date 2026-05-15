import { Router } from "express";
import { db } from "@workspace/db";
import { guidesTable } from "@workspace/db";
import { eq, desc, sql, isNotNull } from "drizzle-orm";

const router = Router();

router.get("/v1/guides", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
    const offset = (page - 1) * limit;
    const [guides, total] = await Promise.all([
      db.select().from(guidesTable)
        .where(isNotNull(guidesTable.publishedAt))
        .orderBy(desc(guidesTable.publishedAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(guidesTable)
        .where(isNotNull(guidesTable.publishedAt)),
    ]);
    res.json({ data: guides, pagination: { page, limit, total: total[0].count, pages: Math.ceil(total[0].count / limit) } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/guides/:slug", async (req, res) => {
  try {
    const [guide] = await db.select().from(guidesTable)
      .where(eq(guidesTable.slug, req.params.slug)).limit(1);
    if (!guide) return res.status(404).json({ error: "Guide not found" });
    res.json(guide);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
