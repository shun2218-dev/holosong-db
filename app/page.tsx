import { FilterTabs } from "@/components/FilterTabs";
import { SearchInput } from "@/components/SearchInput";
import { SongList } from "@/components/SongList";
import { getSongs } from "./actions";

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

	// 1ページ目のデータをサーバー側で取得
	const initialSongs = await getSongs(1, query, type);

	// 2ページ目以降を取得する関数を定義
	const fetchMoreSongs = async (page: number) => {
		"use server";
		return getSongs(page, query, type);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-2xl font-bold text-gray-900">Latest Songs</h1>

				<div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
					<div className="w-full md:w-64">
						<SearchInput />
					</div>
					<FilterTabs />
				</div>
			</div>

			{/* リスト表示とLoad More機能 */}
			<SongList
				key={`${query}-${type}`}
				initialSongs={initialSongs}
				fetcher={fetchMoreSongs}
			/>
		</div>
	);
}
