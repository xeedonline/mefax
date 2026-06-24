import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { stripHtml, truncate } from '@/lib/teletext-utils';

const parser = new Parser({ timeout: 8000 });

const RSS_FEEDS: Record<string, string> = {
  uk:       'https://feeds.bbci.co.uk/news/uk/rss.xml',
  world:    'https://feeds.bbci.co.uk/news/world/rss.xml',
  tech:     'https://feeds.bbci.co.uk/news/technology/rss.xml',
  business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
  top:      'https://feeds.bbci.co.uk/news/rss.xml',
};

export const revalidate = 300; // 5 minutes

export async function GET(req: NextRequest) {
  const cat = req.nextUrl.searchParams.get('cat') || 'top';
  const url = RSS_FEEDS[cat] ?? RSS_FEEDS.top;

  try {
    const feed = await parser.parseURL(url);
    const items = (feed.items || []).slice(0, 12).map((item) => ({
      title: truncate(stripHtml(item.title || ''), 60).toUpperCase(),
      description: truncate(stripHtml(item.contentSnippet || item.content || ''), 120),
      link: item.link || '',
      pubDate: item.pubDate || '',
      category: cat,
    }));

    return NextResponse.json({ items, feedTitle: feed.title, updatedAt: new Date().toISOString() }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (err) {
    console.error('News RSS error:', err);
    // Return mock headlines on failure
    return NextResponse.json({
      items: [
        { title: 'BBC NEWS FEED TEMPORARILY UNAVAILABLE', description: 'Please try again shortly.', link: '', pubDate: new Date().toISOString(), category: cat },
        { title: 'CHECK THE BBC WEBSITE FOR LATEST NEWS', description: 'bbc.co.uk/news', link: '', pubDate: '', category: cat },
      ],
      feedTitle: 'BBC News',
      updatedAt: new Date().toISOString(),
      error: true,
    });
  }
}
