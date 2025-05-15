import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || '';
    console.log(query, "Inside the fitzwilliam route file.")

    try {
        const apiUrl = `https://data.fitzmuseum.cam.ac.uk/api/v1/objects?query=${query}&page=1&size=20&sort=asc&hasImage=1`;
        const response = await fetch(apiUrl);
        console.log(apiUrl, "URL of the Fitz file.")
        console.log(response, "Response of the fitz file.")
        if (!response.ok) {
            return NextResponse.json({ error: 'Fitzwilliam API error', status: response.status }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error inside Fitzwilliam API route file. Reason:", error);
        return NextResponse.json({ error: 'Failed to fetch data in Fitzwilliam API Req / Res' }, { status: 500 });
    }
}
