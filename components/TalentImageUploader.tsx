"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { updateTalentImage } from "@/app/admin/talents/[id]/actions";

type Props = {
	talentId: string;
	currentImageUrl: string | null;
	displayName: string;
};

export default function TalentImageUploader({
	talentId,
	currentImageUrl,
	displayName,
}: Props) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setPreviewUrl(URL.createObjectURL(file));
		setIsUploading(true);
		const formData = new FormData();
		formData.append("image", file);
		formData.append("id", talentId);
		await updateTalentImage(formData);
		setIsUploading(false);
	};

	return (
		<div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
			<div
				className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group flex-shrink-0"
				onClick={() => !isUploading && fileInputRef.current?.click()}
			>
				{previewUrl ? (
					<Image
						src={previewUrl}
						alt={displayName}
						fill
						className={`object-cover ${isUploading ? "opacity-50" : ""}`}
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
						{displayName.charAt(0)}
					</div>
				)}
				{isUploading && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full" />
					</div>
				)}
			</div>
			<div>
				<h3 className="font-bold text-gray-700">プロフィール画像</h3>
				<p className="text-sm text-gray-500 mb-2">
					クリックして画像をアップロード
				</p>
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					disabled={isUploading}
					className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded border border-gray-300 transition-colors"
				>
					{isUploading ? "更新中..." : "画像を変更"}
				</button>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleImageChange}
					accept="image/*"
					className="hidden"
				/>
			</div>
		</div>
	);
}
