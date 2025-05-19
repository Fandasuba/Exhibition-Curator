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
    
    try {
       const apiUrl = `https://digital.bodleian.ox.ac.uk/search/?q=${encodeURIComponent(query)}`
       const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/ld+json',
            }
        });
   
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log("This is the data inside the oxford api.", data.member);
        
        // Map the data to match the frontend's expected structure
        const items: FrontendItem[] = data.member.map((item: DigitalBodleianItem) => {
            // Extract thumbnail URL (edmPreview in frontend)
            const thumbnailUrl = item.thumbnail && item.thumbnail.length > 0 
                ? item.thumbnail[0].id 
                : ''; // Fallback empty string if no thumbnail
            
            
            const getTitle = item.displayFields.title
            const title = oxfordTitleRegexCheck(getTitle)
            const getDescription = item.displayFields.snippet
            const description = oxfordDescriptionRegexCheck(getDescription)
            console.log(title, "<------------ title after RegexCheck")
            console.log(getTitle, "<------------- Get title")
            // console.log(description, "<------------ Description after RegexCheck")
            // console.log(getDescription, "<------------- Get Description")
            const source = item.id
                
            return {
                edmPreview: thumbnailUrl,
                title: title,
                description: description,
                source: source
            };
        });
        return NextResponse.json({ items });
        
    } catch(error) {
        console.error("Error:", error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}