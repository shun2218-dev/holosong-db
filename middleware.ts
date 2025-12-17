import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"], // /admin 以下の全ルートに適用
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // 環境変数の値と一致するかチェック
    if (
      user === process.env.ADMIN_USER &&
      pwd === process.env.ADMIN_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  // 認証失敗、または未入力の場合は401を返し、ブラウザにダイアログを出させる
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}