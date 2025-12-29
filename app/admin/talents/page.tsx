import { asc, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { talents } from "@/db/schema";

export const dynamic = "force-dynamic"; // 常に最新のデータを取得

export default async function TalentListPage() {
	// タレントを全件取得 (Branch -> 期生 -> 名前 の順でソート)
	const allTalents = await db.query.talents.findMany({
		orderBy: [
			asc(talents.branch),
			asc(talents.generation),
			asc(talents.displayName),
		],
	});

	return (
		<div className="max-w-6xl mx-auto py-10 px-4">
			{/* ヘッダーエリア */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
				<div>
					<h1 className="text-2xl font-bold text-gray-800">タレント管理</h1>
					<p className="text-sm text-gray-500 mt-1">
						登録済みタレント: {allTalents.length}名
					</p>
				</div>
				<Link
					href="/admin/talents/import"
					className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition-colors text-sm"
				>
					+ 一括登録 (インポート)
				</Link>
			</div>

			{/* テーブルエリア */}
			<div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
				{allTalents.length === 0 ? (
					<div className="p-10 text-center text-gray-400">
						タレントが登録されていません。
						<br />
						<Link
							href="/admin/talents/import"
							className="text-blue-600 hover:underline mt-2 inline-block"
						>
							一括登録画面へ
						</Link>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
										アイコン
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										タレント名
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										所属 / 期生
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										ステータス (Slug / ID)
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										操作
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{allTalents.map((talent) => {
									// 仮データかどうかの判定（IDがpending、またはSlugがUUIDっぽい長さの場合など）
									const isPendingId = talent.youtubeChannelId === "UC_pending";
									// UUID(36文字)かどうかで簡易判定（厳密でなくて良いなら）
									const isSuspiciousSlug =
										talent.slug.length === 36 && talent.slug.includes("-");

									const needsAttention = isPendingId || isSuspiciousSlug;

									return (
										<tr key={talent.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
													{talent.imageUrl ? (
														<Image
															src={talent.imageUrl}
															alt={talent.displayName}
															fill
															className="object-cover"
															sizes="40px"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
															{talent.displayName.charAt(0)}
														</div>
													)}
												</div>
											</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-bold text-gray-900">
													{talent.displayName}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm text-gray-900">
													{talent.branch}
												</div>
												<div className="text-xs text-gray-500">
													{talent.generation}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{needsAttention ? (
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
														要設定
													</span>
												) : (
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
														OK
													</span>
												)}
												<div className="text-xs text-gray-400 mt-1 font-mono max-w-[150px] truncate">
													{talent.slug}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
												<Link
													href={`/admin/talents/${talent.id}`}
													className="text-blue-600 hover:text-blue-900 font-bold"
												>
													編集
												</Link>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
