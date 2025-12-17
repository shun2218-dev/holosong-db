"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	// 入力から300ms待ってから実行される
	const handleSearch = useDebouncedCallback((term: string) => {
		const params = new URLSearchParams(searchParams);

		if (term) {
			params.set("q", term);
		} else {
			params.delete("q");
		}

		// URLを更新（ページ遷移せずにURLだけ変える）
		replace(`${pathname}?${params.toString()}`);
	}, 300);

	return (
		<div className="relative flex-1">
			<input
				type="text"
				placeholder="Search songs..."
				className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
				onChange={(e) => handleSearch(e.target.value)}
				defaultValue={searchParams.get("q")?.toString()}
			/>
			{/* 検索アイコン (簡易) */}
			<svg
				className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>
	);
}
