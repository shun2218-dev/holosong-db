"use client";

import { useState } from "react";
import {
	deleteTalent,
	type UpdateTalentSchema,
	updateTalent,
} from "@/app/admin/talents/[id]/actions";

// 表示用の型定義
type Talent = {
	id: string;
	displayName: string;
	slug: string;
	youtubeChannelId: string;
	branch: "JP" | "EN" | "ID" | "DEV_IS";
	generation: string;
};

export default function TalentEditForm({ talent }: { talent: Talent }) {
	const [formData, setFormData] = useState<UpdateTalentSchema>({
		displayName: talent.displayName,
		slug: talent.slug,
		youtubeChannelId: talent.youtubeChannelId,
		branch: talent.branch as "JP" | "EN" | "ID" | "DEV_IS",
		generation: talent.generation,
	});

	const [isSaving, setIsSaving] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!confirm("この内容で保存しますか？")) return;

		setIsSaving(true);
		try {
			await updateTalent(talent.id, formData);
			alert("更新しました！");
		} catch (error) {
			console.error(error);
			alert("エラーが発生しました");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("本当に削除しますか？取り消せません。")) return;
		await deleteTalent(talent.id);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200"
		>
			{/* 名前 */}
			<div>
				<label className="block text-sm font-bold text-gray-700 mb-1">
					タレント名
				</label>
				<input
					type="text"
					name="displayName"
					value={formData.displayName}
					onChange={handleChange}
					className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Branch */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Branch (所属)
					</label>
					<select
						name="branch"
						value={formData.branch}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="JP">JP</option>
						<option value="EN">EN</option>
						<option value="ID">ID</option>
						<option value="DEV_IS">DEV_IS</option>
					</select>
				</div>

				{/* Generation */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						期生
					</label>
					<input
						type="text"
						name="generation"
						value={formData.generation}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* 重要なID系フィールド */}
			<div className="bg-yellow-50 p-4 rounded border border-yellow-200 space-y-4">
				<h3 className="font-bold text-yellow-800 text-sm">
					システム設定 (要修正)
				</h3>

				{/* Slug */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						Slug (URL識別子) <span className="text-red-500">*</span>
					</label>
					<p className="text-xs text-gray-500 mb-1">
						例: marine-houshou (半角英数ハイフン)
					</p>
					<input
						type="text"
						name="slug"
						value={formData.slug}
						onChange={handleChange}
						className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
						required
					/>
				</div>

				{/* Channel ID */}
				<div>
					<label className="block text-sm font-bold text-gray-700 mb-1">
						YouTube Channel ID <span className="text-red-500">*</span>
					</label>
					<p className="text-xs text-gray-500 mb-1">例: UCcCNT...</p>
					<div className="flex gap-2">
						<input
							type="text"
							name="youtubeChannelId"
							value={formData.youtubeChannelId}
							onChange={handleChange}
							className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
							required
						/>
						{formData.youtubeChannelId &&
							formData.youtubeChannelId !== "UC_pending" && (
								<a
									href={`https://www.youtube.com/channel/${formData.youtubeChannelId}`}
									target="_blank"
									rel="noreferrer"
									className="bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center hover:bg-red-700"
								>
									確認
								</a>
							)}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between pt-4 border-t border-gray-100">
				<button
					type="button"
					onClick={handleDelete}
					className="text-red-600 text-sm hover:underline"
				>
					このタレントを削除
				</button>

				<button
					type="submit"
					disabled={isSaving}
					className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
				>
					{isSaving ? "保存中..." : "変更を保存"}
				</button>
			</div>
		</form>
	);
}
