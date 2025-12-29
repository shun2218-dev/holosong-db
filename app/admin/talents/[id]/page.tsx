import { notFound } from "next/navigation";
import TalentImageUploader from "@/components/TalentImageUploader";
import TalentEditForm from "@/components/talentEditForm";
import { getTalent } from "./actions";

type PageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function TalentEditPage({ params }: PageProps) {
	const { id } = await params;
	const talent = await getTalent(id);

	if (!talent) {
		notFound();
	}

	return (
		<div className="max-w-2xl mx-auto py-10 px-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800">タレント編集</h1>
				<a
					href="/admin/talents"
					className="text-sm text-blue-600 hover:underline"
				>
					一覧へ戻る
				</a>
			</div>

			{/* 画像アップローダー */}
			<TalentImageUploader
				talentId={talent.id}
				currentImageUrl={talent.imageUrl}
				displayName={talent.displayName}
			/>

			<TalentEditForm talent={talent} />
		</div>
	);
}
