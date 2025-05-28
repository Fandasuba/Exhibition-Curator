// app/api/auth/logout/route.js
import { deleteSession } from "@/app/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return Response.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}