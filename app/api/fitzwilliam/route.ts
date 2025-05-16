import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || '';
    console.log(query, "Inside the fitzwilliam route file.");
    
    try {
        const apiUrl = `https://data.fitzmuseum.cam.ac.uk/api/v1/objects?query=${encodeURIComponent(query)}&page=1&size=20&sort=asc&hasImage=1`;
        
        // Add headers that might be required
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; YourApp/1.0)'
            },
            // Prevent redirects from being followed automatically
            redirect: 'manual'
        });
        
        console.log(apiUrl, "URL of the Fitz file.");
        
        if (!response.ok) {
            return NextResponse.json({ 
                error: 'Fitzwilliam API error', 
                status: response.status 
            }, { status: response.status });
        }
        
        // Check content type to ensure we're getting JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Get the response text for debugging
            const text = await response.text();
            console.error("Received non-JSON response:", text.substring(0, 200) + "...");
            return NextResponse.json({ 
                error: 'Invalid response format from Fitzwilliam API',
                contentType
            }, { status: 500 });
        }
        
        const data = await response.json();
        console.log(data, "Data in the fitzwilliam await reponse section.")
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error inside Fitzwilliam API route file. Reason:", error);
        return NextResponse.json({ 
            error: 'Failed to fetch data in Fitzwilliam API Req / Res' 
        }, { status: 500 });
    }
}