import { FilterTabs } from "@/components/FilterTabs";
import { SearchInput } from "@/components/SearchInput";
import { db } from "@/db";
import { songs } from "@/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

// 検索パラメータの型定義
interface SearchParamsProps {
	searchParams: Promise<{
		q?: string;
		type?: string;
	}>;
}

export default async function Home({ searchParams }: SearchParamsProps) {
	const params = await searchParams;
	const query = params.q || "";
	const type = params.type || "all";

	// Drizzleの検索条件を動的に構築
	const allSongs = await db.query.songs.findMany({
		with: {
			talents: {
				with: {
					talent: true,
				},
			},
		},
		where: (songs, { and, ilike, eq }) => {
			const conditions = [];

			// 検索ワードがある場合 (大文字小文字無視の部分一致)
			if (query) {
				conditions.push(ilike(songs.title, `%${query}%`));
			}

			// タイプ指定がある場合
			if (type !== "all") {
				conditions.push(eq(songs.type, type));
			}

			// 条件があればANDで結合、なければundefined (全件)
			return conditions.length > 0 ? and(...conditions) : undefined;
		},
		orderBy: [desc(songs.releaseDate)],
	});

	return (
		<div>
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Latest Songs</h1>

				{/* 検索・フィルターエリア */}
				<div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
					<div className="w-full md:w-64">
						<SearchInput />
					</div>
					<FilterTabs />
				</div>
			</div>

			{/* 検索結果が0件の場合の表示 */}
			{allSongs.length === 0 ? (
				<div className="text-center py-20 text-gray-500">
					<p className="text-xl">No songs found.</p>
					<p className="text-sm">Try adjusting your search or filters.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{allSongs.map((song) => (
						<Link
							href={`/songs/${song.id}`}
							key={song.id}
							className="group block bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow"
						>
							{/* ジャケット画像 */}
							<div className="relative aspect-video w-full bg-gray-200 rounded-md mb-4 overflow-hidden">
								{song.jacketUrl ? (
									<Image
										src={song.jacketUrl}
										alt={song.title}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-300" // ホバー時に拡大エフェクト
									/>
								) : (
									<div className="flex items-center justify-center h-full text-gray-400">
										No Image
									</div>
								)}
							</div>

							{/* 曲情報 */}
							<h2 className="text-xl font-bold mb-2">{song.title}</h2>
							<p className="text-sm text-gray-500 mb-4">{song.releaseDate}</p>

							{/* 参加タレント */}
							<div className="flex flex-wrap gap-2">
								{song.talents.map(({ talent }) => (
									<object key={talent.id}>
										<Link
											href={`/talents/${talent.id}`}
											className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors block"
										>
											{talent.name}
										</Link>
									</object>
								))}
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
