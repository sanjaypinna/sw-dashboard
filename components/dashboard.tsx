"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { StarshipTable } from "@/components/starship-table";
import { starWarsClient } from "@/lib/api";
import { selectedStarshipsAtom } from "@/lib/atoms";
import { Starship } from "@/lib/types";
import { useAtom } from "jotai";
import { ComparisonModal } from "./comparison-modal";
import { Filters } from "./filters";
import { SearchBar } from "./search-bar";
import { Button } from "./ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";

interface StarshipResponse {
  next: string | null;
  results: Starship[];
}
interface ApiResponse {
  status: number;
  body?: StarshipResponse;
}
export function Dashboard() {
  const { ref, inView } = useInView();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [hyperdriveFilter, setHyperdriveFilter] = useState<string | null>(null);
  const [crewSizeFilter, setCrewSizeFilter] = useState<string | null>(null);
  const [selectedStarships, setSelectedStarships] = useAtom(
    selectedStarshipsAtom
  );
  const [isComparing, setIsComparing] = useState(false);

  // Add debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["starships", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await starWarsClient.getStarships.query({
        query: {
          page: pageParam.toString(),
          search: debouncedSearch,
        },
      });

      if (response.status === 200) {
        return {
          status: response.status,
          body: response.body as StarshipResponse,
        };
      }

      return {
        status: response.status,
        body: undefined,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiResponse) => {
      try {
        if (lastPage.status === 200 && lastPage.body?.next) {
          // Handle both absolute and relative URLs
          const urlString = lastPage.body.next;
          const url = urlString.startsWith("http")
            ? new URL(urlString)
            : new URL(urlString, window.location.origin);

          const page = url.searchParams.get("page");
          return page ? parseInt(page, 10) : undefined;
        }
      } catch (error) {
        console.error("Error parsing next page URL:", error);
      }
      return undefined;
    },
  });

  // Load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  //  access pages
  const allStarships =
    data?.pages.flatMap((page) => {
      if (page.status === 200 && page.body && "results" in page.body) {
        return page.body.results;
      }
      return [];
    }) || [];

  // Apply filters to starships
  const filteredStarships = allStarships.filter((starship: Starship) => {
    if (hyperdriveFilter && hyperdriveFilter !== "all") {
      const rating = parseFloat(starship.hyperdrive_rating);
      switch (hyperdriveFilter) {
        case "lt1":
          if (!(rating < 1.0)) return false;
          break;
        case "1to2":
          if (!(rating >= 1.0 && rating <= 2.0)) return false;
          break;
        case "gt2":
          if (!(rating > 2.0)) return false;
          break;
      }
    }

    if (crewSizeFilter && crewSizeFilter !== "all") {
      const crewText = starship.crew.replace(/,/g, "");
      let crewSize = 0;

      if (crewText.includes("-")) {
        const [min, max] = crewText.split("-").map((n) => parseInt(n.trim()));
        crewSize = Math.floor((min + max) / 2);
      } else {
        crewSize = parseInt(crewText) || 0;
      }

      switch (crewSizeFilter) {
        case "1to5":
          if (!(crewSize >= 1 && crewSize <= 5)) return false;
          break;
        case "6to50":
          if (!(crewSize >= 6 && crewSize <= 50)) return false;
          break;
        case "gt50":
          if (!(crewSize > 50)) return false;
          break;
      }
    }

    return true;
  });
  const toggleStarshipSelection = (starship: Starship) => {
    setSelectedStarships((prev) => {
      const isSelected = prev.some((s) => s.name === starship.name);
      if (isSelected) {
        return prev.filter((s) => s.name !== starship.name);
      } else {
        if (prev.length < 3) {
          return [...prev, starship];
        }
        return prev;
      }
    });
  };

  const resetComparison = () => {
    setSelectedStarships([]);
    setIsComparing(false);
  };

  return (
    <div className="container mx-auto py-6 ">
      <div className="flex flex-col gap-4 mb-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <div className=" flex flex-wrap lg:flex-nowrap  gap-4 w-full">
          <Filters
            hyperdriveFilter={hyperdriveFilter}
            crewSizeFilter={crewSizeFilter}
            onHyperdriveFilterChange={setHyperdriveFilter}
            onCrewSizeFilterChange={setCrewSizeFilter}
          />
          {selectedStarships.length > 0 && (
            <div className="flex gap-2 w-full">
              <Button
                onClick={() => setIsComparing(true)}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                Compare {selectedStarships.length} Starship
                {selectedStarships.length > 1 ? "s" : ""}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={resetComparison}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear selection</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {status === "pending" ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : status === "error" ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error: {(error as unknown as Error).message}
        </div>
      ) : (
        <>
          <StarshipTable
            starships={filteredStarships}
            selectedStarships={selectedStarships}
            onToggleSelect={toggleStarshipSelection}
          />

          {isFetchingNextPage ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          ) : hasNextPage ? (
            <div ref={ref} className="h-10" />
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No more starships to load
            </p>
          )}
        </>
      )}
      {isComparing && (
        <ComparisonModal
          starships={selectedStarships}
          isOpen={isComparing}
          onClose={() => setIsComparing(false)}
        />
      )}
    </div>
  );
}
