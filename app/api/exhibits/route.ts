import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const apiUrl = process.env.NEXT_DOCKER_API_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const client = new Client({
    connectionString: apiUrl,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM exhibitions WHERE user_id = $1",
      [userId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.end();
  }
}
