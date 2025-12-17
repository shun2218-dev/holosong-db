import { pgTable, text, timestamp, uuid, date, primaryKey } from "drizzle-orm/pg-core";

// --- タレント情報 ---
export const talents = pgTable("talents", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  generation: text("generation").notNull(),
  imageUrl: text("image_url"), // Vercel Blob URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- 楽曲情報 ---
export const songs = pgTable("songs", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  releaseDate: date("release_date"),
  youtubeUrl: text("youtube_url"),
  jacketUrl: text("jacket_url"), // Vercel Blob URL
  type: text("type").default("original"), // original / cover
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- 中間テーブル: 誰がどの曲を歌っているか ---
export const songTalents = pgTable("song_talents", {
  songId: uuid("song_id").references(() => songs.id, { onDelete: 'cascade' }).notNull(),
  talentId: uuid("talent_id").references(() => talents.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.songId, t.talentId] }),
}));