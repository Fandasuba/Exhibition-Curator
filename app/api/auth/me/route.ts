import { getSession } from "@/app/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    return Response.json({ 
      user: {
        id: session.userId,
        username: session.username,
        email: session.email
      }
    });
  } catch (error) {
    console.error("Session error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}