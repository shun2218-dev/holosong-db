export default function Loading() {
	return (
		<div className="w-full animate-pulse">
			{/* ヘッダー周りのスケルトン */}
			<div className="flex justify-between items-center mb-8">
				<div className="h-8 bg-gray-200 rounded w-48"></div>
				<div className="h-10 bg-gray-200 rounded w-64"></div>
			</div>

			{/* カードグリッドのスケルトン */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map(
					(
						_,
						i, // 6個分ダミーを表示
					) => (
						<div
							key={i}
							className="bg-white rounded-lg p-4 border border-gray-100"
						>
							<div className="aspect-video w-full bg-gray-200 rounded-md mb-4"></div>
							<div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
							<div className="flex gap-2">
								<div className="h-6 w-16 bg-gray-200 rounded-full"></div>
								<div className="h-6 w-16 bg-gray-200 rounded-full"></div>
							</div>
						</div>
					),
				)}
			</div>
		</div>
	);
}
