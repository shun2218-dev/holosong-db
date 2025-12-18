"use client";

import { useState } from "react";
import { SongCard, type SongWithTalents } from "./SongCard";

interface SongListProps {
	initialSongs: SongWithTalents[];
	// ページ番号を受け取ってデータを返す関数 (Server Action)
	fetcher: (page: number) => Promise<SongWithTalents[]>;
	highlightTalentId?: string;
}

export function SongList({
	initialSongs,
	fetcher,
	highlightTalentId,
}: SongListProps) {
	const [songs, setSongs] = useState<SongWithTalents[]>(initialSongs);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(initialSongs.length >= 12);
	const [isLoading, setIsLoading] = useState(false);

	const loadMore = async () => {
		setIsLoading(true);
		const nextPage = page + 1;

		try {
			const newSongs = await fetcher(nextPage);

			if (newSongs.length === 0) {
				setHasMore(false);
			} else {
				setSongs((prev) => [...prev, ...newSongs]);
				setPage(nextPage);
				// 取得数が12件未満なら、もう次は無いと判断
				if (newSongs.length < 12) {
					setHasMore(false);
				}
			}
		} catch (error) {
			console.error("Failed to load more songs:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (songs.length === 0) {
		return (
			<div className="text-center py-20 text-gray-500">
				<p className="text-xl">No songs found.</p>
				<p className="text-sm">Try adjusting your search or filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{songs.map((song) => (
					<SongCard
						key={song.id}
						song={song}
						highlightTalentId={highlightTalentId}
					/>
				))}
			</div>

			{hasMore && (
				<div className="mt-10 text-center">
					<button
						onClick={loadMore}
						disabled={isLoading}
						className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-8 rounded-full shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
					>
						{isLoading ? "Loading..." : "Load More"}
					</button>
				</div>
			)}
		</>
	);
}
