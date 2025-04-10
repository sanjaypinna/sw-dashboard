"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useAtom } from "jotai";

import { ComparisonModal } from "./comparison-modal";
import { Filters } from "./filters";
import { SearchBar } from "./search-bar";
import { StarshipActions } from "./starship-actions";
import { StarshipList } from "./starship-list";
import { useUrlState } from "@/hooks/useUrlState";
import { starWarsClient } from "@/lib/api";
import { selectedStarshipsAtom } from "@/lib/atoms";
import type { Starship } from "@/lib/types";
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
  const { updateURL, searchParams } = useUrlState();
  const { ref, inView } = useInView();

  // URL-based state
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [hyperdriveFilter, setHyperdriveFilter] = useState<string | null>(
    searchParams.get("hyperdrive")
  );
  const [crewSizeFilter, setCrewSizeFilter] = useState<string | null>(
    searchParams.get("crew")
  );

  // Local state
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [isComparing, setIsComparing] = useState(false);
  const [selectedStarships, setSelectedStarships] = useAtom(
    selectedStarshipsAtom
  );

  // Debounce search term updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      updateURL({ search: searchTerm || null });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, updateURL]);

  // Update URL when filters change
  useEffect(() => {
    updateURL({
      hyperdrive: hyperdriveFilter,
      crew: crewSizeFilter,
    });
  }, [hyperdriveFilter, crewSizeFilter, updateURL]);

  // Fetch starships data
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

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  const allStarships =
    data?.pages.flatMap((page) => {
      if (page.status === 200 && page.body && "results" in page.body) {
        return page.body.results;
      }
      return [];
    }) || [];
  const filteredStarships = allStarships.filter(
    (starship: { hyperdrive_rating: string; crew: string }) => {
      let matchesHyperdrive = true;
      let matchesCrewSize = true;

      if (hyperdriveFilter && hyperdriveFilter !== "all") {
        const rating = parseFloat(starship.hyperdrive_rating);
        switch (hyperdriveFilter) {
          case "lt1":
            matchesHyperdrive = rating < 1.0;
            break;
          case "1to2":
            matchesHyperdrive = rating >= 1.0 && rating <= 2.0;
            break;
          case "gt2":
            matchesHyperdrive = rating > 2.0;
            break;
        }
      }

      if (crewSizeFilter && crewSizeFilter !== "all") {
        const crewText = starship.crew.replace(/,/g, "");
        let crewSize = 0;

        if (crewText.includes("-")) {
          const [min, max] = crewText
            .split("-")
            .map((part: string) => parseInt(part.trim(), 10));
          crewSize = Math.floor((min + max) / 2);
        } else {
          crewSize = parseInt(crewText, 10) || 0;
        }

        switch (crewSizeFilter) {
          case "1to5":
            matchesCrewSize = crewSize >= 1 && crewSize <= 5;
            break;
          case "6to50":
            matchesCrewSize = crewSize >= 6 && crewSize <= 50;
            break;
          case "gt50":
            matchesCrewSize = crewSize > 50;
            break;
        }
      }

      return matchesHyperdrive && matchesCrewSize;
    }
  );

  // Handlers
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
    updateURL({
      comparing: null,
      selected: null,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 mb-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full">
          <Filters
            hyperdriveFilter={hyperdriveFilter}
            crewSizeFilter={crewSizeFilter}
            onHyperdriveFilterChange={setHyperdriveFilter}
            onCrewSizeFilterChange={setCrewSizeFilter}
          />
          <StarshipActions
            selectedStarships={selectedStarships}
            onCompare={() => setIsComparing(true)}
            onReset={resetComparison}
          />
        </div>
      </div>

      <StarshipList
        status={status}
        error={error}
        starships={filteredStarships}
        selectedStarships={selectedStarships}
        onToggleSelect={toggleStarshipSelection}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        ref={ref}
      />

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
