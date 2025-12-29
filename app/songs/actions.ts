import { desc } from "drizzle-orm";
import { SongWithTalents } from "@/components/SongCard";
import { db } from "@/db";
import { songs } from "@/db/schema";

const ITEMS_PER_PAGE = 12;

// トップページ用: 楽曲検索＆ページネーション
export async function getSongs(
	page: number,
	query = "",
	type = "all",
): Promise<SongWithTalents[]> {
	const offset = (page - 1) * ITEMS_PER_PAGE;

	const data = await db.query.songs.findMany({
		with: {
			talents: {
				with: {
					talent: true,
				},
			},
		},
		where: (songs, { and, ilike, eq }) => {
			const conditions = [];
			if (query) conditions.push(ilike(songs.title, `%${query}%`));
			if (type !== "all") conditions.push(eq(songs.type, type));
			return conditions.length > 0 ? and(...conditions) : undefined;
		},
		orderBy: [desc(songs.releaseDate), desc(songs.id)],
		limit: ITEMS_PER_PAGE,
		offset: offset,
	});

	return data;
}
