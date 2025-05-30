import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const apiUrl = process.env.NEXT_DOCKER_API_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get("userId");

  if (!user_id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const client = new Client({
    connectionString: apiUrl,
  });

  try {
    await client.connect();
    const result = await client.query(
      "SELECT * FROM exhibitions WHERE user_id = $1",
      [user_id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.end();
  }
}

export async function POST(req: NextRequest){
  const client = new Client({
    connectionString: apiUrl,
  });
 
  try {
    const body = await req.json()
    const {name, user_id} = body
    console.log("Incoming request:", body)
    console.log(name, user_id)

     await client.connect();
    const result = await client.query(
      "INSERT INTO exhibitions (name, user_id) VALUES ($1, $2) RETURNING name, user_id, savedItems",
      [name, user_id]
    );
    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database query error:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    await client.end();
  }
}