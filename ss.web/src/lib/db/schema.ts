import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const datasetRecords = sqliteTable("dataset_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("file_name").notNull(),
  transcript: text("transcript").notNull(),
  splitType: text("split_type").notNull(),
  durationS: real("duration_s"),
  createdAt: text("created_at"),
});

export type DatasetRecord = typeof datasetRecords.$inferSelect;
