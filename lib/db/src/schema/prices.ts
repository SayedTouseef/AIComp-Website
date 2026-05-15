import { pgTable, text, serial, timestamp, integer, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pricesTable = pgTable("prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  retailer: text("retailer").notNull(),
  retailerLogoUrl: text("retailer_logo_url"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  currency: text("currency").notNull().default("INR"),
  discount: integer("discount"),
  url: text("url"),
  inStock: text("in_stock").notNull().default("yes"),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("prices_product_idx").on(t.productId),
]);

export const insertPriceSchema = createInsertSchema(pricesTable).omit({ id: true, createdAt: true });
export type InsertPrice = z.infer<typeof insertPriceSchema>;
export type Price = typeof pricesTable.$inferSelect;
