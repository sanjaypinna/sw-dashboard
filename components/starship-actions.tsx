import { Button } from "./ui/button"
import { X } from "lucide-react"
import type { Starship } from "@/lib/types"

interface StarshipActionsProps {
  selectedStarships: Starship[]
  onCompare: () => void
  onReset: () => void
}

export function StarshipActions({ selectedStarships, onCompare, onReset }: StarshipActionsProps) {
  if (selectedStarships.length === 0) return null

  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={onCompare}
        className="bg-amber-500 hover:bg-amber-600 text-black"
      >
        Compare {selectedStarships.length} Starship
        {selectedStarships.length > 1 ? "s" : ""}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="text-muted-foreground"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Clear selection</span>
      </Button>
    </div>
  )
}