"use server";

import { eq, inArray } from "drizzle-orm";

import { revalidatePath } from "next/cache";

import { db } from "@/db";

import { talents } from "@/db/schema";

// 登録候補の型
export type TalentCandidate = {
	slug: string;
	displayName: string;
	generation: string;
	branch: "JP" | "EN" | "ID" | "DEV_IS";
	youtubeChannelId: string;
};

// 既存チェック用のアクション
export async function checkExistingTalents(names: string[]) {
	if (names.length === 0) return [];

	// 名前で検索して、既に存在するタレント名のリストを返す
	const existing = await db.query.talents.findMany({
		where: inArray(talents.displayName, names),

		columns: {
			displayName: true,
		},
	});

	return existing.map((t) => t.displayName);
}

// 登録実行アクション
export async function registerTalents(candidates: TalentCandidate[]) {
	if (candidates.length === 0) return { count: 0 };

	// 重複を除去（念のため再度チェック）
	const names = candidates.map((c) => c.displayName);
	const existing = await checkExistingTalents(names);
	const existingSet = new Set(existing);
	const newTalents = candidates.filter((c) => !existingSet.has(c.displayName));
	if (newTalents.length === 0) return { count: 0 };

	// 一括挿入

	await db.insert(talents).values(
		newTalents.map((t) => ({
			displayName: t.displayName,
			generation: t.generation,
			slug: t.slug,
			branch: t.branch,
			youtubeChannelId: t.youtubeChannelId,
		})),
	);

	revalidatePath("/admin");
	revalidatePath("/talents");
	return { count: newTalents.length };
}
