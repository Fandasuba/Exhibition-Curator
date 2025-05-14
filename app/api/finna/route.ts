import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || 'Viking';
  const limit = searchParams.get('limit') || '20';
  const apiUrl = `https://api.finna.fi/v1/search?lookfor=${encodeURIComponent(query)}&type=AllFields&limit=${limit}&field[]=title&field[]=images&field[]=subjects&field[]=buildings`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch data from Finna API');
    }

    const data = await response.json();

    const items = data.records.map((record: any) => ({
      title: record.title,
      images: record.images?.map((img: string) => `https://www.finna.fi${img}`) || [],
      subjects: record.subjects || [],
      building: record.buildings?.[0]?.translated || 'Unknown',
    }));

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}