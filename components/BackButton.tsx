"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
	/** 戻る履歴がない(または外部からのアクセス)場合の遷移先URL。デフォルトは "/" */
	fallbackPath?: string;
};

export function BackButton({ children, className, fallbackPath = "/" }: Props) {
	const router = useRouter();

	const handleNavigation = () => {
		// クライアントサイドでのみ実行
		if (typeof window !== "undefined") {
			// 1. 直前のページが自分のサイト内かどうかをチェック
			const referrer = document.referrer;
			const isInternal = referrer.includes(window.location.host);

			if (isInternal) {
				// サイト内遷移なら、履歴を戻る
				router.back();
			} else {
				// 直アクセスや外部サイトからの場合、指定のパス（トップ等）へ遷移
				router.push(fallbackPath);
			}
		}
	};

	return (
		<button
			type="button"
			onClick={handleNavigation}
			className={`group inline-flex items-center gap-1 ${className}`}
		>
			<ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
			<span>{children}</span>
		</button>
	);
}
