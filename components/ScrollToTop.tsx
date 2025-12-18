"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
	const pathname = usePathname();

	useEffect(() => {
		// ページ遷移時（パス変更時）に強制的に一番上へスクロール
		window.scrollTo(0, 0);
	}, [pathname]);

	return null; // UIには何も表示しない
}
