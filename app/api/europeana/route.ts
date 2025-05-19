import { NextResponse } from 'next/server';

interface FrontendItem {
  edmPreview: string;
  title: string;
  description: string;
  source: string;
}

interface EuropeanaItem {
  title: string;
  guid: string;
  dcDescription: string;
  dataProvider: string;
  edmPreview: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  // const yearMin = searchParams.get('yearMin') || '700';
  // const yearMax = searchParams.get('yearMax') || '1100';
  const apiKey = process.env.EUROPEANA_API_KEY;
  // const apiUrl = `https://api.europeana.eu/record/v2/search.json?query=${query}&rows=20&type=IMAGE&f.year.min=${yearMin}&f.year.max=${yearMax}&wskey=${apiKey}`;
  const apiUrl = `https://api.europeana.eu/record/v2/search.json?query=${query}&rows=20&type=IMAGE&wskey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error fetching Europeana API data');

    const data = await response.json();
    console.log(data.items, "This is the data.items in Europeana")
    const items: FrontendItem[] = data.items.map((item: EuropeanaItem) => ({
      title: item.title[0] || 'No Title provided by Collection',
      source: `${item.guid}`,
      edmPreview: item.edmPreview || null,
      description: item.dcDescription || 'No Description provided by Collection',
    }));
    return NextResponse.json({ items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}