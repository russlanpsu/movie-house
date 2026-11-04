import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  enabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  root = null,
  rootMargin = "0px",
  threshold = 0,
}: UseIntersectionObserverOptions) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  // Храним актуальную версию callback,
  // чтобы не пересоздавать Observer при каждом рендере.
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const target = targetRef.current;

    if (!enabled || !target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, root, rootMargin, threshold]);

  return targetRef;
}