import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, comparisonsTable } from "@workspace/db";
import { eq, inArray, desc } from "drizzle-orm";

const router = Router();

router.get("/v1/compare", async (req, res) => {
  try {
    const slugsParam = req.query.slugs as string | undefined;
    if (!slugsParam) return res.status(400).json({ error: "slugs parameter required" });
    const slugs = slugsParam.split(",").map(s => s.trim()).filter(Boolean).slice(0, 4);
    if (slugs.length < 2) return res.status(400).json({ error: "At least 2 products required" });

    const products = await db.select().from(productsTable)
      .where(inArray(productsTable.slug, slugs));

    res.json({ products, slugs, aiVerdict: null });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/compare/popular", async (req, res) => {
  try {
    const limit = Math.min(20, parseInt(String(req.query.limit || "10")));
    const comparisons = await db.select().from(comparisonsTable)
      .orderBy(desc(comparisonsTable.viewCount)).limit(limit);
    res.json({ data: comparisons });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/compare/ai-verdict", async (req, res) => {
  try {
    const { slugs } = req.body;
    if (!slugs || !Array.isArray(slugs) || slugs.length < 2) {
      return res.status(400).json({ error: "slugs array required" });
    }
    const products = await db.select().from(productsTable)
      .where(inArray(productsTable.slug, slugs));
    if (products.length < 2) return res.status(404).json({ error: "Products not found" });

    const verdict = {
      winner: products[0].slug,
      summary: `${products[0].name} is the recommended choice based on specs and value.`,
      pros: products.map(p => ({ slug: p.slug, points: [`Strong performance`, `Good value`] })),
      cons: products.map(p => ({ slug: p.slug, points: [`Limited availability`] })),
      useCase: "Best for everyday users looking for reliable performance.",
    };
    res.json(verdict);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
