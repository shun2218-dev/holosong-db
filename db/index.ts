import { config } from "dotenv";

config({ path: ".env.local" });

import { neon, Pool } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

// ---------------------------------------------------------
// 1. 通常用 (HTTP)
// ---------------------------------------------------------
// 特徴: 接続確立が最速、ステートレス。トランザクション不可。
// 用途: データの取得、単純な単発INSERT/UPDATEなど
const client = neon(process.env.DATABASE_URL);
export const db = drizzleHttp(client, { schema });

// ---------------------------------------------------------
// 2. トランザクション用 (WebSocket Pool)
// ---------------------------------------------------------
// 特徴: セッション維持が可能。トランザクション(db.transaction)が使える。
// 用途: 複数テーブルへの同時書き込み、複雑な一括登録処理など
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const dbTx = drizzleWs(pool, { schema });
