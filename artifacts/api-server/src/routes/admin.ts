import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable, brandsTable, crawlerJobsTable } from "@workspace/db";
import { eq, desc, sql, ilike } from "drizzle-orm";

const router = Router();

router.get("/v1/admin/stats", async (req, res) => {
  try {
    const [productCount, categoryCount, brandCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable),
      db.select({ count: sql<number>`count(*)::int` }).from(categoriesTable),
      db.select({ count: sql<number>`count(*)::int` }).from(brandsTable),
    ]);
    const byCategory = await db.select({
      categoryId: productsTable.categoryId,
      count: sql<number>`count(*)::int`,
    }).from(productsTable).groupBy(productsTable.categoryId).limit(10);
    res.json({
      totalProducts: productCount[0].count,
      totalCategories: categoryCount[0].count,
      totalBrands: brandCount[0].count,
      productsByCategory: byCategory,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/products", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || "25"))));
    const offset = (page - 1) * limit;
    const q = req.query.q as string | undefined;
    const condition = q ? ilike(productsTable.name, `%${q}%`) : undefined;
    const [products, total] = await Promise.all([
      db.select().from(productsTable).where(condition).orderBy(desc(productsTable.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(condition),
    ]);
    res.json({ data: products, pagination: { page, limit, total: total[0].count, pages: Math.ceil(total[0].count / limit) } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/products", async (req, res) => {
  try {
    const [product] = await db.insert(productsTable).values(req.body).returning();
    res.status(201).json(product);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/v1/admin/products/:id", async (req, res) => {
  try {
    const [product] = await db.update(productsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(productsTable.id, parseInt(req.params.id)))
      .returning();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/products/:id", async (req, res) => {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/categories", async (req, res) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.sortOrder);
    res.json({ data: cats });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/categories", async (req, res) => {
  try {
    const [cat] = await db.insert(categoriesTable).values(req.body).returning();
    res.status(201).json(cat);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/brands", async (req, res) => {
  try {
    const brands = await db.select().from(brandsTable).orderBy(brandsTable.name);
    res.json({ data: brands });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/brands", async (req, res) => {
  try {
    const [brand] = await db.insert(brandsTable).values(req.body).returning();
    res.status(201).json(brand);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/crawler/jobs", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || "1")));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || "20"))));
    const offset = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      db.select().from(crawlerJobsTable).orderBy(desc(crawlerJobsTable.createdAt)).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(crawlerJobsTable),
    ]);
    res.json({ data: jobs, pagination: { page, limit, total: total[0].count, pages: Math.ceil(total[0].count / limit) } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/crawler/trigger", async (req, res) => {
  try {
    const { source, targetUrl } = req.body;
    const [job] = await db.insert(crawlerJobsTable).values({
      source: source || "manual",
      targetUrl,
      status: "pending",
    }).returning();
    res.status(202).json({ job, message: "Crawler job queued" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/products/bulk-import", async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) return res.status(400).json({ error: "products array required" });
    let imported = 0;
    let failed = 0;
    for (const p of products) {
      try {
        await db.insert(productsTable).values(p).onConflictDoUpdate({
          target: productsTable.slug,
          set: { ...p, updatedAt: new Date() },
        });
        imported++;
      } catch {
        failed++;
      }
    }
    res.json({ imported, failed, total: products.length });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
