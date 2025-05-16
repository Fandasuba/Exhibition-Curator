import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || '';

    try{
       const apiUrl = `https://digital.bodleian.ox.ac.uk/search/?q=${encodeURIComponent(query)}`
       const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/ld+json',
            }
        })

    
        const data = await response.json()
        console.log("This is the data inside the oxford api.", data)
        return NextResponse.json(data.member);
    } catch(error) {
        console.error("Error:", error)
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}