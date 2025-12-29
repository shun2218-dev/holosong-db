import Link from "next/link";

export function Header() {
	return (
		<header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
				{/* ロゴエリア */}
				<Link
					href="/"
					className="font-bold text-xl tracking-tight text-gray-900 hover:opacity-70 transition-opacity"
				>
					HoloSong<span className="text-blue-500">DB</span>
				</Link>

				{/* ナビゲーションメニュー */}
				<nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
					<Link href="/" className="hover:text-blue-500 transition-colors">
						Top
					</Link>
					<Link href="/songs" className="hover:text-blue-500 transition-colors">
						Songs
					</Link>
					<Link
						href="/talents"
						className="hover:text-blue-500 transition-colors"
					>
						Talents
					</Link>
					<Link href="/about" className="hover:text-blue-500 transition-colors">
						About
					</Link>
				</nav>

				{/* 右側のボタンエリア (将来的にログインボタンなどを配置) */}
				{/* <div className="flex items-center gap-4">
					<Link
						href="/admin"
						className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
					>
						Admin
					</Link>
				</div> */}
			</div>
		</header>
	);
}
