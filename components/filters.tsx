"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
  hyperdriveFilter: string | null;
  crewSizeFilter: string | null;
  onHyperdriveFilterChange: (value: string | null) => void;
  onCrewSizeFilterChange: (value: string | null) => void;
}
const FILTER_OPTIONS = {
  hyperdrive: [
    { value: "all", label: "All Ratings" },
    { value: "lt1", label: "Less than 1.0" },
    { value: "1to2", label: "1.0 to 2.0" },
    { value: "gt2", label: "Greater than 2.0" },
  ],
  crewSize: [
    { value: "all", label: "All Crew Sizes" },
    { value: "1to5", label: "1-5 crew" },
    { value: "6to50", label: "6-50 crew" },
    { value: "gt50", label: "50+ crew" },
  ],
};

export function Filters({
  hyperdriveFilter,
  crewSizeFilter,
  onHyperdriveFilterChange,
  onCrewSizeFilterChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row w-full gap-4">
      <div className="flex-1">
        <Select
          value={hyperdriveFilter || ""}
          onValueChange={(value) => onHyperdriveFilterChange(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Hyperdrive Rating" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.hyperdrive.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select
          value={crewSizeFilter || ""}
          onValueChange={(value) => onCrewSizeFilterChange(value || null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Crew Size" />
          </SelectTrigger>
          <SelectContent>
            {FILTER_OPTIONS.crewSize.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
