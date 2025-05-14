import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams)

  // Extract query parameters with default values
  const query = searchParams.get('query') || '';
  const rows = searchParams.get('rows') || '10'; // Default to 10 results
  const yearMin = searchParams.get('yearMin') || '700';
  const yearMax = searchParams.get('yearMax') || '1100';

  if (!query) {
    return NextResponse.json(
      { error: 'The "query" parameter is required.' },
      { status: 400 }
    );
  }

  // Construct the DigitaltMuseum API endpoint
  const apiKey = process.env.DIGITALTMUSEUM_API_KEY || 'demo'; // Replace 'demo' with your actual API key
  const apiUrl = `https://api.dimu.org/search?query=${encodeURIComponent(query)}&rows=${rows}&api.key=${apiKey}`;
  console.log("This is the apiURL inside the digitaltmuseum route file", apiUrl)

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch DigitaltMuseum API: ${response.statusText}`);
    }

    const data = await response.json();

    // Optionally filter results by year range if the API doesn't handle it directly
    const filteredItems = data.items?.filter((item: any) => {
      const year = parseInt(item.year, 10);
      return year >= parseInt(yearMin) && year <= parseInt(yearMax);
    });

    return NextResponse.json({ items: filteredItems || [] });
  } catch (error) {
    console.error('Error fetching data from DigitaltMuseum API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from DigitaltMuseum API.' },
      { status: 500 }
    );
  }
}