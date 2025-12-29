/** @type {import('next').NextConfig} */

// CSPの設定内容
// YouTube, Vercel Blob, Google Fontsなどを許可
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://*.public.blob.vercel-storage.com https://img.youtube.com https://i.ytimg.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self' https://www.youtube.com;
  connect-src 'self' https://vitals.vercel-insights.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "hololive.hololivepro.com", // hololive official site for seed images
			},
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com", // Vercel Storage for user uploaded images
			},
			{
				protocol: "https",
				hostname: "img.youtube.com", // YouTube jacket image url
			},
		],
	},
	async headers() {
		return [
			{
				source: "/:path*", // 全ページに適用
				headers: [
					{
						// 1. HSTS (HTTP Strict Transport Security)
						// 役割: 常にHTTPSで接続させ、中間者攻撃を防ぐ
						// 設定: 2年間有効、サブドメイン含む、プリロード登録用
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						// 2. X-Frame-Options (XFO)
						// 役割: クリックジャッキング対策。他サイトでのiframe埋め込みを禁止
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						// 3. X-Content-Type-Options
						// 役割: MIMEタイプのスニフィング（偽装）を防ぐ
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						// 4. Referrer-Policy
						// 役割: リンク遷移時のプライバシー保護
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						// 5. Cross-Origin-Opener-Policy (COOP)
						// 役割: ポップアップ等の別ウィンドウとのプロセス分離
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin",
					},
					{
						// 6. Content-Security-Policy (CSP)
						// 役割: XSS対策。許可したソース以外のスクリプトや画像の読み込みをブロック
						key: "Content-Security-Policy",
						value: ContentSecurityPolicy.replace(/\n/g, ""),
					},
					// 7. Permissions-Policy
					// 役割: カメラやマイク、位置情報などのブラウザ機能の使用許可を明示的に無効化
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

export default nextConfig;
