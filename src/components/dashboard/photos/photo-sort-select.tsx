"use client";

import { useTransition } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PhotoSortSelectProps {
  /** URL query param used to store the sort direction. */
  param?: string;
  label?: string | null;
  ascLabel?: string;
  descLabel?: string;
  className?: string;
  triggerClassName?: string;
}

/**
 * Ascending/descending order control for photo lists. Writes to the `sort`
 * URL param and resets pagination so results always start on page one.
 */
export function PhotoSortSelect({
  param = "sort",
  label = "Sort order",
  ascLabel = "Ascending (A–Z)",
  descLabel = "Descending (Z–A)",
  className,
  triggerClassName,
}: PhotoSortSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [sortOrder, setSortOrder] = useQueryState(
    param,
    parseAsString.withOptions({ shallow: false, startTransition })
  );
  const [, setPage] = useQueryState(
    "page",
    parseAsString.withOptions({ shallow: false, startTransition })
  );

  const isDescending = sortOrder === "desc";

  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
      ) : null}
      <Select
        value={isDescending ? "desc" : "asc"}
        disabled={isPending}
        onValueChange={(value) => {
          startTransition(() => {
            setSortOrder(value === "asc" ? null : value);
            setPage(null);
          });
        }}
      >
        <SelectTrigger className={cn("w-full", triggerClassName)}>
          <ArrowUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">{ascLabel}</SelectItem>
          <SelectItem value="desc">{descLabel}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
