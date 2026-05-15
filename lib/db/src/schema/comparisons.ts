import { pgTable, text, serial, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const comparisonsTable = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  slugs: text("slugs").array().notNull(),
  viewCount: integer("view_count").notNull().default(0),
  aiVerdict: jsonb("ai_verdict"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertComparisonSchema = createInsertSchema(comparisonsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertComparison = z.infer<typeof insertComparisonSchema>;
export type Comparison = typeof comparisonsTable.$inferSelect;
