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
  manifest: {
    id: string;
    type: string;
  };
  displayFields: {
    title: string;
    snippet: string;
    author: string;
  };
}

interface FrontendItem {
  edmPreview: string;
  title: string;
  description: string;
  source: string;
  author?: string;
  provider?: string;
}

interface MetadataField {
  label: string;
  value: string;
}

interface ManifestData {
  metadata?: MetadataField[];
  thumbnail?: Array<{ id: string }>;
}

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('query') || '';
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20', 10);
    const validatedLimit = [20, 40, 100].includes(limit) ? limit : 20;
   
    try {
        const apiUrl = `https://digital.bodleian.ox.ac.uk/search/?q=${encodeURIComponent(query)}&page=${page > 1 ? page : ''}&rows=${validatedLimit}`;
       
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/ld+json',
            }
        });
   
        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        const manifestDataMap = new Map<number, ManifestData>();
        
        if (data.member && Array.isArray(data.member)) {
            for (let i = 0; i < data.member.length; i++) {
                const member = data.member[i];
                
                try {
                    if (member.manifest?.id) {
                        const manifestUrl = member.manifest.id;
                        
                        const manifestResponse = await fetch(manifestUrl, {
                            headers: {
                                'Accept': 'application/json',
                            }
                        });
                        
                        if (manifestResponse.ok) {
                            const manifestData: ManifestData = await manifestResponse.json();
                            // console.log(`Manifest data for member ${i}:`, manifestData.metadata);
                            manifestDataMap.set(i, manifestData);
                        } else {
                            console.warn(`Failed to fetch manifest for member ${i}: ${manifestResponse.status}`);
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching manifest for member ${i}:`, error);
                }
            }
        }
        
        const items: FrontendItem[] = data.member.map((item: DigitalBodleianItem, index: number) => {
            const manifestData = manifestDataMap.get(index);
            
            let thumbnailUrl = '';
            let titleForRegex: string | string[] = '';
            let descriptionForRegex: string | string[] = '';
            let source = '';
            let author = '';
            
            if (manifestData && manifestData.metadata) {
                const metadata = manifestData.metadata;
                const homepageField = metadata.find((field: MetadataField) => field.label === 'Homepage');
                const titleField = metadata.find((field: MetadataField) => field.label === 'Title');
                const dateField = metadata.find((field: MetadataField) => field.label === 'Date Statement');
                const placeField = metadata.find((field: MetadataField) => field.label === 'Place of Origin');
                const descriptionField = metadata.find((field: MetadataField) => field.label === 'Description');
                thumbnailUrl = manifestData.thumbnail?.[0]?.id || 
                              (item.thumbnail && item.thumbnail.length > 0 ? item.thumbnail[0].id : '');
                const manifestTitle = titleField?.value;
                const originalTitle = item.displayFields?.title;
                titleForRegex = manifestTitle ? [manifestTitle] : originalTitle || [''];
                const manifestDescription = descriptionField?.value; // Sometimes the meta can have none 1, or 2 description fields. Typically the first index contains description on the item. The second typically is some added context from more recent years.
                const originalDescription = item.displayFields?.snippet;
                descriptionForRegex = manifestDescription ? [manifestDescription] : originalDescription || [''];
                const homepageValue = homepageField?.value || '';
                const homepageMatch = homepageValue.match(/href="([^"]+)"/);
                source = homepageMatch ? homepageMatch[1] : item.id;
                
                // Combine date and place for author field - Oxford doesnt have an author field as it sometimes appears in the title. So, combining location and rough dates makes sense.
                const dateStatement = dateField?.value || '';
                const placeOfOrigin = placeField?.value || '';
                author = [dateStatement, placeOfOrigin].filter(Boolean).join(', ');
            } else {
                thumbnailUrl = item.thumbnail && item.thumbnail.length > 0 ? item.thumbnail[0].id : '';
                titleForRegex = item.displayFields?.title || [''];
                descriptionForRegex = item.displayFields?.snippet || [''];
                source = item.id;
            }
            
            return {
                edmPreview: thumbnailUrl,
                title: oxfordTitleRegexCheck(Array.isArray(titleForRegex) ? titleForRegex : [titleForRegex]),
                description: oxfordDescriptionRegexCheck(Array.isArray(descriptionForRegex) ? descriptionForRegex : [descriptionForRegex]),
                source: source,
                author: author || undefined
            };
        });
       
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