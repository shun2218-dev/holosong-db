import { relations } from "drizzle-orm";
import {
	date,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

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
export const songTalents = pgTable(
	"song_talents",
	{
		songId: uuid("song_id")
			.references(() => songs.id, { onDelete: "cascade" })
			.notNull(),
		talentId: uuid("talent_id")
			.references(() => talents.id, { onDelete: "cascade" })
			.notNull(),
	},
	(t) => [primaryKey({ columns: [t.songId, t.talentId] })],
);

// タレントから見たリレーション (タレントは複数の曲を持つ)
export const talentsRelations = relations(talents, ({ many }) => ({
	songs: many(songTalents),
}));

// 楽曲から見たリレーション (楽曲は複数のタレントを持つ)
export const songsRelations = relations(songs, ({ many }) => ({
	talents: many(songTalents),
}));

// 中間テーブルのリレーション
export const songTalentsRelations = relations(songTalents, ({ one }) => ({
	song: one(songs, {
		fields: [songTalents.songId],
		references: [songs.id],
	}),
	talent: one(talents, {
		fields: [songTalents.talentId],
		references: [talents.id],
	}),
}));
