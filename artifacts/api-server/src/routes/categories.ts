import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, productsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/v1/categories", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(categoriesTable.sortOrder);
    res.json({ data: categories });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/categories/:slug", async (req, res) => {
  try {
    const [category] = await db.select().from(categoriesTable)
      .where(eq(categoriesTable.slug, req.params.slug)).limit(1);
    if (!category) return res.status(404).json({ error: "Category not found" });
    const products = await db.select().from(productsTable)
      .where(eq(productsTable.categoryId, category.id))
      .orderBy(desc(productsTable.createdAt))
      .limit(24);
    res.json({ category, products: { data: products } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
