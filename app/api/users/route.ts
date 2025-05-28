import { Client } from "pg";
import bcrypt from 'bcrypt';

const apiUrl = process.env.NEXT_DOCKER_API_URL;

export async function GET() {

    const client = new Client({
    connectionString: apiUrl,
  });

    try {
    await client.connect();
    const result = await client.query('SELECT * FROM users');
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database query error:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    await client.end();
  }
}


export async function POST(request: Request) {
  const client = new Client({
    connectionString: apiUrl,
  });

  try {
    const body = await request.json();
    const { username, email, password } = body;

    // This is the encryption package i am trying out.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await client.connect();

    // Insert user into the database
    const result = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
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