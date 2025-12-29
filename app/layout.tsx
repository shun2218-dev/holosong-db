import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://holosongdb.com";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "HoloSongDB | ホロライブ楽曲データベース",
		template: "%s | HoloSongDB",
	},
	description:
		"ホロライブの歌枠、オリジナル曲、カバー曲を検索できる非公式ファンデータベースです。タレントごとの歌唱履歴やアーカイブへのリンクを網羅。",
	keywords: [
		"ホロライブ",
		"hololive",
		"歌枠",
		"セトリ",
		"オリジナル曲",
		"データベース",
	],
	openGraph: {
		title: "HoloSongDB | ホロライブ楽曲データベース",
		description:
			"推しの歌枠やオリジナル曲を簡単に検索。タレントごとの歌唱データをアーカイブしています。",
		url: siteUrl,
		siteName: "HoloSongDB",
		locale: "ja_JP",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "HoloSongDB",
		description: "ホロライブ楽曲データベース",
	},
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${inter.className} min-h-screen flex flex-col`}>
				<ScrollToTop />
				<Header />
				<main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
