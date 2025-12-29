import Link from "next/link";

export default function AboutPage() {
	return (
		<div className="max-w-3xl mx-auto py-16 px-4">
			<div className="text-center mb-12">
				<h1 className="text-3xl font-bold text-gray-900 mb-4">
					About This Site
				</h1>
				<p className="text-gray-500">このサイトについて</p>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
				<section>
					<h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
						概要
					</h2>
					<p className="text-gray-600 leading-relaxed">
						HoloSong
						DBは、VTuberの歌唱データ（歌枠、オリジナル曲、カバー曲）を検索・閲覧できる非公式ファンサイトです。
						「あの曲を誰が歌っていたか？」「推しが最近何を歌ったか？」を簡単に探せるようにすることを目的に開発されました。
					</p>
				</section>

				<section>
					<h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
						機能紹介
					</h2>
					<ul className="list-disc list-inside text-gray-600 space-y-2 ml-2">
						<li>
							<span className="font-bold text-gray-800">楽曲検索:</span>{" "}
							曲名やアーティスト名から歌唱データを検索できます。
						</li>
						<li>
							<span className="font-bold text-gray-800">タレント別表示:</span>{" "}
							特定のタレントが歌った曲を一覧表示します。
						</li>
						<li>
							<span className="font-bold text-gray-800">YouTube再生:</span>{" "}
							リンクから直接アーカイブの該当箇所へ飛ぶことができます。
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
						免責事項
					</h2>
					<div className="text-gray-600 text-sm space-y-3 bg-gray-50 p-4 rounded-lg">
						<p>
							当サイトは非公式のファンサイトであり、カバー株式会社およびホロライブプロダクションとは一切関係ありません。
						</p>
						<p>
							掲載されている動画・画像の著作権は、各権利所有者に帰属します。
							当サイトの利用により生じた損害について、管理者は一切の責任を負いません。
						</p>
						<p>
							データの誤りや不具合を見つけた場合は、開発者までご連絡ください。
						</p>
					</div>
				</section>

				<div className="pt-6 text-center">
					<Link href="/" className="text-blue-600 hover:underline font-medium">
						トップページに戻る
					</Link>
				</div>
			</div>
		</div>
	);
}
