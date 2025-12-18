import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTalentSongs } from "@/app/actions"; // 作成したAction
import { SongList } from "@/components/SongList"; // 作成したList
import { db } from "@/db";
import { talents } from "@/db/schema";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function TalentDetailPage({ params }: PageProps) {
	const { id } = await params;

	// 1. タレント情報の取得 (楽曲はここでは取得しない)
	const talentData = await db.query.talents.findFirst({
		where: eq(talents.id, id),
	});

	if (!talentData) {
		notFound();
	}

	// 2. 1ページ目の参加楽曲を取得
	const initialSongs = await getTalentSongs(id, 1);

	// 2ページ目以降を取得する関数
	const fetchMoreTalentSongs = async (page: number) => {
		"use server";
		return getTalentSongs(id, page);
	};

	return (
		<div>
			{/* タレントプロフィール部分 */}
			<div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
				<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-inner">
					{talentData.imageUrl ? (
						<Image
							src={talentData.imageUrl}
							alt={talentData.displayName}
							fill
							sizes="(max-width: 768px) 150px, 200px"
							className="object-cover"
						/>
					) : (
						<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
							No Image
						</div>
					)}
				</div>
				<div className="text-center md:text-left">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						{talentData.displayName}
					</h1>
					<p className="text-lg text-gray-500 mb-4">{talentData.generation}</p>
				</div>
			</div>

			{/* 参加楽曲リスト (ページネーション対応) */}
			<h2 className="text-xl font-bold text-gray-900 mb-6">Song List</h2>

			<SongList
				initialSongs={initialSongs}
				fetcher={fetchMoreTalentSongs}
				highlightTalentId={id}
			/>
		</div>
	);
}
