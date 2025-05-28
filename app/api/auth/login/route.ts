import { Client } from "pg";
import bcrypt from 'bcrypt';
import { createSession } from "@/app/lib/session";
import { NextRequest } from "next/server";

const apiUrl = process.env.NEXT_DOCKER_API_URL;

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: apiUrl,
  });

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400 });
    }

    await client.connect();
    
    const result = await client.query(
      'SELECT id, username, email, password FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(user.id, user.username, user.email);

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    // Keep the comments above as it tells ESLint to ignore. Otherwise Docker spits its dummy out.
    
    return Response.json({ 
      message: "Login successful",
      user: userWithoutPassword 
    });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.end();
  }
}