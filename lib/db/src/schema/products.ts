import { pgTable, text, serial, timestamp, integer, boolean, jsonb, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  images: text("images").array(),
  categoryId: integer("category_id"),
  brandId: integer("brand_id"),
  specs: jsonb("specs"),
  priceFrom: decimal("price_from", { precision: 10, scale: 2 }),
  priceTo: decimal("price_to", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("INR"),
  rating: decimal("rating", { precision: 3, scale: 1 }),
  reviewCount: integer("review_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  isTrending: boolean("is_trending").notNull().default(false),
  isAvailable: boolean("is_available").notNull().default(true),
  releaseDate: timestamp("release_date", { withTimezone: true }),
  sourceUrl: text("source_url"),
  crawledAt: timestamp("crawled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [
  index("products_category_idx").on(t.categoryId),
  index("products_brand_idx").on(t.brandId),
  index("products_trending_idx").on(t.isTrending),
  index("products_featured_idx").on(t.isFeatured),
]);

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
