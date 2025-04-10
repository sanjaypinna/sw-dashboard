"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Starship } from "@/lib/types";

interface ComparisonModalProps {
  starships: Starship[];
  isOpen: boolean;
  onClose: () => void;
}

export function ComparisonModal({
  starships,
  isOpen,
  onClose,
}: ComparisonModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Starship Comparison</DialogTitle>
          <DialogDescription>
            Comparing {starships.length} selected starships
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b"></th>
                {starships.map((ship) => (
                  <th key={ship.name} className="text-left p-2 border-b">
                    {ship.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium p-2 border-b">Model</td>
                {starships.map((ship) => (
                  <td key={`${ship.name}-model`} className="p-2 border-b">
                    {ship.model}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="font-medium p-2 border-b">Manufacturer</td>
                {starships.map((ship) => (
                  <td
                    key={`${ship.name}-manufacturer`}
                    className="p-2 border-b"
                  >
                    {ship.manufacturer}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="font-medium p-2 border-b">Crew</td>
                {starships.map((ship) => (
                  <td key={`${ship.name}-crew`} className="p-2 border-b">
                    {ship.crew}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="font-medium p-2 border-b">Hyperdrive Rating</td>
                {starships.map((ship) => (
                  <td key={`${ship.name}-hyperdrive`} className="p-2 border-b">
                    {ship.hyperdrive_rating}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
