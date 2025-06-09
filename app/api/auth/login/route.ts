import { NextRequest } from "next/server";
import { createSession } from "@/app/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    if (response.ok && data.user) {
      await createSession(
        data.user.id.toString(), 
        data.user.username, 
        data.user.email
      );
    }
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Login API request error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}