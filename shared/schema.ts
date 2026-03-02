import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description").notNull(),
  score: integer("score").notNull(),
  analysis: jsonb("analysis").notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScanSchema = createInsertSchema(scans).pick({
  resumeText: true,
  jobDescription: true,
});

export type Scan = typeof scans.$inferSelect;
export type InsertScan = z.infer<typeof insertScanSchema>;
