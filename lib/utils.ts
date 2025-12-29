import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwindのクラス結合用（将来的にshadcn/uiなどを使う場合にも役立ちます）
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// YouTube URLからIDを抽出する関数
export function getYoutubeId(url: string | null) {
	if (!url) return null;
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
}
