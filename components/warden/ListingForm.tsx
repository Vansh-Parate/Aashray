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
import { AlertCircle } from "lucide-react";
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

type ValidationErrors = Record<string, string>;

function ValidationMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-accent-danger mt-1">
      <AlertCircle className="w-3 h-3" />
      {message}
    </p>
  );
}

export function ListingForm({ wardenId, onSuccess }: ListingFormProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
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
    // Clear validation error for this field when user types
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

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

  const validateStep = (s: number): boolean => {
    const newErrors: ValidationErrors = {};

    if (s === 1) {
      if (!formData.title?.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.trim().length < 3) {
        newErrors.title = "Title must be at least 3 characters";
      }
      if (!formData.location?.address?.trim()) {
        newErrors["location.address"] = "Address is required";
      }
      if (!formData.location?.city?.trim()) {
        newErrors["location.city"] = "City is required";
      }
    }

    if (s === 2) {
      if (!formData.pricing?.rent || formData.pricing.rent <= 0) {
        newErrors["pricing.rent"] = "Rent must be greater than 0";
      } else if (formData.pricing.rent > 500000) {
        newErrors["pricing.rent"] = "Rent seems too high (max ₹5,00,000)";
      }
      if (!formData.pricing?.deposit || formData.pricing.deposit < 0) {
        newErrors["pricing.deposit"] = "Deposit must be 0 or more";
      }
      if (!formData.occupancy?.total || formData.occupancy.total <= 0) {
        newErrors["occupancy.total"] = "Total beds must be at least 1";
      } else if (formData.occupancy.total > 200) {
        newErrors["occupancy.total"] = "Max 200 beds allowed";
      }
    }

    // Step 3 (amenities) has no required fields
    // Step 4 (description/images) has no strict requirements

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = () => {
    // Validate all steps before submit
    const allErrors: ValidationErrors = {};

    if (!formData.title?.trim()) allErrors.title = "Title is required";
    if (!formData.location?.city?.trim()) allErrors["location.city"] = "City is required";
    if (!formData.pricing?.rent || formData.pricing.rent <= 0) allErrors["pricing.rent"] = "Rent is required";
    if (!formData.occupancy?.total || formData.occupancy.total <= 0) allErrors["occupancy.total"] = "Total beds is required";

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Jump to first step with errors
      if (allErrors.title || allErrors["location.address"] || allErrors["location.city"]) setStep(1);
      else if (allErrors["pricing.rent"] || allErrors["pricing.deposit"] || allErrors["occupancy.total"]) setStep(2);
      return;
    }

    const data = formData as Listing;
    const listing = createListing({
      warderId: wardenId,
      title: data.title.trim(),
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

  // Step progress indicator
  const stepLabels = ["Basic Info", "Pricing & Capacity", "Amenities", "Details"];

  return (
    <Card className="max-w-2xl mx-auto rounded-3xl">
      <CardHeader>
        <h2 className="text-xl font-semibold">Add New Listing</h2>
        <p className="text-sm text-text-muted">Step {step} of 4 — {stepLabels[step - 1]}</p>
        {/* Step progress bar */}
        <div className="flex gap-2 mt-3">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary-dark" : "bg-surface-dark"
                }`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <Label>Title <span className="text-accent-danger">*</span></Label>
                <Input
                  value={formData.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Comfort PG Near Station"
                  className={errors.title ? "border-accent-danger" : ""}
                />
                <ValidationMessage message={errors.title} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(v) => update("type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Address <span className="text-accent-danger">*</span></Label>
                <Textarea
                  value={formData.location?.address}
                  onChange={(e) => update("location.address", e.target.value)}
                  placeholder="Full street address"
                  className={errors["location.address"] ? "border-accent-danger" : ""}
                />
                <ValidationMessage message={errors["location.address"]} />
              </div>
              <div>
                <Label>City <span className="text-accent-danger">*</span></Label>
                <Input
                  value={formData.location?.city}
                  onChange={(e) => update("location.city", e.target.value)}
                  placeholder="e.g. Mumbai"
                  className={errors["location.city"] ? "border-accent-danger" : ""}
                />
                <ValidationMessage message={errors["location.city"]} />
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <Label>Monthly rent (₹) <span className="text-accent-danger">*</span></Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.pricing?.rent || ""}
                  onChange={(e) => update("pricing.rent", Number(e.target.value))}
                  placeholder="e.g. 8000"
                  className={errors["pricing.rent"] ? "border-accent-danger" : ""}
                />
                <ValidationMessage message={errors["pricing.rent"]} />
              </div>
              <div>
                <Label>Security deposit (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  value={formData.pricing?.deposit || ""}
                  onChange={(e) => update("pricing.deposit", Number(e.target.value))}
                  placeholder="e.g. 15000"
                  className={errors["pricing.deposit"] ? "border-accent-danger" : ""}
                />
                <ValidationMessage message={errors["pricing.deposit"]} />
              </div>
              <div>
                <Label>Total beds <span className="text-accent-danger">*</span></Label>
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={formData.occupancy?.total || ""}
                  onChange={(e) => update("occupancy.total", Number(e.target.value))}
                  placeholder="e.g. 20"
                  className={errors["occupancy.total"] ? "border-accent-danger" : ""}
                />
                <ValidationMessage message={errors["occupancy.total"]} />
              </div>
              <div>
                <Label>Gender</Label>
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
              <p className="text-sm text-text-muted">Select all amenities available at this property</p>
              <div className="grid grid-cols-2 gap-4">
                {(["cctv", "securityGuard", "biometrics", "wifi", "meals", "laundry", "parking", "gym"] as const).map((k) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox checked={!!formData.amenities?.[k]} onCheckedChange={(c) => update("amenities." + k, !!c)} />
                    <span className="text-sm capitalize">{k === "securityGuard" ? "Security guard" : k}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <Label>Image URLs (comma-separated)</Label>
                <Input
                  placeholder="https://..."
                  value={(formData.images || []).join(", ")}
                  onChange={(e) => update("images", e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [])}
                />
                <p className="text-xs text-text-muted mt-1">Leave empty for a default image</p>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe your property..."
                />
              </div>
              <div>
                <Label>Rules (one per line)</Label>
                <Textarea
                  value={(formData.rules || []).join("\n")}
                  onChange={(e) => update("rules", e.target.value.split("\n").filter(Boolean))}
                  placeholder={"No smoking\nNo loud music after 10 PM"}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? <Button variant="outline" onClick={() => setStep((s) => s - 1)}>Previous</Button> : <div />}
        {step < 4 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Create Listing</Button>
        )}
      </CardFooter>
    </Card>
  );
}
