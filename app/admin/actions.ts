"use server";

import { put } from "@vercel/blob"; // Vercel Blob用
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { songs, songTalents } from "@/db/schema";

export async function addNewSong(formData: FormData) {
	const title = formData.get("title") as string;
	const youtubeUrl = formData.get("youtubeUrl") as string;
	const releaseDate = formData.get("releaseDate") as string;
	const talentIds = formData.getAll("talentIds") as string[];
	const imageFile = formData.get("jacketImage") as File;

	let jacketUrl = "";

	// 1. 画像があればVercel Blobにアップロード
	if (imageFile && imageFile.size > 0) {
		const blob = await put(imageFile.name, imageFile, {
			access: "public",
		});
		jacketUrl = blob.url;
	}

	// 2. 楽曲データを保存
	const [newSong] = await db
		.insert(songs)
		.values({
			title,
			youtubeUrl,
			releaseDate, // 文字列のままでOK (PostgresがDate型に変換)
			jacketUrl,
			type: "original",
		})
		.returning();

	// 3. 中間テーブルに保存 (タレント紐付け)
	if (talentIds.length > 0) {
		await db.insert(songTalents).values(
			talentIds.map((talentId) => ({
				songId: newSong.id,
				talentId: talentId,
			})),
		);
	}

	// 4. キャッシュを更新してトップページへ戻る
	revalidatePath("/");
	redirect("/");
}

// 楽曲の削除
export async function deleteSong(songId: string) {
	// カスケード削除を設定しているため、songsを消せば中間テーブルも自動で消えます
	await db.delete(songs).where(eq(songs.id, songId));

	revalidatePath("/");
	revalidatePath("/admin");
}

// 楽曲の更新
type UpdateData = {
	title: string;
	youtubeUrl: string;
	releaseDate: string;
	jacketUrl?: string;
};

export async function updateSong(formData: FormData) {
	const songId = formData.get("id") as string;
	const title = formData.get("title") as string;
	const youtubeUrl = formData.get("youtubeUrl") as string;
	const releaseDate = formData.get("releaseDate") as string;
	const talentIds = formData.getAll("talentIds") as string[];
	const imageFile = formData.get("jacketImage") as File;

	// 更新データオブジェクトの作成
	const updateData: UpdateData = {
		title,
		youtubeUrl,
		releaseDate,
	};

	// 新しい画像がアップロードされた場合のみ画像を更新
	if (imageFile && imageFile.size > 0) {
		const blob = await put(imageFile.name, imageFile, { access: "public" });
		updateData.jacketUrl = blob.url;
	}

	// トランザクションで更新処理を実行
	await db.transaction(async (tx) => {
		// 1. 基本情報の更新 (注意: ここでは db ではなく tx を使う)
		await tx.update(songs).set(updateData).where(eq(songs.id, songId));

		// 2. タレント紐付けの更新
		// まず既存の紐付けを削除
		await tx.delete(songTalents).where(eq(songTalents.songId, songId));

		// 新しい紐付けがあれば登録
		if (talentIds.length > 0) {
			await tx.insert(songTalents).values(
				talentIds.map((talentId) => ({
					songId: songId,
					talentId: talentId,
				})),
			);
		}
	});

	revalidatePath("/");
	revalidatePath(`/songs/${songId}`);
	redirect("/admin");
}
