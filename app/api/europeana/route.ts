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
  title: string[];
  guid: string;
  dcDescription: string[];
  dataProvider: string[];
  edmPreview: string[];
  dcCreator?: string[];
  country?: string[];
  type?: string;
  year?: string[];
  rights?: string[];
  language?: string[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const validatedLimit = Math.min(Math.max(limit, 5), 50);
  const start = (page - 1) * validatedLimit + 1;
  
  const qfParams = searchParams.getAll('qf');
  
  const apiKey = process.env.EUROPEANA_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const baseParams = new URLSearchParams({
    query: query,
    rows: validatedLimit.toString(),
    start: start.toString(),
    wskey: apiKey,
    profile: 'rich'
  });

  qfParams.forEach(filter => {
    baseParams.append('qf', filter);
  });

  baseParams.append('media', 'true');
  baseParams.append('thumbnail', 'true');

  const apiUrl = `https://api.europeana.eu/record/v2/search.json?${baseParams.toString()}`;

 
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Europeana API error: ${response.status} ${response.statusText}`);
    }
   
    const data = await response.json();
    const items: FrontendItem[] = data.items?.map((item: EuropeanaItem) => {
      const getFirst = (arr: string[] | undefined) => arr && arr.length > 0 ? arr[0] : '';
      let authorInfo = '';
      const creator = getFirst(item.dcCreator);
      const country = getFirst(item.country);
      
      if (creator && country) {
        authorInfo = `${creator}, ${country}`;
      } else if (creator) {
        authorInfo = creator;
      } else if (country) {
        authorInfo = `From ${country}`;
      }

      return {
        title: getFirst(item.title) || 'No Title provided by Collection',
        source: item.guid || '',
        provider: getFirst(item.dataProvider) || 'Unknown Provider',
        edmPreview: getFirst(item.edmPreview) || '',
        description: getFirst(item.dcDescription) || 'No Description provided by Collection',
        author: authorInfo,
        type: item.type || '',
        year: getFirst(item.year),
        rights: getFirst(item.rights),
        language: getFirst(item.language)
      };
    }) || [];

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
      },
      facets: data.facets || [],
      appliedFilters: qfParams
    });
  } catch (error) {
    console.error('Europeana API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data from Europeana',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}