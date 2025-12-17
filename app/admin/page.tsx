import { db } from "@/db";
import { songs, talents } from "@/db/schema";
import { addNewSong, deleteSong } from "./actions";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function AdminPage() {
	// タレント一覧を取得（セレクトボックス用）
	const allTalents = await db.select().from(talents);

	// 登録済み楽曲を全件取得（一覧表示用）
	const allSongs = await db.query.songs.findMany({
		orderBy: [desc(songs.releaseDate)],
	});

	return (
		<div className="max-w-4xl mx-auto py-10">
			<div className="grid md:grid-cols-2 gap-10">
				{/* 左側：新規登録フォーム */}
				<div>
					<h1 className="text-2xl font-bold mb-6">楽曲登録</h1>
					<form
						action={addNewSong}
						className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200"
					>
						{/* タイトル */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								曲名
							</label>
							<input
								name="title"
								type="text"
								required
								className="w-full border border-gray-300 rounded px-3 py-2"
							/>
						</div>

						{/* Youtube URL */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								YouTube URL
							</label>
							<input
								name="youtubeUrl"
								type="url"
								className="w-full border border-gray-300 rounded px-3 py-2"
							/>
						</div>

						{/* リリース日 */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								リリース日
							</label>
							<input
								name="releaseDate"
								type="date"
								required
								className="w-full border border-gray-300 rounded px-3 py-2"
							/>
						</div>

						{/* ジャケット画像 (Blobへアップロード) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								ジャケット画像
							</label>
							<input
								name="jacketImage"
								type="file"
								accept="image/*"
								className="w-full text-sm text-gray-500"
							/>
						</div>

						{/* 参加タレント (簡易的に複数選択可能にする) */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								参加タレント (Ctrl/Cmd押しながら複数選択)
							</label>
							<select
								name="talentIds"
								multiple
								className="w-full border border-gray-300 rounded px-3 py-2 h-40"
							>
								{allTalents.map((t) => (
									<option key={t.id} value={t.id}>
										{t.name} ({t.generation})
									</option>
								))}
							</select>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors"
						>
							登録する
						</button>
					</form>
				</div>

				{/* 右側：楽曲リスト (新規追加部分) */}
				<div>
					<h2 className="text-2xl font-bold mb-6">
						登録済み一覧 ({allSongs.length})
					</h2>
					<div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
						{allSongs.map((song) => (
							<div
								key={song.id}
								className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
							>
								{/* 画像 */}
								<div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
									{song.jacketUrl && (
										<Image
											src={song.jacketUrl}
											alt={song.title}
											fill
											className="object-cover"
										/>
									)}
								</div>

								{/* 情報 */}
								<div className="flex-1 min-w-0">
									<h3 className="font-bold text-sm truncate">{song.title}</h3>
									<p className="text-xs text-gray-500">{song.releaseDate}</p>
								</div>

								{/* アクションボタン */}
								<div className="flex flex-col gap-2">
									<Link
										href={`/admin/edit/${song.id}`}
										className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 text-center"
									>
										Edit
									</Link>

									{/* 削除ボタンフォーム */}
									<form action={deleteSong.bind(null, song.id)}>
										<button
											type="submit"
											className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 w-full"
											// 確認ダイアログを出す簡単な方法 (React hooks不要)
										>
											Delete
										</button>
									</form>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
