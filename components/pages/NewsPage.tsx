'use client';
import { useEffect, useState, useCallback } from 'react';
import { useTeletextStore } from '@/store/teletext';
import { truncate } from '@/lib/teletext-utils';

const CATEGORIES: Record<number, { cat: string; title: string; next?: number; prev?: number }> = {
  101: { cat: 'uk',       title: 'UK NEWS',        next: 110, prev: undefined },
  110: { cat: 'world',    title: 'WORLD NEWS',      next: 120, prev: 101 },
  120: { cat: 'tech',     title: 'TECHNOLOGY',      next: 130, prev: 110 },
  130: { cat: 'business', title: 'BUSINESS',        next: undefined, prev: 120 },
};

function getConfig(pageNum: number) {
  const base = CATEGORIES[pageNum];
  if (base) return base;
  // 102-109 → UK sub-pages (pagination)
  if (pageNum >= 102 && pageNum <= 109) return { cat: 'uk', title: 'UK NEWS', next: undefined, prev: 101 };
  return CATEGORIES[101];
}

interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
}

const REFRESH_MS = 5 * 60 * 1000; // 5 min

export default function NewsPage({ pageNum }: { pageNum: number }) {
  const { navigate, setFastTextLinks } = useTeletextStore();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subPage, setSubPage] = useState(0); // which batch of 5 items to show
  const [updatedAt, setUpdatedAt] = useState('');

  const cfg = getConfig(pageNum);

  const fetchNews = useCallback(async () => {
    try {
      const r = await fetch(`/api/news?cat=${cfg.cat}`);
      const d = await r.json();
      setItems(d.items ?? []);
      setUpdatedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [cfg.cat]);

  useEffect(() => {
    setFastTextLinks({
      red:    { page: 101,  label: 'UK' },
      green:  { page: 110,  label: 'WORLD' },
      yellow: { page: 120,  label: 'TECH' },
      blue:   { page: 130,  label: 'BUSINESS' },
    });
    setLoading(true);
    setSubPage(0);
    fetchNews();
    const id = setInterval(fetchNews, REFRESH_MS);
    return () => clearInterval(id);
  }, [pageNum, fetchNews, setFastTextLinks]);

  // 5 items per sub-page, auto cycle every 8s
  const PER_PAGE = 5;
  const totalSubPages = Math.max(1, Math.ceil(items.length / PER_PAGE));

  useEffect(() => {
    const id = setInterval(() => setSubPage((p) => (p + 1) % totalSubPages), 8000);
    return () => clearInterval(id);
  }, [totalSubPages]);

  const visible = items.slice(subPage * PER_PAGE, subPage * PER_PAGE + PER_PAGE);

  return (
    <div className="tt-reveal h-full overflow-hidden px-1 tt-text">
      {/* Header */}
      <div className="bg-tt-red text-tt-white font-bold text-center py-0.5">
        ◀ {cfg.title} {updatedAt && <span className="text-tt-yellow">UPDATED {updatedAt}</span>} ▶
      </div>

      {/* Sub-page indicator */}
      {totalSubPages > 1 && (
        <div className="text-tt-cyan text-right pr-1">
          PAGE {subPage + 1}/{totalSubPages}
          <span className="text-tt-white/50 ml-2 tt-blink">▼</span>
        </div>
      )}

      {loading ? (
        <div className="text-tt-cyan mt-4 text-center tt-blink">■ LOADING NEWS FEED... ■</div>
      ) : (
        <div className="space-y-1 mt-1">
          {visible.map((item, i) => (
            <div key={i} className="border-l-2 border-tt-yellow pl-1">
              <div className="text-tt-yellow font-bold leading-tight">
                {truncate(item.title, 38)}
              </div>
              {item.description && (
                <div className="text-tt-white/80 text-[0.85em] leading-snug">
                  {truncate(item.description, 80)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category nav */}
      <div className="absolute bottom-8 left-1 right-1">
        <div className="text-tt-yellow">{'─'.repeat(38)}</div>
        <div className="flex gap-4 text-sm mt-0.5">
          <button onClick={() => navigate(101)}  className="text-tt-red   hover:text-tt-white">101 UK</button>
          <button onClick={() => navigate(110)}  className="text-tt-green hover:text-tt-white">110 WORLD</button>
          <button onClick={() => navigate(120)}  className="text-tt-yellow hover:text-tt-white">120 TECH</button>
          <button onClick={() => navigate(130)}  className="text-tt-cyan  hover:text-tt-white">130 BIZ</button>
          <button onClick={() => navigate(100)}  className="text-tt-white/50 hover:text-tt-white ml-auto">100 HOME</button>
        </div>
      </div>
    </div>
  );
}
