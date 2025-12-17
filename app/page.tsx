import { db } from "@/db";
import { songs } from "@/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";

export default async function Home() {
  // 楽曲データを取得 (タレント情報も一緒に取得)
  const allSongs = await db.query.songs.findMany({
    with: {
      talents: {
        with: {
          talent: true,
        },
      },
    },
    orderBy: [desc(songs.releaseDate)], // 新しい順
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Latest Songs</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allSongs.map((song) => (
          <div key={song.id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
            {/* ジャケット画像 (なければプレースホルダー) */}
            <div className="relative aspect-video w-full bg-gray-200 rounded-md mb-4 overflow-hidden">
                {song.jacketUrl ? (
                  <Image 
                    src={song.jacketUrl} 
                    alt={song.title} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
            </div>

            {/* 曲情報 */}
            <h2 className="text-xl font-bold mb-2">{song.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{song.releaseDate}</p>

            {/* 参加タレント */}
            <div className="flex flex-wrap gap-2">
              {song.talents.map(({ talent }) => (
                <span key={talent.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {talent.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}