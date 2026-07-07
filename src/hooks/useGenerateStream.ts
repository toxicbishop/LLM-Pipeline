import { useCallback, useEffect, useRef, useState } from 'react';
import { generateStream, ApiError } from '@/lib/api';

// ms per revealed character. Tuned to feel deliberate without feeling
// sluggish on longer completions — lower this if generations run long.
const REVEAL_SPEED_MS = 12;

interface UseGenerateStreamResult {
  /** Text revealed so far, at the steady typing cadence. Render this. */
  displayText: string;
  /** True while the network is still sending chunks. */
  isStreaming: boolean;
  /** True while the reveal is still catching up to text that has already arrived. */
  isRevealing: boolean;
  error: string | null;
  run: (prompt: string) => void;
  stop: () => void;
  reset: () => void;
}

export function useGenerateStream(): UseGenerateStreamResult {
  const [displayText, setDisplayText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Everything that has arrived from the network so far — the reveal loop
  // drains toward this at a fixed pace, so it's a ref (not state) since it
  // updates far more often than we want to re-render.
  const rawTextRef = useRef('');
  const revealedCountRef = useRef(0);

  // One persistent interval for the life of this hook. Draining a queue at
  // a fixed cadence like this decouples "text arrived" from "text shown":
  // real chunks arrive in bursts (or, in the backend's stub-response path,
  // one whole word every ~100ms) — rendering directly on arrival looks
  // stuttery either way. This ticks at a constant rate no matter how choppy
  // the underlying data delivery is, and simply has nothing to do on ticks
  // where the reveal has already caught up.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (revealedCountRef.current < rawTextRef.current.length) {
        revealedCountRef.current += 1;
        setDisplayText(rawTextRef.current.slice(0, revealedCountRef.current));
      }
    }, REVEAL_SPEED_MS);
    return () => window.clearInterval(id);
  }, []);

  const run = useCallback((prompt: string) => {
    // Cancel any in-flight stream before starting a new one
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    rawTextRef.current = '';
    revealedCountRef.current = 0;
    setDisplayText('');
    setError(null);
    setIsStreaming(true);

    generateStream(
      prompt,
      (chunk) => {
        rawTextRef.current += chunk;
      },
      controller.signal
    )
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof ApiError ? err.message : 'Stream failed');
      })
      .finally(() => setIsStreaming(false));
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    // Snap the reveal forward to whatever actually arrived — otherwise
    // stopping mid-stream would leave the display stuck mid-word forever
    // since the reveal loop would have nothing left to catch up to.
    revealedCountRef.current = rawTextRef.current.length;
    setDisplayText(rawTextRef.current);
  }, []);

  const reset = useCallback(() => {
    rawTextRef.current = '';
    revealedCountRef.current = 0;
    setDisplayText('');
    setError(null);
  }, []);

  const isRevealing = displayText.length < rawTextRef.current.length;

  return { displayText, isStreaming, isRevealing, error, run, stop, reset };
}
