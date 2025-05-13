import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const yearMin = searchParams.get('yearMin') || '700';
  const yearMax = searchParams.get('yearMax') || '1100';
  const apiKey = process.env.EUROPEANA_API_KEY;
  const apiUrl = `https://api.europeana.eu/record/v2/search.json?query=${query}&rows=20&type=IMAGE&f.year.min=${yearMin}&f.year.max=${yearMax}&wskey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error fetching Europeana API data');

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}