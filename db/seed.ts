import { db } from "./index";
import { songs, songTalents, talents } from "./schema";

async function main() {
	console.log("🌱 Seeding start...");

	// 1. 既存データの削除 (外部キー制約があるため子テーブルから消す)
	await db.delete(songTalents);
	await db.delete(songs);
	await db.delete(talents);

	// 2. タレントの作成
	const [suisei] = await db
		.insert(talents)
		.values({
			displayName: "星街すいせい",
			slug: "hoshimachi-suisei",
			branch: "JP",
			generation: "0期生",
			youtubeChannelId: "UC5CwaMl1eIgY8h02uZw7u8A",
			imageUrl:
				"https://hololive.hololivepro.com/wp-content/uploads/2020/06/Hoshimachi-Suisei_list_thumb.png",
		})
		.returning();

	const [marine] = await db
		.insert(talents)
		.values({
			displayName: "宝鐘マリン",
			slug: "houshou-marine",
			branch: "JP",
			youtubeChannelId: "UCCzUftO8KOVkV4wQG1vkUvg",
			generation: "3期生",
			imageUrl:
				"https://hololive.hololivepro.com/wp-content/uploads/2020/06/Houshou-Marine_list_thumb.png",
		})
		.returning();

	console.log("✨ Talents created");

	// 3. 楽曲の作成
	const [stellar] = await db
		.insert(songs)
		.values({
			title: "Stellar Stellar",
			releaseDate: "2021-09-29",
			type: "original",
			youtubeUrl: "https://www.youtube.com/watch?v=a51VH9BYzZA",
		})
		.returning();

	const [bishojo] = await db
		.insert(songs)
		.values({
			title: "美少女無罪♡パイレーツ",
			releaseDate: "2023-07-30",
			type: "original",
			youtubeUrl: "https://www.youtube.com/watch?v=KfZR9jVP6tw",
		})
		.returning();

	console.log("🎵 Songs created");

	// 4. 紐付け (中間テーブル)
	await db.insert(songTalents).values([
		{ songId: stellar.id, talentId: suisei.id },
		{ songId: bishojo.id, talentId: marine.id },
	]);

	console.log("🔗 Relations created");
	console.log("✅ Seeding finished!");
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
