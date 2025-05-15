import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    const payload = {
  size: 100,
  query: {
    bool: {
      must: [
        {
          multi_match: {
            query: query || '',
            fields: ['content', 'title', 'description', 'image'],
            fuzziness: 'AUTO',
          }
        }
      ],
    //   must_not: [
    //     {
    //       match: { _type: 'literature' }
    //     }
    //   ]
    }
  },
  _source: true,
};


    const response = await fetch('https://api.natmus.dk/search/public/raw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Natmus API error', status: response.status }, { status: response.status });
    }

    const data = await response.json();
    console.log('Natmus API data:', data); // For debugging all fields returned

    return NextResponse.json(data);
  } catch (error) {
    console.error('Natmus API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}