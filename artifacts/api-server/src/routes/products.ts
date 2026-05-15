import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, brandsTable } from "@workspace/db";
import { eq, desc, sql, ilike, and } from "drizzle-orm";

const router = Router();

router.get("/v1/products", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
    const offset = (page - 1) * limit;
    const category = req.query.category as string | undefined;
    const brand = req.query.brand as string | undefined;

    const conditions = [];
    if (category) {
      const cat = await db.select({ id: categoriesTable.id }).from(categoriesTable).where(eq(categoriesTable.slug, category)).limit(1);
      if (cat[0]) conditions.push(eq(productsTable.categoryId, cat[0].id));
    }
    if (brand) {
      const br = await db.select({ id: brandsTable.id }).from(brandsTable).where(eq(brandsTable.slug, brand)).limit(1);
      if (br[0]) conditions.push(eq(productsTable.brandId, br[0].id));
    }

    const [products, total] = await Promise.all([
      db.select().from(productsTable)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(productsTable.createdAt))
        .limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable)
        .where(conditions.length ? and(...conditions) : undefined),
    ]);

    res.json({
      data: products,
      pagination: { page, limit, total: total[0].count, pages: Math.ceil(total[0].count / limit) },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/products/trending", async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit || "10"))));
    const products = await db.select().from(productsTable)
      .where(eq(productsTable.isTrending, true))
      .orderBy(desc(productsTable.updatedAt))
      .limit(limit);
    res.json({ data: products });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/products/featured", async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit || "12"))));
    const products = await db.select().from(productsTable)
      .where(eq(productsTable.isFeatured, true))
      .orderBy(desc(productsTable.updatedAt))
      .limit(limit);
    res.json({ data: products });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/products/:slug", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable)
      .where(eq(productsTable.slug, req.params.slug)).limit(1);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/products/:slug/prices", async (req, res) => {
  try {
    const [product] = await db.select({ id: productsTable.id }).from(productsTable)
      .where(eq(productsTable.slug, req.params.slug)).limit(1);
    if (!product) return res.status(404).json({ error: "Product not found" });
    const { pricesTable } = await import("@workspace/db");
    const prices = await db.select().from(pricesTable).where(eq(pricesTable.productId, product.id));
    res.json({ data: prices });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/products/:slug/similar", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable)
      .where(eq(productsTable.slug, req.params.slug)).limit(1);
    if (!product) return res.status(200).json({ data: [] });
    const similar = await db.select().from(productsTable)
      .where(and(eq(productsTable.categoryId, product.categoryId!), sql`${productsTable.id} != ${product.id}`))
      .orderBy(desc(productsTable.rating))
      .limit(6);
    res.json({ data: similar });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
