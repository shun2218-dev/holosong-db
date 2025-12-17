import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "HoloSongDB",
	description: "Database of Hololive Songs",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${inter.className} min-h-screen flex flex-col`}>
				<Header />
				<main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
