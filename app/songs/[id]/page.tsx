import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { getYoutubeId } from "@/lib/utils";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function SongDetailPage({ params }: PageProps) {
	const { id } = await params;

	// DBから楽曲データを取得（ID指定）
	const song = await db.query.songs.findFirst({
		where: eq(songs.id, id),
		with: {
			talents: {
				with: {
					talent: true,
				},
			},
		},
	});

	if (!song) {
		notFound(); // 404ページを表示
	}

	const youtubeId = getYoutubeId(song.youtubeUrl);

	// 楽曲情報のJSON-LD定義
	const songJsonLd = {
		"@context": "https://schema.org",
		"@type": "MusicRecording",
		name: song.title,
		byArtist:
			song.talents.length > 1
				? song.talents.map((songTalent) => ({
						"@type": "MusicGroup",
						name: songTalent.talent.displayName,
						url: `https://holosongdb.com/talents/${songTalent.talentId}`,
					}))
				: {
						"@type": "Person",
						name: song.talents[0].talent.displayName,
						url: `https://holosongdb.com/talents/${song.talents[0].talentId}`,
					},
		url: `https://holosongdb.com/songs/${song.id}`,
		// 動画がある場合
		video: {
			"@type": "VideoObject",
			name: song.title,
			uploadDate: song.releaseDate,
			thumbnailUrl: `${song.jacketUrl}`,
			contentUrl: `${song.youtubeUrl}`,
		},
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
				name: "Songs",
				item: "https://holosongdb.com/songs",
			},
			{
				"@type": "ListItem",
				position: 3,
				name: song.title,
				item: `https://holosongdb.com/songs/${song.id}`,
			},
		],
	};

	return (
		<section className="max-w-4xl mx-auto pb-10">
			{/* 戻るボタン */}
			<BackButton
				className="my-6 flex text-blue-500 hover:underline"
				fallbackPath="/songs"
			>
				Back to List
			</BackButton>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				{/* YouTube埋め込みエリア */}
				{youtubeId ? (
					<div className="aspect-video w-full bg-black">
						<iframe
							width="100%"
							height="100%"
							src={`https://www.youtube.com/embed/${youtubeId}`}
							title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>
				) : (
					// 動画がない場合はジャケットを表示
					<div className="aspect-video w-full bg-gray-100 relative">
						{song.jacketUrl && (
							<Image
								src={song.jacketUrl}
								alt={song.title}
								fill
								className="object-contain"
							/>
						)}
					</div>
				)}

				{/* 情報エリア */}
				<div className="p-6 md:p-8">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
						<div>
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
								{song.title}
							</h1>
							<p className="text-gray-500">
								Released: {song.releaseDate} <span className="mx-2">•</span>{" "}
								{song.type}
							</p>
						</div>

						{/* YouTubeへの外部リンクボタン */}
						{song.youtubeUrl && (
							<a
								href={song.youtubeUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold hover:bg-red-700 transition-colors"
							>
								Watch on YouTube
							</a>
						)}
					</div>

					<hr className="border-gray-100 my-6" />

					{/* 参加タレント */}
					<div>
						<div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
							Performed by
						</div>
						<div className="flex flex-wrap gap-4">
							{song.talents.map(({ talent }) => (
								<Link
									href={`/talents/${talent.id}`}
									key={talent.id}
									className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors"
								>
									{talent.imageUrl ? (
										<div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
											<Image
												src={talent.imageUrl}
												alt={talent.displayName}
												fill
												sizes="(max-width: 768px) 128px, 160px"
												className="object-cover"
											/>
										</div>
									) : (
										<div className="w-10 h-10 rounded-full bg-gray-300" />
									)}
									<div>
										<p className="font-bold text-sm text-gray-900">
											{talent.displayName}
										</p>
										<p className="text-xs text-gray-500">{talent.generation}</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(songJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>
		</section>
	);
}
