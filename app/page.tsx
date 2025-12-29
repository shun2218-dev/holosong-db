import { ArrowRight, Info, Music, Users } from "lucide-react"; // アイコン用にlucide-reactを使用（なければ省略可）
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-[calc(100vh-4rem)]">
			{/* ヒーローセクション */}
			<section className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
				<h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
					HoloSong DB{" "}
					<span className="text-blue-600 text-2xl md:text-4xl block mt-2">
						非公式ファンデータベース
					</span>
				</h1>
				<p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
					推しの歌枠やオリジナル曲を簡単に検索。
					<br />
					タレントごとの歌唱データをアーカイブしています。
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link
						href="/songs"
						className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
					>
						<Music className="w-5 h-5 mr-2" />
						楽曲を探す
					</Link>
					<Link
						href="/about"
						className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
					>
						サイトについて
					</Link>
				</div>
			</section>

			{/* 機能紹介セクション */}
			<section className="py-16 px-4 max-w-6xl mx-auto w-full">
				<h2 className="text-2xl font-bold text-center mb-12 text-gray-800">
					Contents
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					{/* Songs Card */}
					<Link href="/songs" className="group">
						<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col items-center text-center group-hover:-translate-y-1">
							<div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
								<Music className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								Song Database
							</h3>
							<p className="text-gray-500 mb-4 flex-grow">
								歌枠、オリジナル曲、カバー曲など、膨大な楽曲データから検索できます。
							</p>
							<span className="text-blue-600 font-medium inline-flex items-center group-hover:underline">
								楽曲一覧へ <ArrowRight className="w-4 h-4 ml-1" />
							</span>
						</div>
					</Link>

					{/* Talents Card */}
					<Link href="/talents" className="group">
						<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col items-center text-center group-hover:-translate-y-1">
							<div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
								<Users className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">Talents</h3>
							<p className="text-gray-500 mb-4 flex-grow">
								タレントごとのプロフィールや歌唱履歴を確認できます。
							</p>
							<span className="text-green-600 font-medium inline-flex items-center group-hover:underline">
								タレント一覧へ <ArrowRight className="w-4 h-4 ml-1" />
							</span>
						</div>
					</Link>

					{/* About Card */}
					<Link href="/about" className="group">
						<div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col items-center text-center group-hover:-translate-y-1">
							<div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 mb-4 group-hover:bg-gray-600 group-hover:text-white transition-colors">
								<Info className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">About</h3>
							<p className="text-gray-500 mb-4 flex-grow">
								このサイトの目的、使い方、免責事項などを掲載しています。
							</p>
							<span className="text-gray-600 font-medium inline-flex items-center group-hover:underline">
								詳細を見る <ArrowRight className="w-4 h-4 ml-1" />
							</span>
						</div>
					</Link>
				</div>
			</section>
		</div>
	);
}
