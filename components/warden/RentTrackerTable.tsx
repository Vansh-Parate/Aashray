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
  Bell,
  Send,
  Users,
  X,
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

interface OccupiedTenantInfo {
  tenantName: string;
  tenantId: string;
  roomNumber: string;
  bedNumber: string;
  listingTitle: string;
  listingId: string;
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
  const [message, setMessage] = useState<{ text: string; type: "success" | "warning" | "info" } | null>(null);
  const [occupiedTenants, setOccupiedTenants] = useState<OccupiedTenantInfo[]>([]);
  const [showOccupiedPanel, setShowOccupiedPanel] = useState(false);
  const [notifSending, setNotifSending] = useState<string | null>(null);

  const totalExpected = records.reduce((s, r) => s + r.amount, 0);
  const paidRecords = records.filter((r) => r.status === "Paid");
  const pendingRecords = records.filter((r) => r.status === "Pending");
  const overdueRecords = records.filter((r) => r.status === "Overdue");
  const totalCollected = paidRecords.reduce((s, r) => s + r.amount, 0);
  const totalPending = totalExpected - totalCollected;
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  // Gather all currently occupied tenants across listings
  const gatherOccupiedTenants = (): OccupiedTenantInfo[] => {
    const tenants: OccupiedTenantInfo[] = [];
    for (const listing of listings) {
      let occupancy = getOccupancyByListingId(listing.id);
      if (!occupancy) {
        occupancy = getOrCreateOccupancyForListing(listing.id, listing.occupancy.total);
      }
      for (const room of occupancy.rooms) {
        for (const bed of room.beds) {
          if (bed.status === "Occupied" && bed.tenantName) {
            tenants.push({
              tenantName: bed.tenantName,
              tenantId: bed.tenantId || "",
              roomNumber: room.roomNumber,
              bedNumber: bed.bedNumber,
              listingTitle: listing.title,
              listingId: listing.id,
            });
          }
        }
      }
    }
    return tenants;
  };

  const generateRentForAll = () => {
    if (listings.length === 0) {
      setMessage({ text: "No listings found. Add a listing first.", type: "warning" });
      setTimeout(() => setMessage(null), 4000);
      return;
    }

    // Gather occupied tenants and show them
    const tenants = gatherOccupiedTenants();
    setOccupiedTenants(tenants);

    let totalGenerated = 0;

    for (const listing of listings) {
      let occupancy = getOccupancyByListingId(listing.id);
      if (!occupancy) {
        occupancy = getOrCreateOccupancyForListing(listing.id, listing.occupancy.total);
      }
      const occupied = occupancy.rooms.flatMap((r) => r.beds).filter((b) => b.status === "Occupied" && b.tenantName);
      if (occupied.length > 0) {
        const generated = generateMonthlyRent(listing.id, selectedMonth, listing.pricing.rent, occupancy);
        totalGenerated += generated.length;
      }
    }

    if (tenants.length === 0) {
      setMessage({ text: "No occupied beds found. Add tenants in Occupancy first.", type: "warning" });
      setShowOccupiedPanel(false);
    } else if (totalGenerated === 0) {
      setMessage({ text: "Rent already generated for all occupied beds this month.", type: "warning" });
      setShowOccupiedPanel(true);
    } else {
      setMessage({ text: `Generated rent for ${totalGenerated} tenant(s).`, type: "success" });
      setShowOccupiedPanel(true);
    }
    setTimeout(() => setMessage(null), 5000);
    onRefresh();
  };

  const handleMarkPaid = (recordId: string) => {
    markRentAsPaid(recordId);
    onRefresh();
  };

  const handlePrintReceipt = (record: RentRecord) => {
    downloadReceipt(record, listingMap[record.listingId]);
  };

  const handleSendNotification = async (record: RentRecord) => {
    setNotifSending(record.id);
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: record.tenantId,
          type: record.status === "Paid" ? "rent_paid" : "rent_reminder",
          title: record.status === "Paid" ? "Rent Payment Confirmed" : "Rent Payment Reminder",
          message:
            record.status === "Paid"
              ? `Your rent of ₹${record.amount.toLocaleString()} for ${new Date(record.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })} has been confirmed.`
              : `Your rent of ₹${record.amount.toLocaleString()} for ${new Date(record.month + "-01").toLocaleString("default", { month: "long", year: "numeric" })} is due on ${formatDate(record.dueDate)}. Please pay on time.`,
        }),
      });
      setMessage({ text: `Notification sent to ${record.tenantName}`, type: "success" });
    } catch {
      setMessage({ text: `Failed to send notification to ${record.tenantName}`, type: "warning" });
    }
    setNotifSending(null);
    setTimeout(() => setMessage(null), 3000);
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

      {/* Occupied Tenants Panel — appears after Generate Rent */}
      {showOccupiedPanel && occupiedTenants.length > 0 && (
        <Card className="rounded-2xl border-primary/20 shadow-soft bg-primary/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-dark" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-text-primary">
                  Occupied Beds ({occupiedTenants.length})
                </h3>
                <p className="text-xs text-text-muted">Tenants currently registered in your properties</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOccupiedPanel(false)}
              className="h-8 w-8 p-0 rounded-lg"
            >
              <X className="h-4 w-4 text-text-muted" />
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {occupiedTenants.map((t, i) => (
                <div
                  key={`${t.listingId}-${t.roomNumber}-${t.bedNumber}-${i}`}
                  className="flex items-center gap-3 rounded-xl bg-white border border-surface-dark/50 px-3 py-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-dark">
                      {t.tenantName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{t.tenantName}</p>
                    <p className="text-[11px] text-text-muted truncate">
                      {t.listingTitle} · Room {t.roomNumber}, Bed {t.bedNumber}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-safety-high/10 text-safety-high">
                      <span className="w-1.5 h-1.5 rounded-full bg-safety-high" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <SelectTrigger className="w-full sm:w-44 rounded-xl min-w-0">
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
            : message.type === "info"
              ? "bg-primary/10 text-primary-dark"
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
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <Table className="min-w-[640px]">
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
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
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
                          {/* Send Notification button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNotification(r)}
                            disabled={notifSending === r.id}
                            className="rounded-lg text-xs h-8 border-blue-400/30 text-blue-600 hover:bg-blue-50"
                            title={r.status === "Paid" ? "Send payment confirmation" : "Send payment reminder"}
                          >
                            {notifSending === r.id ? (
                              <RefreshCw className="h-3.5 w-3.5 mr-1 animate-spin" />
                            ) : (
                              <Bell className="h-3.5 w-3.5 mr-1" />
                            )}
                            Notify
                          </Button>
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
