import { NextRequest } from "next/server";
import { getSession } from "@/app/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;
    // Change this line to use URL parameter instead of query parameter
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions/${userId}`;

    const response = await fetch(backendUrl);
    const responseText = await response.text();
    
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
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const responseText = await response.text();
    const data = JSON.parse(responseText);
    
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
    const exhibitId = searchParams.get('exhibitId');

    if (!exhibitId) {
      return Response.json({ error: "Exhibition ID is required" }, { status: 400 });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions/${exhibitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const responseText = await response.text();
    const data = JSON.parse(responseText);
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("PATCH API request error:", error);
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
    const exhibitId = searchParams.get('exhibitId');

    if (!exhibitId) {
      return Response.json({ error: "Exhibition ID is required" }, { status: 400 });
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exhibitions/${exhibitId}`, {
      method: 'DELETE'
    });
    
    const responseText = await response.text();
    const data = JSON.parse(responseText);
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("DELETE API request error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}