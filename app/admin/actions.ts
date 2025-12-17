'use server';

import { db } from "@/db";
import { songs, songTalents } from "@/db/schema";
import { put } from "@vercel/blob"; // Vercel Blob用
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
      access: 'public',
    });
    jacketUrl = blob.url;
  }

  // 2. 楽曲データを保存
  const [newSong] = await db.insert(songs).values({
    title,
    youtubeUrl,
    releaseDate, // 文字列のままでOK (PostgresがDate型に変換)
    jacketUrl,
    type: "original", 
  }).returning();

  // 3. 中間テーブルに保存 (タレント紐付け)
  if (talentIds.length > 0) {
    await db.insert(songTalents).values(
      talentIds.map((talentId) => ({
        songId: newSong.id,
        talentId: talentId,
      }))
    );
  }

  // 4. キャッシュを更新してトップページへ戻る
  revalidatePath("/");
  redirect("/");
}