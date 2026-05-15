import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { ilike, or, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/v1/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
    const offset = (page - 1) * limit;

    if (!q) return res.json({ data: [], pagination: { page, limit, total: 0, pages: 0 }, query: "" });

    const condition = or(
      ilike(productsTable.name, `%${q}%`),
      ilike(productsTable.description, `%${q}%`),
    );

    const [products, total] = await Promise.all([
      db.select().from(productsTable).where(condition)
        .orderBy(desc(productsTable.rating)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(condition),
    ]);

    res.json({
      data: products,
      pagination: { page, limit, total: total[0].count, pages: Math.ceil(total[0].count / limit) },
      query: q,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/search/autocomplete", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q || q.length < 2) return res.json({ suggestions: [] });
    const products = await db.select({
      id: productsTable.id, name: productsTable.name, slug: productsTable.slug,
      imageUrl: productsTable.imageUrl, priceFrom: productsTable.priceFrom,
    }).from(productsTable)
      .where(ilike(productsTable.name, `%${q}%`))
      .limit(8);
    res.json({ suggestions: products });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
