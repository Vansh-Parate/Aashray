"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createListing } from "@/lib/storage/listings";
import { getOrCreateOccupancyForListing } from "@/lib/storage/occupancy";
import type { Listing } from "@/types";

const defaultAmenities: Listing["amenities"] = {
  cctv: false,
  securityGuard: false,
  biometrics: false,
  wifi: false,
  meals: false,
  laundry: false,
  parking: false,
  gym: false,
};

interface ListingFormProps {
  wardenId: string;
  onSuccess: () => void;
}

export function ListingForm({ wardenId, onSuccess }: ListingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Listing>>({
    warderId: wardenId,
    type: "PG",
    gender: "Co-ed",
    amenities: defaultAmenities,
    rules: [],
    images: [],
    pricing: { rent: 0, deposit: 0, currency: "INR" },
    location: { address: "", city: "", coordinates: { lat: 18.5, lng: 73.8 } },
    occupancy: { total: 0, occupied: 0, available: 0 },
  });

  const update = (field: string, value: unknown) => {
    if (field.includes(".")) {
      const [a, b] = field.split(".");
      setFormData((prev) => {
        const current = (prev as Record<string, unknown>)[a];
        const base: Record<string, unknown> = typeof current === "object" && current !== null && !Array.isArray(current) ? (current as Record<string, unknown>) : {};
        return { ...prev, [a]: { ...base, [b]: value } };
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    const data = formData as Listing;
    if (!data.title || !data.location?.city || !data.pricing?.rent || !data.occupancy?.total) return;
    const listing = createListing({
      warderId: wardenId,
      title: data.title,
      type: data.type || "PG",
      location: data.location!,
      pricing: data.pricing!,
      amenities: data.amenities || defaultAmenities,
      images: data.images?.length ? data.images : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
      occupancy: { total: data.occupancy!.total, occupied: 0, available: data.occupancy!.total },
      gender: data.gender || "Co-ed",
      rules: Array.isArray(data.rules) ? data.rules : [],
      description: data.description || "",
    });
    getOrCreateOccupancyForListing(listing.id, data.occupancy.total);
    onSuccess();
  };

  return (
    <Card className="max-w-2xl mx-auto rounded-3xl">
      <CardHeader>
        <h2 className="text-xl font-semibold">Add New Listing</h2>
        <p className="text-sm text-text-muted">Step {step} of 4</p>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div><Label>Title</Label><Input value={formData.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Comfort PG" /></div>
              <div><Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => update("type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Address</Label><Textarea value={formData.location?.address} onChange={(e) => update("location.address", e.target.value)} /></div>
              <div><Label>City</Label><Input value={formData.location?.city} onChange={(e) => update("location.city", e.target.value)} /></div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div><Label>Monthly rent (₹)</Label><Input type="number" value={formData.pricing?.rent || ""} onChange={(e) => update("pricing.rent", Number(e.target.value))} /></div>
              <div><Label>Security deposit (₹)</Label><Input type="number" value={formData.pricing?.deposit || ""} onChange={(e) => update("pricing.deposit", Number(e.target.value))} /></div>
              <div><Label>Total beds</Label><Input type="number" value={formData.occupancy?.total || ""} onChange={(e) => update("occupancy.total", Number(e.target.value))} /></div>
              <div><Label>Gender</Label>
                <Select value={formData.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male only</SelectItem>
                    <SelectItem value="Female">Female only</SelectItem>
                    <SelectItem value="Co-ed">Co-ed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h4 className="font-semibold">Safety & facilities</h4>
              <div className="grid grid-cols-2 gap-4">
                {(["cctv", "securityGuard", "biometrics", "wifi", "meals", "laundry", "parking", "gym"] as const).map((k) => (
                  <label key={k} className="flex items-center gap-2">
                    <Checkbox checked={!!formData.amenities?.[k]} onCheckedChange={(c) => update("amenities." + k, !!c)} />
                    <span className="text-sm">{k === "securityGuard" ? "Security guard" : k}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div><Label>Image URLs (comma-separated)</Label><Input placeholder="https://..." value={(formData.images || []).join(", ")} onChange={(e) => update("images", e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [])} /></div>
              <div><Label>Description</Label><Textarea rows={5} value={formData.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your property..." /></div>
              <div><Label>Rules (one per line)</Label><Textarea value={(formData.rules || []).join("\n")} onChange={(e) => update("rules", e.target.value.split("\n").filter(Boolean))} placeholder="No smoking&#10;No loud music after 10 PM" /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Previous</Button> : <div />}
        {step < 4 ? <Button onClick={() => setStep((s) => s + 1)}>Next</Button> : <Button onClick={handleSubmit}>Create Listing</Button>}
      </CardFooter>
    </Card>
  );
}
