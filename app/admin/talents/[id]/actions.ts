"use server";

import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { talents } from "@/db/schema";

// ... UpdateTalentSchema の定義は同じ ...
export type UpdateTalentSchema = {
	displayName: string;
	slug: string;
	youtubeChannelId: string;
	branch: "JP" | "EN" | "ID" | "DEV_IS";
	generation: string;
};

export async function getTalent(id: string) {
	const talent = await db.query.talents.findFirst({
		where: eq(talents.id, id),
	});
	return talent;
}

export async function updateTalent(id: string, data: UpdateTalentSchema) {
	await db
		.update(talents)
		.set({
			displayName: data.displayName,
			slug: data.slug,
			youtubeChannelId: data.youtubeChannelId,
			branch: data.branch,
			generation: data.generation,
			updatedAt: new Date(),
		})
		.where(eq(talents.id, id));

	revalidatePath("/admin/talents");
	// 自身のページも再検証
	revalidatePath(`/admin/talents/${id}`);

	return { success: true, message: "更新しました" };
}

export async function deleteTalent(id: string) {
	await db.delete(talents).where(eq(talents.id, id));
	revalidatePath("/admin/talents");
	redirect("/admin/talents");
}

export async function updateTalentImage(formData: FormData) {
	const file = formData.get("image") as File;
	const talentId = formData.get("id") as string;

	if (!file || !talentId) {
		throw new Error("必要なデータが不足しています");
	}

	try {
		// 1. Vercel Blobへアップロード
		// access: 'public' で公開URLを発行します
		const blob = await put(file.name, file, {
			access: "public",
		});

		// 2. DBのimageUrlを更新
		await db
			.update(talents)
			.set({ imageUrl: blob.url })
			.where(eq(talents.id, talentId));

		// 3. ページを再検証（キャッシュ更新）
		revalidatePath(`/admin/talents/${talentId}`);
		revalidatePath(`/admin/talents`); // 一覧画面も更新

		return { success: true };
	} catch (error) {
		console.error("Upload error:", error);
		return { success: false, error: "アップロードに失敗しました" };
	}
}
