import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const crawlerJobsTable = pgTable("crawler_jobs", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  status: text("status").notNull().default("pending"),
  targetUrl: text("target_url"),
  itemsProcessed: integer("items_processed").notNull().default(0),
  itemsFailed: integer("items_failed").notNull().default(0),
  errorLog: jsonb("error_log"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCrawlerJobSchema = createInsertSchema(crawlerJobsTable).omit({ id: true, createdAt: true });
export type InsertCrawlerJob = z.infer<typeof insertCrawlerJobSchema>;
export type CrawlerJob = typeof crawlerJobsTable.$inferSelect;
