import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center py-20 text-center">
			<h2 className="text-6xl font-extrabold text-gray-200 mb-4">404</h2>
			<h3 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h3>
			<p className="text-gray-500 mb-8">
				お探しのページや楽曲は見つかりませんでした。
			</p>
			<Link
				href="/"
				className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors"
			>
				トップページに戻る
			</Link>
		</div>
	);
}
