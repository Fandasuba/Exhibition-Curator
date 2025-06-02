import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

interface Item {
  edmPreview: string;
  title: string;
  description: string;
  source: string;
  provider?: string;
  author?: string;
}

const apiUrl = process.env.NEXT_DOCKER_API_URL;

export async function POST(req: NextRequest) {
  const client = new Client({
    connectionString: apiUrl
  });

  try {
    await client.connect();
    
    const body = await req.json();
    const { exhibitionId, userId, item } = body;

    // Validate required fields
    if (!exhibitionId || !userId || !item) {
      return NextResponse.json(
        { error: "Missing required fields: exhibitionId, userId, or item" },
        { status: 400 }
      );
    }

    // First, verify the exhibition exists and belongs to the user
    const exhibitionCheck = await client.query(
      "SELECT id, savedItems FROM exhibitions WHERE id = $1 AND user_id = $2",
      [exhibitionId, userId]
    );

    if (exhibitionCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Exhibition not found or doesn't belong to user" },
        { status: 404 }
      );
    }

    // Get current savedItems array
    const currentItems = exhibitionCheck.rows[0].saveditems || [];
    
    // Check if item already exists (prevent duplicates)
    const itemExists = currentItems.some((existingItem: Item) => 
      existingItem.title === item.title && existingItem.source === item.source
    );

    if (itemExists) {
      return NextResponse.json(
        { error: "Item already exists in this exhibition" },
        { status: 409 }
      );
    }

    // Add the new item to the savedItems array
    const updatedItems = [...currentItems, item];

    // Update the exhibition with the new item
    const result = await client.query(
      "UPDATE exhibitions SET savedItems = $1 WHERE id = $2 AND user_id = $3 RETURNING name, user_id, savedItems",
      [JSON.stringify(updatedItems), exhibitionId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Failed to update exhibition" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Item added to exhibition successfully",
      exhibition: result.rows[0],
      itemsCount: updatedItems.length
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

export async function GET(req: NextRequest) {
  // Optional: Add a GET method to retrieve items from an exhibition
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    
    const { searchParams } = new URL(req.url);
    const exhibitionId = searchParams.get('exhibitionId');
    const userId = searchParams.get('userId');

    if (!exhibitionId || !userId) {
      return NextResponse.json(
        { error: "Missing exhibitionId or userId parameter" },
        { status: 400 }
      );
    }

    const result = await client.query(
      "SELECT savedItems FROM exhibitions WHERE id = $1 AND user_id = $2",
      [exhibitionId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Exhibition not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      items: result.rows[0].saveditems || []
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}