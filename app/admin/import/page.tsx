"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	getImportHelpers,
	type ImportItem,
	registerImportData,
} from "./actions";

// Wikiから取得した生データの型
type RawWikiData = {
	title: string;
	content: string;
};

export default function ImportPage() {
	const router = useRouter();
	const [fileData, setFileData] = useState<ImportItem[]>([]);

	const [helpers, setHelpers] = useState<{
		talentMap: Record<string, string>;
		existingUrls: string[];
	} | null>(null);

	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		getImportHelpers().then(setHelpers);
	}, []);

	const parseWikiContent = (title: string, content: string): ImportItem => {
		const urlMatch =
			content.match(
				/href=\\"(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/,
			) ||
			content.match(
				/(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+)/,
			);

		const dateMatch = content.match(/音源公開日：(\d{4}\/\d{2}\/\d{2})/);

		let singers: string[] = [];
		const memberMatch = content.match(/メンバー：(.*?)(?:<br>|\\n)/);
		if (memberMatch) {
			const rawMembers = memberMatch[1];
			const innerParen = rawMembers.match(/\((.*?)\)/);
			const targetString = innerParen ? innerParen[1] : rawMembers;

			singers = targetString
				.split(/[,、]/)
				.map((s) =>
					s
						.trim()
						.replace(/\(.*\)/g, "")
						.replace(/<.*?>/g, ""),
				)
				.filter((s) => s.length > 0 && s !== "他");
		}

		return {
			title: title.trim(),
			youtubeUrl: urlMatch ? urlMatch[1] : null,
			releaseDate: dateMatch ? dateMatch[1] : null,
			type: "original",
			singers: singers,
		};
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			try {
				const json = JSON.parse(event.target?.result as string);

				if (Array.isArray(json)) {
					const parsedData = json.map((item: unknown) => {
						if (
							typeof item === "object" &&
							item !== null &&
							"content" in item &&
							"title" in item
						) {
							const wikiItem = item as RawWikiData;
							return parseWikiContent(wikiItem.title, wikiItem.content);
						}
						return item as ImportItem;
					});
					setFileData(parsedData);
				} else {
					alert("JSONフォーマットが配列ではありません");
				}
			} catch (err) {
				console.error(err);
				alert("JSONの読み込みに失敗しました");
			}
		};
		reader.readAsText(file);
	};

	// データの編集ハンドラ
	const handleEdit = (
		index: number,
		field: keyof ImportItem,
		value: string,
	) => {
		const newData = [...fileData];
		if (field === "singers") {
			// カンマか読点で分割して配列に戻す
			newData[index] = {
				...newData[index],
				singers: value
					.split(/[,、]/)
					.map((s) => s.trim())
					.filter(Boolean),
			};
		} else {
			newData[index] = { ...newData[index], [field]: value };
		}
		setFileData(newData);
	};

	const handleRegister = async () => {
		if (!confirm("表示されている有効なデータを登録しますか？")) return;
		setIsUploading(true);

		const validItems = fileData.filter((item) => {
			const status = getStatus(item);
			return status === "ok" || status === "warning";
		});

		const result = await registerImportData(validItems);
		alert(`${result.count}件の登録が完了しました！`);

		setIsUploading(false);
		router.push("/admin");
	};

	const getStatus = (item: ImportItem) => {
		if (!item.youtubeUrl) return "error_no_url";
		if (helpers?.existingUrls.includes(item.youtubeUrl)) return "duplicate";
		const unknownTalents = item.singers.filter((s) => !helpers?.talentMap[s]);
		if (unknownTalents.length > 0) return "warning";
		return "ok";
	};

	if (!helpers)
		return (
			<div className="p-10 text-center text-gray-500">Loading helpers...</div>
		);

	return (
		<div className="max-w-[90%] mx-auto py-10 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold text-gray-800">
					楽曲データ 一括インポート
				</h1>
				<a href="/admin" className="text-sm text-gray-500 hover:text-blue-600">
					← 管理画面へ戻る
				</a>
			</div>

			<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8">
				<label className="block mb-2 font-bold text-gray-700">
					JSONファイルを選択
				</label>
				<input
					type="file"
					accept=".json"
					onChange={handleFileChange}
					className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
				/>
			</div>

			{fileData.length > 0 && (
				<>
					<div className="flex justify-between items-center mb-4 sticky top-0 bg-white/90 backdrop-blur py-4 z-10 border-b border-gray-100">
						<h2 className="text-lg font-bold">
							プレビュー: {fileData.length}件
							<span className="text-sm font-normal text-gray-500 ml-2">
								(有効:{" "}
								{
									fileData.filter(
										(i) => getStatus(i) === "ok" || getStatus(i) === "warning",
									).length
								}
								件)
							</span>
						</h2>
						<button
							onClick={handleRegister}
							disabled={isUploading}
							className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
						>
							{isUploading ? "登録中..." : "有効なデータを登録実行"}
						</button>
					</div>

					<div className="overflow-hidden bg-white rounded-lg shadow border border-gray-200">
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left whitespace-nowrap">
								<thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
									<tr>
										<th className="px-4 py-3 w-20">状態</th>
										<th className="px-4 py-3 w-64">タイトル (編集可)</th>
										<th className="px-4 py-3 w-32">公開日</th>
										<th className="px-4 py-3 min-w-[300px]">
											参加タレント (カンマ区切りで編集可)
										</th>
										<th className="px-4 py-3">備考 (エラー詳細)</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{fileData.map((item, idx) => {
										const status = getStatus(item);
										const unknownTalents = item.singers.filter(
											(s) => !helpers?.talentMap[s],
										);

										let statusBadge;
										let rowClass = "hover:bg-gray-50 transition-colors";

										switch (status) {
											case "duplicate":
												rowClass = "bg-gray-100 text-gray-400";
												statusBadge = (
													<span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
														登録済
													</span>
												);
												break;
											case "warning":
												rowClass = "bg-yellow-50";
												statusBadge = (
													<span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">
														一部不明
													</span>
												);
												break;
											case "error_no_url":
												rowClass = "bg-red-50";
												statusBadge = (
													<span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
														URLなし
													</span>
												);
												break;
											default:
												statusBadge = (
													<span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
														OK
													</span>
												);
										}

										return (
											<tr key={idx} className={rowClass}>
												<td className="px-4 py-3 align-top pt-4">
													{statusBadge}
												</td>

												{/* タイトル編集 */}
												<td className="px-4 py-3 align-top">
													<input
														type="text"
														value={item.title}
														onChange={(e) =>
															handleEdit(idx, "title", e.target.value)
														}
														className="w-full bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none px-1"
													/>
												</td>

												<td className="px-4 py-3 font-mono text-xs align-top pt-4">
													{item.releaseDate}
												</td>

												{/* タレント編集エリア */}
												<td className="px-4 py-3 align-top">
													<input
														type="text"
														value={item.singers.join("、")}
														onChange={(e) =>
															handleEdit(idx, "singers", e.target.value)
														}
														className={`w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 ${unknownTalents.length > 0 ? "bg-red-50 border-red-300" : "border-gray-300"}`}
														placeholder="タレント名、タレント名..."
													/>
													<div className="flex flex-wrap gap-1">
														{item.singers.map((s, i) => (
															<span
																key={i}
																className={`px-2 py-0.5 rounded text-xs border ${
																	helpers.talentMap[s]
																		? "bg-green-50 border-green-200 text-green-700"
																		: "bg-red-100 border-red-300 text-red-700 font-bold"
																}`}
															>
																{s}
															</span>
														))}
													</div>
												</td>

												{/* 備考（エラーメッセージ） */}
												<td className="px-4 py-3 text-xs align-top pt-4">
													{status === "error_no_url" && (
														<span className="text-red-500">
															YouTube URLが取得できませんでした
														</span>
													)}
													{status === "duplicate" && (
														<span className="text-gray-500">
															URLが既にDBに存在します
														</span>
													)}
													{unknownTalents.length > 0 && (
														<span className="text-red-600 font-bold">
															未登録のタレント: {unknownTalents.join(", ")}
														</span>
													)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
