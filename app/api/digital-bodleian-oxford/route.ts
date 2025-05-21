import { oxfordDescriptionRegexCheck, oxfordTitleRegexCheck } from '@/app/utils/util-functions';
import { NextRequest, NextResponse } from 'next/server';

interface DigitalBodleianItem {
  type: string;
  id: string;
  shelfmark: string;
  thumbnail: {
    id: string;
    type: string;
    format: string;
  }[];
  displayFields: {
    title: string;
    snippet: string;
  };
}

interface FrontendItem {
  edmPreview: string;
  title: string;
  description: string;
  source: string;
}

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || '';
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);
    
    // Validate the limit (API supports 20, 40, 100)
    const validatedLimit = [20, 40, 100].includes(limit) ? limit : 20;
    
    try {
        // The API uses 'page' parameter directly and 'rows' for limit
        const apiUrl = `https://digital.bodleian.ox.ac.uk/search/?q=${encodeURIComponent(query)}&page=${page > 1 ? page : ''}&rows=${validatedLimit}`;
        console.log("Requesting URL:", apiUrl);
        
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/ld+json',
            }
        });
    
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        const data = await response.json();
        console.log("API response metadata:", {
            totalItems: data.totalItems,
            totalPages: data.view?.totalPages,
            nextPage: data.view?.next,
            lastPage: data.view?.last
        });
        
        // Map the data to match the frontend's expected structure
        const items: FrontendItem[] = data.member.map((item: DigitalBodleianItem) => {
            const thumbnailUrl = item.thumbnail && item.thumbnail.length > 0
                ? item.thumbnail[0].id
                : '';
            
            const getTitle = item.displayFields.title;
            const title = oxfordTitleRegexCheck(getTitle);
            const getDescription = item.displayFields.snippet;
            const description = oxfordDescriptionRegexCheck(getDescription);
            const source = item.id;
                
            return {
                edmPreview: thumbnailUrl,
                title: title,
                description: description,
                source: source
            };
        });
        
        // Extract pagination information from the response
        return NextResponse.json({ 
            items,
            pagination: {
                currentPage: page,
                totalPages: data.view?.totalPages || 1,
                totalItems: data.totalItems || 0,
                limit: validatedLimit,
                hasNextPage: !!data.view?.next,
                hasPrevPage: page > 1
            }
        });
        
    } catch(error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}