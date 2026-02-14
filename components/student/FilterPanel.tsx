"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { AMENITY_LABELS } from "@/lib/constants/amenities";

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  gender: string;
  minSafety: number;
  amenities: string[];
  hasAvailability: boolean;
}

const defaultFilters: FilterState = {
  minPrice: 0,
  maxPrice: 30000,
  gender: "any",
  minSafety: 0,
  amenities: [],
  hasAvailability: true,
};

interface FilterPanelProps {
  filters: FilterState;
  onApply: (f: FilterState) => void;
}

export function FilterPanel({ filters, onApply }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<FilterState>(filters);

  const handleApply = () => {
    onApply(local);
    setOpen(false);
  };

  const toggleAmenity = (key: string) => {
    setLocal((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key],
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 border border-brand-gold text-brand-gold rounded-lg px-4 py-2 text-sm font-medium hover:bg-brand-gold/5 transition-colors self-start sm:self-auto">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div>
            <Label>Price range (₹/month)</Label>
            <div className="flex gap-2 mt-2">
              <input
                type="number"
                className="w-24 rounded-lg border border-surface-dark px-2 py-1.5 text-sm"
                value={local.minPrice}
                onChange={(e) => setLocal((p) => ({ ...p, minPrice: Number(e.target.value) || 0 }))}
              />
              <span className="self-center text-text-muted">–</span>
              <input
                type="number"
                className="w-24 rounded-lg border border-surface-dark px-2 py-1.5 text-sm"
                value={local.maxPrice}
                onChange={(e) => setLocal((p) => ({ ...p, maxPrice: Number(e.target.value) || 30000 }))}
              />
            </div>
          </div>
          <div>
            <Label>Gender</Label>
            <Select
              value={local.gender}
              onValueChange={(v) => setLocal((p) => ({ ...p, gender: v }))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="Male">Male only</SelectItem>
                <SelectItem value="Female">Female only</SelectItem>
                <SelectItem value="Co-ed">Co-ed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Min. safety score: {local.minSafety}</Label>
            <Slider
              value={[local.minSafety]}
              onValueChange={([v]) => setLocal((p) => ({ ...p, minSafety: v ?? 0 }))}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(AMENITY_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={local.amenities.includes(key)}
                    onCheckedChange={() => toggleAmenity(key)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="avail"
              checked={local.hasAvailability}
              onCheckedChange={(c) => setLocal((p) => ({ ...p, hasAvailability: !!c }))}
            />
            <Label htmlFor="avail">Only show available beds</Label>
          </div>
          <Button onClick={handleApply} className="w-full">Apply filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { defaultFilters };
