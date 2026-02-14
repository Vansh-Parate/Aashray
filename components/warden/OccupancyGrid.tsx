"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bed } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import type { OccupancyGrid as OccupancyGridType, Listing } from "@/types";

interface OccupancyGridProps {
  listings: Listing[];
  selectedListingId: string | null;
  onSelectListing: (id: string) => void;
  occupancy: OccupancyGridType | null;
  onUpdateOccupancy: (grid: OccupancyGridType) => void;
}

type BedStatus = "Empty" | "Occupied" | "Reserved";

export function OccupancyGrid({
  listings,
  selectedListingId,
  onSelectListing,
  occupancy,
  onUpdateOccupancy,
}: OccupancyGridProps) {
  const [selectedBed, setSelectedBed] = useState<{
    roomNumber: string;
    bed: { bedNumber: string; status: BedStatus; tenantId?: string; tenantName?: string };
  } | null>(null);
  const [dialogStatus, setDialogStatus] = useState<BedStatus>("Empty");
  const [tenantName, setTenantName] = useState("");

  const handleBedClick = (roomNumber: string, bed: { bedNumber: string; status: BedStatus; tenantId?: string; tenantName?: string }) => {
    setSelectedBed({ roomNumber, bed });
    setDialogStatus(bed.status);
    setTenantName(bed.tenantName || "");
  };

  const saveBed = () => {
    if (!occupancy || !selectedBed) return;
    const updated = {
      ...occupancy,
      rooms: occupancy.rooms.map((room) =>
        room.roomNumber === selectedBed.roomNumber
          ? {
            ...room,
            beds: room.beds.map((b) =>
              b.bedNumber === selectedBed.bed.bedNumber
                ? {
                  ...b,
                  status: dialogStatus,
                  tenantName: dialogStatus !== "Empty" ? tenantName : undefined,
                  tenantId: dialogStatus === "Occupied" ? (b.tenantId || `tenant_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`) : undefined,
                }
                : b
            ),
          }
          : room
      ),
      updatedAt: new Date().toISOString(),
    };
    onUpdateOccupancy(updated);
    setSelectedBed(null);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">Select listing</Label>
          <Select value={selectedListingId || ""} onValueChange={onSelectListing}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Choose a listing" />
            </SelectTrigger>
            <SelectContent>
              {listings.map((l) => (
                <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {occupancy && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {occupancy.rooms.map((room) => (
              <Card key={room.roomNumber} className="mb-6 rounded-3xl">
                <CardHeader>
                  <h4 className="font-semibold">Room {room.roomNumber}</h4>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {room.beds.map((bed) => (
                      <motion.div
                        key={bed.bedNumber}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleBedClick(room.roomNumber, bed)}
                        className={cn(
                          "p-6 rounded-2xl cursor-pointer transition-all text-center",
                          bed.status === "Empty" && "bg-safety-high/20 text-safety-high",
                          bed.status === "Occupied" && "bg-accent-danger/20 text-accent-danger",
                          bed.status === "Reserved" && "bg-accent-warning/20 text-accent-warning"
                        )}
                      >
                        <Bed className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-semibold">Bed {bed.bedNumber}</p>
                        <Badge variant="secondary" className="mt-2">{bed.status}</Badge>
                        {bed.tenantName && <p className="text-sm mt-2">{bed.tenantName}</p>}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
      <Dialog open={!!selectedBed} onOpenChange={() => setSelectedBed(null)}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Bed {selectedBed?.bed.bedNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={dialogStatus} onValueChange={(v) => setDialogStatus(v as BedStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Empty">Empty</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dialogStatus !== "Empty" && (
              <div>
                <Label>Tenant name</Label>
                <Input
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  placeholder="Tenant name"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={saveBed}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
