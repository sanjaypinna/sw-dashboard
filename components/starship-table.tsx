import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Starship } from "@/lib/types";

interface StarshipTableProps {
  starships: Starship[];
  selectedStarships: Starship[];
  onToggleSelect: (starship: Starship) => void;
}

export function StarshipTable({
  starships,
  selectedStarships,
  onToggleSelect,
}: StarshipTableProps) {
  return (
    <div className="border rounded-lg  ">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Crew</TableHead>
            <TableHead>Hyperdrive</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {starships.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No starships found
              </TableCell>
            </TableRow>
          ) : (
            starships.map((starship) => {
              const isSelected = selectedStarships.some(
                (s) => s.name === starship.name
              );

              return (
                <TableRow
                  key={starship.name}
                  className={
                    isSelected ? "bg-amber-50 dark:bg-amber-950/20" : ""
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(starship)}
                      disabled={selectedStarships.length >= 3 && !isSelected}
                    />
                  </TableCell>
                  <TableCell>{starship.name}</TableCell>
                  <TableCell>{starship.model}</TableCell>
                  <TableCell>{starship.manufacturer}</TableCell>
                  <TableCell>{starship.crew}</TableCell>
                  <TableCell>{starship.hyperdrive_rating}</TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
