import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const launchesTable = pgTable("launches", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  imageUrl: text("image_url"),
  expectedPrice: text("expected_price"),
  launchDate: timestamp("launch_date", { withTimezone: true }),
  isConfirmed: boolean("is_confirmed").notNull().default(false),
  slug: text("slug"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertLaunchSchema = createInsertSchema(launchesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLaunch = z.infer<typeof insertLaunchSchema>;
export type Launch = typeof launchesTable.$inferSelect;
