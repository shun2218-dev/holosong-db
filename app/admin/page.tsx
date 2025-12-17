import { db } from "@/db";
import { talents } from "@/db/schema";
import { addNewSong } from "./actions";

export default async function AdminPage() {
  // タレント一覧を取得（セレクトボックス用）
  const allTalents = await db.select().from(talents);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">楽曲登録 (Admin)</h1>
      
      <form action={addNewSong} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
        
        {/* タイトル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">曲名</label>
          <input name="title" type="text" required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        {/* Youtube URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
          <input name="youtubeUrl" type="url" className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        {/* リリース日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">リリース日</label>
          <input name="releaseDate" type="date" required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>

        {/* ジャケット画像 (Blobへアップロード) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ジャケット画像</label>
          <input name="jacketImage" type="file" accept="image/*" className="w-full text-sm text-gray-500" />
        </div>

        {/* 参加タレント (簡易的に複数選択可能にする) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">参加タレント (Ctrl/Cmd押しながら複数選択)</label>
          <select name="talentIds" multiple className="w-full border border-gray-300 rounded px-3 py-2 h-40">
            {allTalents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.generation})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors">
          登録する
        </button>
      </form>
    </div>
  );
}