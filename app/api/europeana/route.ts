import { NextResponse } from 'next/server';

interface FrontendItem {
  edmPreview: string;
  title: string;
  description: string;
  provider: string;
  source: string;
  author?: string;
}

interface EuropeanaItem {
  title: string;
  guid: string;
  dcDescription: string;
  dataProvider: string;
  edmPreview: string;
  dcCreator?: string;
  country?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 20);
  const validatedLimit = Math.min(Math.max(limit, 5), 50);
  const start = (page - 1) * validatedLimit + 1;
  // const yearMin = searchParams.get('yearMin') || '700';
  // const yearMax = searchParams.get('yearMax') || '1100';
  const apiKey = process.env.EUROPEANA_API_KEY;
  // const apiUrl = `https://api.europeana.eu/record/v2/search.json?query=${query}&rows=20&type=IMAGE&f.year.min=${yearMin}&f.year.max=${yearMax}&wskey=${apiKey}`;
  const apiUrl = `https://api.europeana.eu/record/v2/search.json?query=${encodeURIComponent(query)}&rows=${validatedLimit}&start=${start}&type=IMAGE&wskey=${apiKey}`;
  console.log(apiUrl)
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error fetching Europeana API data');
    
    const data = await response.json();
    // console.log("This is the full data:", data)
    // console.log("Length of the data:", data.items.length)
    console.log(data.items, "This is the data.items in Europeana")
    const items: FrontendItem[] = data.items.map((item: EuropeanaItem) => ({
      title: item.title[0] || 'No Title provided by Collection',
      source: `${item.guid}` ,
      provider: item.dataProvider,
      edmPreview: item.edmPreview || null,
      description: item.dcDescription || 'No Description provided by Collection',
      author: `${item.dcCreator}, ${item.country}`
    }));
    const totalItems = data.totalResults || 0;
    const totalPages = Math.ceil(totalItems / validatedLimit);
    return NextResponse.json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit: validatedLimit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Europeana API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}