import { db } from "@/db";
import { talents } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function TalentDetailPage({ params }: PageProps) {
	const { id } = await params;

	// タレント情報と、紐づく楽曲(中間テーブル経由)を取得
	const talentData = await db.query.talents.findFirst({
		where: eq(talents.id, id),
		with: {
			songs: {
				with: {
					song: {
						with: {
							// 曲と一緒に、一緒に歌っている他のタレントも取得（表示用）
							talents: {
								with: {
									talent: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!talentData) {
		notFound();
	}

	// 取得データから楽曲リストだけを取り出しやすい形に整理
	const songList = talentData.songs.map((item) => item.song);

	return (
		<div>
			{/* タレントプロフィール部分 */}
			<div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
				<div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-100 shadow-inner">
					{talentData.imageUrl && (
						<Image
							src={talentData.imageUrl}
							alt={talentData.name}
							fill
							className="object-cover"
						/>
					)}
				</div>
				<div className="text-center md:text-left">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						{talentData.name}
					</h1>
					<p className="text-lg text-gray-500 mb-4">{talentData.generation}</p>
					<div className="text-sm text-gray-400">
						Participated in{" "}
						<span className="font-bold text-gray-900">{songList.length}</span>{" "}
						songs
					</div>
				</div>
			</div>

			{/* 参加楽曲リスト */}
			<h2 className="text-xl font-bold text-gray-900 mb-6">Song List</h2>

			{songList.length === 0 ? (
				<p className="text-gray-500">No songs registered yet.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{songList.map((song) => (
						<Link
							href={`/songs/${song.id}`}
							key={song.id}
							className="group block bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow"
						>
							<div className="relative aspect-video w-full bg-gray-200 rounded-md mb-4 overflow-hidden">
								{song.jacketUrl ? (
									<Image
										src={song.jacketUrl}
										alt={song.title}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="flex items-center justify-center h-full text-gray-400">
										No Image
									</div>
								)}
							</div>

							<h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">
								{song.title}
							</h3>
							<p className="text-sm text-gray-500 mb-3">{song.releaseDate}</p>

							{/* 一緒に歌っているタレント表示 */}
							<div className="flex flex-wrap gap-1">
								{song.talents.map((t) => (
									<span
										key={t.talentId}
										className={`text-xs px-2 py-1 rounded-full ${t.talentId === talentData.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
									>
										{t.talent.name}
									</span>
								))}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
