import { Router } from "express";
import { db } from "@workspace/db";
import { brandsTable, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/v1/brands", async (req, res) => {
  try {
    const brands = await db.select().from(brandsTable).orderBy(brandsTable.name);
    res.json({ data: brands });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/brands/:slug", async (req, res) => {
  try {
    const [brand] = await db.select().from(brandsTable)
      .where(eq(brandsTable.slug, req.params.slug)).limit(1);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    const products = await db.select().from(productsTable)
      .where(eq(productsTable.brandId, brand.id))
      .orderBy(desc(productsTable.createdAt))
      .limit(24);
    res.json({ brand, products: { data: products } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
