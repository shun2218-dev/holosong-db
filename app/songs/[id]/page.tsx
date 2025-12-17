import { db } from "@/db";
import { songs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getYoutubeId } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15/16ではparamsはPromise型になります
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

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* 戻るボタン */}
      <Link href="/" className="inline-block mb-6 text-sm text-gray-500 hover:text-blue-500 transition-colors">
        ← Back to list
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* YouTube埋め込みエリア */}
        {youtubeId ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          // 動画がない場合はジャケットを表示
          <div className="aspect-video w-full bg-gray-100 relative">
             {song.jacketUrl && (
               <Image src={song.jacketUrl} alt={song.title} fill className="object-contain" />
             )}
          </div>
        )}

        {/* 情報エリア */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{song.title}</h1>
              <p className="text-gray-500">
                Released: {song.releaseDate} <span className="mx-2">•</span> {song.type}
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
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Performed by
            </h3>
            <div className="flex flex-wrap gap-4">
              {song.talents.map(({ talent }) => (
                <Link
                  href={`/talents/${talent.id}`}
                  key={talent.id}
                  className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  {talent.imageUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image src={talent.imageUrl} alt={talent.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300" />
                  )}
                  <div>
                    <p className="font-bold text-sm text-gray-900">{talent.name}</p>
                    <p className="text-xs text-gray-500">{talent.generation}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}