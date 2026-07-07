import { useEffect, useState } from 'react';
import { EndpointCard } from '@/components/EndpointCard';
import { TypingCursor } from '@/components/TypingCursor';
import { useGenerateStream } from '@/hooks/useGenerateStream';
import { getAlbums, getComments, getPosts, summarize, type Album, type Comment, type Post } from '@/lib/api';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Meteors } from '@/components/ui/meteors';

function useCachedList<T>(fetcher: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, error, isLoading };
}

function App() {
  const posts = useCachedList<Post>(getPosts);
  const comments = useCachedList<Comment>(getComments);
  const albums = useCachedList<Album>(getAlbums);

  const [prompt, setPrompt] = useState('');
  const {
    displayText: generated,
    isStreaming,
    isRevealing,
    error: generateError,
    run: runGenerate,
  } = useGenerateStream();

  const [summaryInput, setSummaryInput] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummaryError(null);
    try {
      const result = await summarize(summaryInput);
      setSummaryResult(result);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Summarize failed');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen p-6">
      <Meteors number={30} />
      <div className="relative z-10">
        <h1 className="text-xl font-semibold mb-6">LLM Pipeline Dashboard</h1>

      <div className="bento-grid max-w-6xl">
        <EndpointCard title="Generate (Stream)" className="area-generate">
          <textarea
            className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm"
            rows={2}
            placeholder="Enter a prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <ShimmerButton
            className="mt-2 px-6 py-2 text-sm self-start"
            disabled={isStreaming || !prompt.trim()}
            onClick={() => runGenerate(prompt)}
          >
            <span className="z-10 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              {isStreaming ? 'Generating...' : 'Generate'}
            </span>
          </ShimmerButton>
          {generateError && <p className="text-red-400 text-xs mt-2">{generateError}</p>}
          <p className="mt-2 text-sm whitespace-pre-wrap overflow-y-auto flex-1 min-h-[3rem]">
            {generated}
            {(isStreaming || isRevealing) && <TypingCursor />}
          </p>
        </EndpointCard>

        <EndpointCard title="Summarize" className="area-summarize">
          <textarea
            className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm"
            rows={2}
            placeholder="Paste text to summarize..."
            value={summaryInput}
            onChange={(e) => setSummaryInput(e.target.value)}
          />
          <ShimmerButton
            className="mt-2 px-6 py-2 text-sm self-start"
            disabled={isSummarizing || !summaryInput.trim()}
            onClick={handleSummarize}
          >
            <span className="z-10 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              {isSummarizing ? 'Summarizing...' : 'Summarize'}
            </span>
          </ShimmerButton>
          {summaryError && <p className="text-red-400 text-xs mt-2">{summaryError}</p>}
          <p className="mt-2 text-sm whitespace-pre-wrap overflow-y-auto flex-1 min-h-[3rem]">
            {summaryResult}
          </p>
        </EndpointCard>

        <EndpointCard title="Posts" className="area-posts">
          {posts.error && <p className="text-red-400 text-xs">{posts.error}</p>}
          <p className="text-sm text-white/60">
            {posts.isLoading ? 'Loading...' : `${posts.items.length} posts cached`}
          </p>
        </EndpointCard>

        <EndpointCard title="Comments" className="area-comments">
          {comments.error && <p className="text-red-400 text-xs">{comments.error}</p>}
          <p className="text-sm text-white/60">
            {comments.isLoading ? 'Loading...' : `${comments.items.length} comments cached`}
          </p>
        </EndpointCard>

        <EndpointCard title="Albums" className="area-albums">
          {albums.error && <p className="text-red-400 text-xs">{albums.error}</p>}
          <p className="text-sm text-white/60">
            {albums.isLoading ? 'Loading...' : `${albums.items.length} albums cached`}
          </p>
        </EndpointCard>
      </div>
      </div>
    </div>
  );
}

export default App;
