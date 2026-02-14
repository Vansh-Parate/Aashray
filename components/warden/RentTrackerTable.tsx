"use client";

import { useState } from "react";
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
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDown,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { markRentAsPaid, generateMonthlyRent } from "@/lib/storage/rent";
import { getOccupancyByListingId, getOrCreateOccupancyForListing } from "@/lib/storage/occupancy";
import { downloadReceipt } from "@/lib/utils/receipt-pdf";
import type { RentRecord, Listing } from "@/types";

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface RentTrackerTableProps {
  listings: Listing[];
  records: RentRecord[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onRefresh: () => void;
  listingMap: Record<string, Listing>;
}

export function RentTrackerTable({
  listings,
  records,
  selectedMonth,
  onMonthChange,
  onRefresh,
  listingMap,
}: RentTrackerTableProps) {
  const [message, setMessage] = useState<{ text: string; type: "success" | "warning" } | null>(null);
  const totalExpected = records.reduce((s, r) => s + r.amount, 0);
  const paidRecords = records.filter((r) => r.status === "Paid");
  const pendingRecords = records.filter((r) => r.status === "Pending");
  const overdueRecords = records.filter((r) => r.status === "Overdue");
  const totalCollected = paidRecords.reduce((s, r) => s + r.amount, 0);
  const totalPending = totalExpected - totalCollected;
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const generateRentForAll = () => {
    if (listings.length === 0) {
      setMessage({ text: "No listings found. Add a listing first.", type: "warning" });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    let totalGenerated = 0;
    let totalOccupied = 0;

    for (const listing of listings) {
      let occupancy = getOccupancyByListingId(listing.id);
      if (!occupancy) {
        occupancy = getOrCreateOccupancyForListing(listing.id, listing.occupancy.total);
      }
      // Count occupied beds
      const occupied = occupancy.rooms.flatMap((r) => r.beds).filter((b) => b.status === "Occupied" && b.tenantName);
      totalOccupied += occupied.length;
      if (occupied.length > 0) {
        const generated = generateMonthlyRent(listing.id, selectedMonth, listing.pricing.rent, occupancy);
        totalGenerated += generated.length;
      }
    }

    if (totalOccupied === 0) {
      setMessage({ text: "No occupied beds found. Add tenants in Occupancy first.", type: "warning" });
    } else if (totalGenerated === 0) {
      setMessage({ text: "Rent already generated for all occupied beds this month.", type: "warning" });
    } else {
      setMessage({ text: `Generated rent for ${totalGenerated} tenant(s).`, type: "success" });
    }
    setTimeout(() => setMessage(null), 4000);
    onRefresh();
  };

  const handleMarkPaid = (recordId: string) => {
    markRentAsPaid(recordId);
    onRefresh();
  };

  const handlePrintReceipt = (record: RentRecord) => {
    downloadReceipt(record, listingMap[record.listingId]);
  };

  const months: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "Overdue":
        return <AlertCircle className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const statusColors = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-safety-high/15 text-safety-high border-safety-high/30";
      case "Overdue":
        return "bg-accent-danger/15 text-accent-danger border-accent-danger/30";
      default:
        return "bg-accent-warning/15 text-accent-warning border-accent-warning/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-surface-dark shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Total Expected</p>
                <p className="text-2xl font-bold text-text-primary mt-1">₹{totalExpected.toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-1">{records.length} records</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary-dark" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-surface-dark shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Collected</p>
                <p className="text-2xl font-bold text-safety-high mt-1">₹{totalCollected.toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-1">{paidRecords.length} paid</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-safety-high/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-safety-high" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-surface-dark shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Pending</p>
                <p className="text-2xl font-bold text-accent-warning mt-1">₹{totalPending.toLocaleString()}</p>
                <p className="text-xs text-text-muted mt-1">{pendingRecords.length + overdueRecords.length} remaining</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent-warning/10 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-accent-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-surface-dark shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider font-medium">Collection Rate</p>
                <p className="text-2xl font-bold text-primary-dark mt-1">{collectionRate}%</p>
                <div className="w-full bg-surface-dark rounded-full h-2 mt-2">
                  <div
                    className="bg-safety-high rounded-full h-2 transition-all duration-500"
                    style={{ width: `${collectionRate}%` }}
                  />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-primary-dark" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card className="rounded-2xl border-surface-dark shadow-soft">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <h3 className="font-semibold text-lg text-text-primary">Payment Records</h3>
            <p className="text-sm text-text-muted mt-0.5">
              Track and manage rent payments for your properties
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="w-44 rounded-xl">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {new Date(m + "-01").toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={generateRentForAll}
              className="rounded-xl bg-primary-dark hover:bg-primary text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Rent
            </Button>
          </div>
        </CardHeader>
        {message && (
          <div className={`mx-6 mb-2 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === "warning"
              ? "bg-accent-warning/15 text-accent-warning"
              : "bg-safety-high/15 text-safety-high"
            }`}>
            {message.type === "warning" ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            )}
            {message.text}
          </div>
        )}
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-surface mx-auto flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-text-muted font-medium">No rent records for this month</p>
              <p className="text-sm text-text-muted mt-1">Click &quot;Generate Rent&quot; to create records from occupancy data</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-surface-dark">
                    <TableHead className="text-text-muted font-medium">Tenant</TableHead>
                    <TableHead className="text-text-muted font-medium">Property</TableHead>
                    <TableHead className="text-text-muted font-medium">Room / Bed</TableHead>
                    <TableHead className="text-text-muted font-medium">Amount</TableHead>
                    <TableHead className="text-text-muted font-medium">Due Date</TableHead>
                    <TableHead className="text-text-muted font-medium">Status</TableHead>
                    <TableHead className="text-text-muted font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((r) => (
                    <TableRow key={r.id} className="border-surface-dark hover:bg-surface/50">
                      <TableCell className="font-medium text-text-primary">{r.tenantName}</TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {listingMap[r.listingId]?.title ?? "—"}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        Room {r.roomNumber} / Bed {r.bedNumber}
                      </TableCell>
                      <TableCell className="font-semibold text-text-primary">
                        ₹{r.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-text-secondary">{formatDate(r.dueDate)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${statusColors(r.status)}`}
                        >
                          {statusIcon(r.status)}
                          {r.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status !== "Paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkPaid(r.id)}
                              className="rounded-lg text-xs h-8 border-safety-high/30 text-safety-high hover:bg-safety-high/10"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                          {r.status === "Paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePrintReceipt(r)}
                              className="rounded-lg text-xs h-8 border-primary/30 text-primary-dark hover:bg-primary/10"
                            >
                              <FileDown className="h-3.5 w-3.5 mr-1" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
