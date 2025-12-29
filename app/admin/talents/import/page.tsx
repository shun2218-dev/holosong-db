// admin/talents/import/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import {
	checkExistingTalents,
	registerTalents,
	type TalentCandidate,
} from "./actions";

export default function TalentImportPage() {
	const [inputText, setInputText] = useState("");
	const [generation, setGeneration] = useState("その他");

	// 変更点1: TalentCandidate['branch'] を使って型定義 (JP | EN | ID | DEV_IS)
	const [branch, setBranch] = useState<TalentCandidate["branch"]>("JP");

	const [debouncedText] = useDebounce(inputText, 500);

	const [candidates, setCandidates] = useState<TalentCandidate[]>([]);
	const [existingNames, setExistingNames] = useState<Set<string>>(new Set());
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const processInput = async () => {
			const lines = debouncedText
				.split(/\n/)
				.map((line) => line.trim())
				.filter((line) => line.length > 0);

			const uniqueNames = Array.from(new Set(lines));

			if (uniqueNames.length === 0) {
				setCandidates([]);
				setExistingNames(new Set());
				return;
			}

			const existings = await checkExistingTalents(uniqueNames);
			setExistingNames(new Set(existings));

			const newCandidates: TalentCandidate[] = uniqueNames.map(
				(displayName) => ({
					displayName,
					generation: generation,
					branch: branch,
					slug: crypto.randomUUID(),
					youtubeChannelId: "UC_pending",
				}),
			);
			setCandidates(newCandidates);
		};

		processInput();
	}, [debouncedText, generation, branch]);

	const handleRegister = async () => {
		if (!confirm("表示されている【新規】タレントを登録しますか？")) return;
		setIsSubmitting(true);

		const validCandidates = candidates.filter(
			(c) => !existingNames.has(c.displayName),
		);

		try {
			const result = await registerTalents(validCandidates);
			alert(`${result.count}名のタレントを登録しました！`);
			setInputText("");
			setCandidates([]);
		} catch (e) {
			console.error(e);
			alert("登録中にエラーが発生しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto py-10 px-4">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-2xl font-bold text-gray-800">
					タレント クイック登録
				</h1>
				<a
					href="/admin/import"
					className="text-sm text-blue-600 hover:underline"
				>
					→ 楽曲インポートへ戻る
				</a>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* 左側：入力エリア */}
				<div className="space-y-4">
					<div className="bg-white p-6 rounded-lg shadow border border-gray-200">
						<label className="block text-sm font-bold text-gray-700 mb-2">
							1. Branch (所属)
						</label>
						<select
							value={branch}
							// 変更点2: e.target.value を TalentCandidate["branch"] にアサーション
							onChange={(e) =>
								setBranch(e.target.value as TalentCandidate["branch"])
							}
							className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
						>
							<option value="JP">JP</option>
							<option value="EN">EN</option>
							<option value="ID">ID</option>
							<option value="DEV_IS">DEV_IS</option>
						</select>

						<label className="block text-sm font-bold text-gray-700 mb-2">
							2. 期生を入力 (例: 3期生, FLOW GLOW)
						</label>
						<input
							type="text"
							value={generation}
							onChange={(e) => setGeneration(e.target.value)}
							className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder="期生を入力"
						/>

						<label className="block text-sm font-bold text-gray-700 mb-2">
							3. 名前を貼り付け (改行区切り)
						</label>
						<p className="text-xs text-gray-500 mb-2">
							楽曲インポート画面のエラーログなどから名前をコピーして貼り付けてください。
						</p>
						<textarea
							value={inputText}
							onChange={(e) => setInputText(e.target.value)}
							className="w-full h-64 border border-gray-300 rounded px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
							placeholder={`宝鐘マリン\n兎田ぺこら\n不知火フレア...`}
						/>
					</div>
				</div>

				{/* 右側：プレビューエリア */}
				<div className="space-y-4">
					<div className="bg-white p-6 rounded-lg shadow border border-gray-200 h-full flex flex-col">
						<h2 className="text-lg font-bold mb-4 flex justify-between items-center">
							<span>登録プレビュー</span>
							<span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded">
								新規:{" "}
								{
									candidates.filter((c) => !existingNames.has(c.displayName))
										.length
								}
								件
							</span>
						</h2>

						<div className="flex-1 overflow-y-auto border border-gray-100 rounded-md p-2 bg-gray-50 mb-4">
							{candidates.length === 0 ? (
								<p className="text-gray-400 text-center py-10">
									左側に名前を入力してください
								</p>
							) : (
								<ul className="space-y-1">
									{candidates.map((c, i) => {
										const exists = existingNames.has(c.displayName);
										return (
											<li
												key={i}
												className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
													exists
														? "bg-gray-200 text-gray-500"
														: "bg-white border border-blue-200 text-blue-700"
												}`}
											>
												<div className="flex flex-col">
													<span className="font-bold">{c.displayName}</span>
													<span className="text-xs text-gray-500">
														{c.branch} / {c.generation}
													</span>
												</div>
												<span className="text-xs ml-2">
													{exists ? "登録済" : "新規"}
												</span>
											</li>
										);
									})}
								</ul>
							)}
						</div>

						<button
							onClick={handleRegister}
							disabled={
								isSubmitting ||
								candidates.filter((c) => !existingNames.has(c.displayName))
									.length === 0
							}
							className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{isSubmitting ? "登録中..." : "新規タレントを登録"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
