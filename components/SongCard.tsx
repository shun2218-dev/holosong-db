import Image from "next/image";
import Link from "next/link";

// 表示に必要なデータの型定義
export type SongWithTalents = {
	id: string;
	title: string;
	releaseDate: string | null;
	jacketUrl: string | null;
	talents: {
		talent: {
			id: string;
			displayName: string;
		};
	}[];
};

interface SongCardProps {
	song: SongWithTalents;
	highlightTalentId?: string;
	priority?: boolean;
}

export function SongCard({ song, highlightTalentId, priority }: SongCardProps) {
	return (
		<Link
			href={`/songs/${song.id}`}
			className="group block bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-md transition-shadow"
		>
			<div className="relative aspect-video w-full bg-gray-200 rounded-md mb-4 overflow-hidden">
				{song.jacketUrl ? (
					<Image
						src={song.jacketUrl}
						alt={song.title}
						fill
						priority={priority}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="flex items-center justify-center h-full text-gray-400">
						No Image
					</div>
				)}
			</div>

			<h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
				{song.title}
			</h3>
			<p className="text-sm text-gray-500 mb-3">{song.releaseDate}</p>

			<div className="flex flex-wrap gap-1">
				{song.talents.map(({ talent }) => (
					<span
						key={talent.id}
						className={`text-xs px-2 py-1 rounded-full ${
							talent.id === highlightTalentId
								? "bg-blue-600 text-white"
								: "bg-gray-100 text-gray-600"
						}`}
					>
						{talent.displayName}
					</span>
				))}
			</div>
		</Link>
	);
}
