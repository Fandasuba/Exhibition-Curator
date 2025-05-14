import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, rows = '10', yearMin = '700', yearMax = '1100' } = req.query;


  if (!query || typeof query !== 'string') {
    return res
      .status(400)
      .json({ error: 'The "query" parameter is required and must be a string.' });
  }


  const apiKey = process.env.SOCH_API_KEY || 'demo'; // Replace 'demo' with your actual API key
  const endpoint = `https://www.kringla.nu/kringla/api?query=${encodeURIComponent(
    query
  )}&rows=${rows}&api.key=${apiKey}`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch SOCH API: ${response.statusText}`,
      });
    }

    const data = await response.json();


    const filteredItems = data.result?.filter((item: any) => {
      const year = parseInt(item.year, 10);
      return year >= parseInt(yearMin as string, 10) && year <= parseInt(yearMax as string, 10);
    });

    res.status(200).json({ items: filteredItems || [] });
  } catch (error) {
    console.error('Error fetching data from SOCH API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}