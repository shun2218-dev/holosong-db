import { MetadataRoute } from "next";
import { db } from "@/db";
import { songs, talents } from "@/db/schema";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://holosongdb.com";

	// 1. 静的ページの定義
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/songs`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/talents`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
	];

	// 2. タレント詳細ページの動的生成
	const allTalents = await db
		.select({ id: talents.id, updatedAt: talents.updatedAt })
		.from(talents);

	const talentRoutes: MetadataRoute.Sitemap = allTalents.map((talent) => ({
		url: `${baseUrl}/talents/${talent.id}`,
		lastModified: talent.updatedAt ? new Date(talent.updatedAt) : new Date(),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	// 3. 楽曲詳細ページの動的生成
	const allSongs = await db
		.select({ id: songs.id, updatedAt: songs.updatedAt })
		.from(songs);
	const songRoutes: MetadataRoute.Sitemap = allSongs.map((song) => ({
		url: `${baseUrl}/songs/${song.id}`,
		lastModified: song.updatedAt ? new Date(song.updatedAt) : new Date(),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	// すべてのルートを結合して返却
	return [...staticRoutes, ...talentRoutes, ...songRoutes];
}
