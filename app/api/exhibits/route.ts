import { NextRequest } from "next/server";
import { getSession } from "@/app/lib/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions?userId=${userId}`;
    
    console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("Full backend URL:", backendUrl);

    const response = await fetch(backendUrl);
    const responseText = await response.text();
    
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);
    const data = JSON.parse(responseText);
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("API request error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("API request error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const exhibitId = searchParams.get('id');

    if (!exhibitId) {
      return Response.json({ error: "Exhibition ID is required" }, { status: 400 });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions/${exhibitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("API request error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const exhibitId = searchParams.get('id');

    if (!exhibitId) {
      return Response.json({ error: "Exhibition ID is required" }, { status: 400 });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions/${exhibitId}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("API request error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}