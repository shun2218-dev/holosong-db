"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, dbTx } from "@/db";
import { songs, songTalents, talents } from "@/db/schema";
import { getYoutubeId } from "@/lib/utils";

// インポートデータの型定義（JSONの構造に合わせて調整）
export type ImportItem = {
	title: string;
	youtubeUrl: string | null;
	releaseDate: string | null;
	type: "original" | "cover";
	singers: string[]; // JSONでは名前の配列で来る想定
};

// 1. 検証用データの取得（タレント一覧、登録済みURLリスト）
export async function getImportHelpers() {
	const allTalents = await db.query.talents.findMany();
	const allSongs = await db.query.songs.findMany({
		columns: { youtubeUrl: true },
	});

	// タレント名 -> ID のマップを作成
	const talentMap = new Map<string, string>();
	allTalents.forEach((t) => talentMap.set(t.displayName, t.id));

	const validUrls = allSongs
		.map((s) => s.youtubeUrl)
		.filter((url): url is string => !!url);

	// 登録済みURLのセット
	const existingUrls = Array.from(new Set(validUrls));

	return {
		talentMap: Object.fromEntries(talentMap), // Clientに渡すためObject化
		existingUrls: Array.from(existingUrls),
	};
}

// 2. 一括登録の実行
export async function registerImportData(items: ImportItem[]) {
	if (items.length === 0) return { count: 0 };

	// タレント辞書を再取得（念のため最新化）
	const allTalents = await db.query.talents.findMany();
	const talentMap = new Map(allTalents.map((t) => [t.displayName, t.id]));

	let successCount = 0;

	for (const item of items) {
		if (!item.youtubeUrl) continue;

		// 重複チェック
		const existing = await db.query.songs.findFirst({
			where: eq(songs.youtubeUrl, item.youtubeUrl),
		});
		if (existing) continue;

		// YouTubeサムネの自動生成
		const videoId = getYoutubeId(item.youtubeUrl);
		const jacketUrl = videoId
			? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
			: null;

		try {
			await dbTx.transaction(async (tx) => {
				// A. 楽曲保存
				const [newSong] = await tx
					.insert(songs)
					.values({
						title: item.title,
						youtubeUrl: item.youtubeUrl,
						releaseDate: item.releaseDate,
						type: item.type,
						jacketUrl,
					})
					.returning();

				// B. タレント紐付け
				const talentIdsToLink: string[] = [];
				for (const name of item.singers) {
					const id = talentMap.get(name);
					if (id) talentIdsToLink.push(id);
				}

				if (talentIdsToLink.length > 0) {
					await tx.insert(songTalents).values(
						talentIdsToLink.map((tid) => ({
							songId: newSong.id,
							talentId: tid,
						})),
					);
				}
			});
			successCount++;
		} catch (e) {
			console.error(`Import Error: ${item.title}`, e);
		}
	}

	revalidatePath("/");
	revalidatePath("/admin");
	return { count: successCount };
}
