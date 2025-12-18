import { desc, eq, inArray } from "drizzle-orm";
import { SongWithTalents } from "@/components/SongCard";
import { db } from "@/db";
import { songs, songTalents } from "@/db/schema";

const ITEMS_PER_PAGE = 12;

// タレント詳細ページ用: 参加楽曲ページネーション
export async function getTalentSongs(
	talentId: string,
	page: number,
): Promise<SongWithTalents[]> {
	const offset = (page - 1) * ITEMS_PER_PAGE;

	// 1. 中間テーブルと楽曲テーブルをJOINして、対象タレントの曲IDをリリース日順に取得
	// (db.query.songTalentsだと日付ソートが難しいため、db.selectを使用)
	const targetSongIds = await db
		.select({ id: songTalents.songId })
		.from(songTalents)
		.innerJoin(songs, eq(songTalents.songId, songs.id))
		.where(eq(songTalents.talentId, talentId))
		.orderBy(desc(songs.releaseDate), desc(songs.id))
		.limit(ITEMS_PER_PAGE)
		.offset(offset);

	if (targetSongIds.length === 0) {
		return [];
	}

	const ids = targetSongIds.map((row) => row.id);

	// 2. 取得したIDに基づいて、詳細情報（他の参加タレント含む）を取得
	const data = await db.query.songs.findMany({
		where: inArray(songs.id, ids),
		orderBy: [desc(songs.releaseDate), desc(songs.id)], // ここでも念のためソート
		with: {
			talents: {
				with: {
					talent: true,
				},
			},
		},
	});

	return data;
}
