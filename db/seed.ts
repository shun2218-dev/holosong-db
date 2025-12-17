import { db } from './index';
import { talents, songs, songTalents } from './schema';

async function main() {
  console.log('🌱 Seeding start...');

  // 1. 既存データの削除 (外部キー制約があるため子テーブルから消す)
  await db.delete(songTalents);
  await db.delete(songs);
  await db.delete(talents);

  // 2. タレントの作成
  const [suisei] = await db.insert(talents).values({
    name: '星街すいせい',
    generation: '0期生',
    imageUrl: 'https://hololive.hololivepro.com/wp-content/uploads/2020/06/Hoshimachi-Suisei_list_thumb.png',
  }).returning();

  const [marine] = await db.insert(talents).values({
    name: '宝鐘マリン',
    generation: '3期生',
    imageUrl: 'https://hololive.hololivepro.com/wp-content/uploads/2020/06/Houshou-Marine_list_thumb.png',
  }).returning();

  console.log('✨ Talents created');

  // 3. 楽曲の作成
  const [stellar] = await db.insert(songs).values({
    title: 'Stellar Stellar',
    releaseDate: '2021-09-29',
    type: 'original',
    youtubeUrl: 'https://www.youtube.com/watch?v=a51VH9BYzZA',
  }).returning();

  const [bishojo] = await db.insert(songs).values({
    title: '美少女無罪♡パイレーツ',
    releaseDate: '2023-07-30',
    type: 'original',
    youtubeUrl: 'https://www.youtube.com/watch?v=KfZR9jVP6tw',
  }).returning();

  console.log('🎵 Songs created');

  // 4. 紐付け (中間テーブル)
  await db.insert(songTalents).values([
    { songId: stellar.id, talentId: suisei.id },
    { songId: bishojo.id, talentId: marine.id },
  ]);

  console.log('🔗 Relations created');
  console.log('✅ Seeding finished!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});