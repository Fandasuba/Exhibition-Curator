import { NextRequest } from "next/server";
import { getSession } from "@/app/lib/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { exhibitionId, userId, item } = body;

    console.log("Frontend items API - received:", { exhibitionId, userId, item });

    if (!exhibitionId || !userId || !item) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const backendPayload = {
      id: exhibitionId,
      user_id: userId,
      item: item
    };

    console.log("Sending to backend:", backendPayload);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/additem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      return Response.json({ 
        error: errorData.error || "Failed to add item to exhibition" 
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Items API request error:", error);
    return Response.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error" 
    }, { status: 500 });
  }
}