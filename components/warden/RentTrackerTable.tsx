"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { markRentAsPaid, generateMonthlyRent } from "@/lib/storage/rent";
import { getOccupancyByListingId } from "@/lib/storage/occupancy";
import type { RentRecord } from "@/types";
import type { Listing } from "@/types";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN");
}

interface RentTrackerTableProps {
  listings: Listing[];
  records: RentRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onRefresh: () => void;
  onMarkPaid?: () => void;
  onGenerateRent?: () => void;
}

export function RentTrackerTable({
  listings,
  records,
  selectedMonth,
  onMonthChange,
  onRefresh,
  onMarkPaid,
  onGenerateRent,
}: RentTrackerTableProps) {
  const totalExpected = records.reduce((s, r) => s + r.amount, 0);
  const totalCollected = records.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);
  const totalPending = totalExpected - totalCollected;

  const generateRent = (listingId: string) => {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return;
    const occupancy = getOccupancyByListingId(listingId);
    if (!occupancy) return;
    generateMonthlyRent(listingId, selectedMonth, listing.pricing.rent, occupancy);
    onRefresh();
    onGenerateRent?.();
  };

  const handleMarkPaid = (recordId: string) => {
    markRentAsPaid(recordId);
    onRefresh();
    onMarkPaid?.();
  };

  const months: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold text-lg">Rent Tracker</h3>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>{new Date(m + "-01").toLocaleString("default", { month: "long", year: "numeric" })}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => listings[0] && generateRent(listings[0].id)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate rent
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Room / Bed</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.tenantName}</TableCell>
                  <TableCell>{r.roomNumber} / {r.bedNumber}</TableCell>
                  <TableCell>₹{r.amount.toLocaleString()}</TableCell>
                  <TableCell>{formatDate(r.dueDate)}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Paid" ? "success" : r.status === "Overdue" ? "destructive" : "secondary"}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {r.status !== "Paid" && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkPaid(r.id)}>Mark paid</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="rounded-3xl">
          <CardHeader><h4 className="font-semibold">Total Expected</h4></CardHeader>
          <CardContent><p className="text-2xl font-bold">₹{totalExpected.toLocaleString()}</p></CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader><h4 className="font-semibold">Collected</h4></CardHeader>
          <CardContent><p className="text-2xl font-bold text-safety-high">₹{totalCollected.toLocaleString()}</p></CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader><h4 className="font-semibold">Pending</h4></CardHeader>
          <CardContent><p className="text-2xl font-bold text-accent-warning">₹{totalPending.toLocaleString()}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
