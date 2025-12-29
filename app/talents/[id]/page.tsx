import { eq } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SongList } from "@/components/SongList";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { getTalentSongs } from "./actions";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function TalentDetailPage({ params }: PageProps) {
	const { id } = await params;

	// 1. タレント情報の取得 (楽曲はここでは取得しない)
	const talent = await db.query.talents.findFirst({
		where: eq(talents.id, id),
	});

	if (!talent) {
		notFound();
	}

	// 2. 1ページ目の参加楽曲を取得
	const initialSongs = await getTalentSongs(id, 1);

	// 2ページ目以降を取得する関数
	const fetchMoreTalentSongs = async (page: number) => {
		"use server";
		return getTalentSongs(id, page);
	};

	// タレント情報のJSON-LD定義
	const talentJsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: talent.displayName,
		image: talent.imageUrl,
		description: `Hololive Production - ${talent.generation}`,
		url: `https://holosongdb.com/talents/${talent.id}`,
		sameAs: [
			`https://www.youtube.com/channel/${talent.youtubeChannelId}`,
		].filter(Boolean),
	};

	// パンくずリストのJSON-LD定義
	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "TOP",
				item: "https://holosongdb.com",
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Talents",
				item: "https://holosongdb.com/talents",
			},
			{
				"@type": "ListItem",
				position: 3,
				name: talent.displayName,
				item: `https://holosongdb.com/talents/${talent.id}`,
			},
		],
	};

	return (
		<section>
			{/* タレントプロフィール部分 */}
			<div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
				<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-inner">
					{talent.imageUrl ? (
						<Image
							src={talent.imageUrl}
							alt={talent.displayName}
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
						{talent.displayName}
					</h1>
					<p className="text-lg text-gray-500 mb-4">{talent.generation}</p>
				</div>
			</div>

			{/* 参加楽曲リスト (ページネーション対応) */}
			<h2 className="text-xl font-bold text-gray-900 mb-6">Song List</h2>

			<SongList
				initialSongs={initialSongs}
				fetcher={fetchMoreTalentSongs}
				highlightTalentId={id}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(talentJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
		</section>
	);
}
