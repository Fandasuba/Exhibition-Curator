import { sortItems } from "@/app/utils/sort";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

const apiUrl = process.env.NEXT_DOCKER_API_URL;

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'items-asc' | 'items-desc';

export async function DELETE(req:NextRequest){
  const {searchParams} = new URL(req.url)
  const id = searchParams.get("exhibitId")

  const client = new Client({
    connectionString: apiUrl
  })

  try {
    await client.connect()
    const results = await client.query("DELETE FROM exhibitions WHERE id = $1", 
      [id]
    )

    return NextResponse.json({message: "Successfully deleted your exhibit.", data: results.rows[0]})
  } catch (error){
    console.error("Error in delete exhibit route:", error)
    NextResponse.json({error: `Error deleting exhibit - ${error}`})
  } finally {
    await client.end();
  }
}

export async function PATCH(req: NextRequest) {
   const { searchParams } = new URL(req.url);
  const id = searchParams.get("exhibitId");
 
  const client = new Client({
    connectionString: apiUrl,
  });
 
  try {
    const requestBody = await req.json();
    const { saveditems } = requestBody;
    
    await client.connect();
    const result = await client.query("UPDATE exhibitions SET savedItems = $1 WHERE id = $2",
      [JSON.stringify(saveditems), id]
    )
    return NextResponse.json({message: "Successfully updated Exhibit.", data: result.rows[0]})
  } catch(error){
    console.error("Error patching exhibit:", error)
    return NextResponse.json({error: error})
  } finally {
    await client.end();
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  
  // Exhibition pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const sortBy = searchParams.get('sortBy') as SortOption || 'date-desc';
  
  // Exhibition items pagination parameters (optional)
  const exhibitionId = searchParams.get('exhibitionId'); // If present, we're fetching items for a specific exhibition
  const itemsPage = parseInt(searchParams.get('itemsPage') || '1');
  const itemsPageSize = parseInt(searchParams.get('itemsPageSize') || '8');
  const itemsSortBy = searchParams.get('itemsSortBy') || 'title-asc';
  
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  
  const client = new Client({
    connectionString: apiUrl,
  });
  
  try {
    await client.connect();

    // If exhibitionId is provided, return paginated items for that specific exhibition
    if (exhibitionId) {
      // Get the specific exhibition
      const exhibitionQuery = 'SELECT * FROM exhibitions WHERE id = $1 AND user_id = $2';
      const exhibitionResult = await client.query(exhibitionQuery, [exhibitionId, userId]);
      
      if (!exhibitionResult.rows || exhibitionResult.rows.length === 0) {
        return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
      }

      const exhibition = exhibitionResult.rows[0];
      const saveditems = exhibition.saveditems || [];
      
      // Sort items based on itemsSortBy parameter
      const sortedItems = await sortItems(saveditems, itemsSortBy)
      
      // Calculate pagination for items
      const totalItems = sortedItems.length;
      const totalPages = Math.ceil(totalItems / itemsPageSize);
      const offset = (itemsPage - 1) * itemsPageSize;
      const paginatedItems = sortedItems.slice(offset, offset + itemsPageSize);

      return NextResponse.json({
        data: paginatedItems,
        pagination: {
          currentPage: itemsPage,
          pageSize: itemsPageSize,
          totalPages,
          totalItems,
          hasNextPage: itemsPage < totalPages,
          hasPreviousPage: itemsPage > 1
        },
        exhibition: {
          id: exhibition.id,
          name: exhibition.name
        }
      });
    }

    // Otherwise, return paginated exhibitions list
    // Calculate offset for SQL query
    const offset = (page - 1) * pageSize;

    // Build the ORDER BY clause based on sortBy parameter
    let orderClause = '';
    switch (sortBy) {
      case 'name-asc':
        orderClause = 'ORDER BY name ASC';
        break;
      case 'name-desc':
        orderClause = 'ORDER BY name DESC';
        break;
      case 'date-asc':
        orderClause = 'ORDER BY id ASC';
        break;
      case 'date-desc':
        orderClause = 'ORDER BY id DESC';
        break;
      case 'items-asc':
        orderClause = 'ORDER BY COALESCE(jsonb_array_length(saveditems), 0) ASC';
        break;
      case 'items-desc':
        orderClause = 'ORDER BY COALESCE(jsonb_array_length(saveditems), 0) DESC';
        break;
      default:
        orderClause = 'ORDER BY id DESC';
    }

    // Get total count for pagination info
    const countQuery = 'SELECT COUNT(*) as total FROM exhibitions WHERE user_id = $1';
    const countResult = await client.query(countQuery, [userId]);
    const totalItems = parseInt(countResult.rows[0].total);
    
    // Main query with pagination and sorting
    const dataQuery = `
      SELECT * FROM exhibitions 
      WHERE user_id = $1 
      ${orderClause}
      LIMIT $2 OFFSET $3
    `;

    const exhibitionsResult = await client.query(dataQuery, [userId, pageSize, offset]);
    const exhibitions = exhibitionsResult.rows;
    
    const totalPages = Math.ceil(totalItems / pageSize);

    return NextResponse.json({
      data: exhibitions,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions' }, 
      { status: 500 }
    );
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