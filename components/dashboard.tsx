"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { fetchStarships } from "@/lib/api";
import { StarshipTable } from "./starship-table";

export function Dashboard() {
  const { data, status, error } = useInfiniteQuery({
    queryKey: ["starships"],
    queryFn: ({ pageParam }) => fetchStarships({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const page = url.searchParams.get("page");
        return page ? Number.parseInt(page) : undefined;
      }
      return undefined;
    },
  });

  const starships = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="container mx-auto py-6 space-y-6">

      {status === "pending" ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : status === "error" ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error: {(error as Error).message}
        </div>
      ) : (
        <StarshipTable
          starships={starships}
          selectedStarships={[]}
          onToggleSelect={() => {}}
        />
      )}
    </div>
  );
}
