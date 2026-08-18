import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export const ApiStatusBar = () => {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  const busy = fetching > 0 || mutating > 0;

  if (!busy) return null;

  const label = mutating > 0 ? "Saving changes…" : "Loading…";

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
      <div className="h-1 w-full bg-violet-100 dark:bg-violet-950 overflow-hidden">
        <div className="h-full w-1/3 bg-violet-600 api-progress-bar" />
      </div>
      <div className="flex justify-center mt-2">
        <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-gray-900 dark:bg-gray-800 text-white text-xs font-medium px-3 py-1 shadow-lg border border-transparent dark:border-gray-700">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          {label}
        </span>
      </div>
    </div>
  );
};
