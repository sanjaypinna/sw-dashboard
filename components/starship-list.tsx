import { Loader2 } from "lucide-react"
import { StarshipTable } from "./starship-table"
import type { Starship } from "@/lib/types"

interface StarshipListProps {
  status: "pending" | "error" | "success"
  error: Error | null
  starships: Starship[]
  selectedStarships: Starship[]
  onToggleSelect: (starship: Starship) => void
  isFetchingNextPage: boolean
  hasNextPage: boolean
  ref: (node?: Element | null) => void
}

export function StarshipList({
  status,
  error,
  starships,
  selectedStarships,
  onToggleSelect,
  isFetchingNextPage,
  hasNextPage,
  ref,
}: StarshipListProps) {
  if (status === "pending") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        Error: {error?.message}
      </div>
    )
  }

  return (
    <>
      <StarshipTable
        starships={starships}
        selectedStarships={selectedStarships}
        onToggleSelect={onToggleSelect}
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
  )
}