import { db } from "@/db";
import { songs, talents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateSong } from "../../actions"; // actionsからインポート
import { notFound } from "next/navigation";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSongPage({ params }: PageProps) {
  const { id } = await params;

  // 編集対象の曲データと、全タレント（選択肢用）を取得
  const song = await db.query.songs.findFirst({
    where: eq(songs.id, id),
    with: {
      talents: true, // 紐づいているタレントIDを知るため
    }
  });

  if (!song) notFound();

  const allTalents = await db.select().from(talents);
  const connectedTalentIds = song.talents.map(t => t.talentId);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">楽曲情報の編集</h1>
      
      <form action={updateSong} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
        {/* IDを隠しフィールドで送る */}
        <input type="hidden" name="id" value={song.id} />

        {/* 曲名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">曲名</label>
          <input 
            name="title" 
            type="text" 
            required 
            defaultValue={song.title}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* Youtube URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
          <input 
            name="youtubeUrl" 
            type="url" 
            defaultValue={song.youtubeUrl || ""}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* リリース日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">リリース日</label>
          <input 
            name="releaseDate" 
            type="date" 
            required 
            // date inputには "YYYY-MM-DD" 形式の文字列が必要
            defaultValue={song.releaseDate ? new Date(song.releaseDate).toISOString().split('T')[0] : ""}
            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        {/* ジャケット画像 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ジャケット画像 (変更する場合のみ選択)</label>
          {song.jacketUrl && (
            <div className="mb-2 relative w-20 h-20">
              <Image src={song.jacketUrl} alt="Current Jacket" fill className="object-cover rounded" />
            </div>
          )}
          <input 
            name="jacketImage" 
            type="file" 
            accept="image/*" 
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
          />
        </div>

        {/* 参加タレント */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            参加タレント (Ctrl/Commandキーを押しながらクリックで複数選択)
          </label>
          <select 
            name="talentIds" 
            multiple 
            defaultValue={connectedTalentIds}
            className="w-full border border-gray-300 rounded px-3 py-2 h-48 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allTalents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.generation})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors"
          >
            更新する
          </button>
          <a href="/admin" className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">
            キャンセル
          </a>
        </div>
      </form>
    </div>
  );
}