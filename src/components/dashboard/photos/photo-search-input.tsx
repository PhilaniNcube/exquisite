"use client";

import { useEffect, useState, useTransition } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhotoSearchInputProps {
  /** URL query param used to store the search term. */
  param?: string;
  label?: string | null;
  placeholder?: string;
  className?: string;
}

/**
 * Debounced photo search input that reads/writes the `q` URL param. The
 * server-side list re-renders when the term is committed and the page is
 * reset back to the first page.
 */
export function PhotoSearchInput({
  param = "q",
  label = "Search",
  placeholder = "Search by title or ID...",
  className,
}: PhotoSearchInputProps) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useQueryState(
    param,
    parseAsString.withOptions({ shallow: false, startTransition })
  );
  const [, setPage] = useQueryState(
    "page",
    parseAsString.withOptions({ shallow: false, startTransition })
  );

  const searchValue = query ?? "";
  const [input, setInput] = useState(searchValue);

  // Keep the input in sync when the query changes externally (clear, back/
  // forward navigation, etc.).
  useEffect(() => {
    setInput(searchValue);
  }, [searchValue]);

  // Debounce committing the typed value to the URL/server query.
  useEffect(() => {
    if (input === searchValue) return;

    const timer = setTimeout(() => {
      startTransition(() => {
        setQuery(input.trim() ? input : null);
        setPage(null);
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [input, searchValue, setQuery, setPage, startTransition]);

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          className="pl-8 pr-8"
          aria-busy={isPending}
        />
        {input ? (
          <button
            type="button"
            aria-label="Clear photo search"
            onClick={() => {
              setInput("");
              startTransition(() => {
                setQuery(null);
                setPage(null);
              });
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
