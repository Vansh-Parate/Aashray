import type { RentRecord, Listing } from "@/types";

/**
 * Generates a styled PDF receipt for a paid rent record and triggers
 * browser download. Uses a hidden iframe with print-optimized HTML.
 */
export function downloadReceipt(record: RentRecord, listing?: Listing) {
    const listingTitle = listing?.title ?? "Property";
    const listingAddress = listing
        ? `${listing.location.address}, ${listing.location.city}`
        : "";
    const paidDate = record.paidDate
        ? new Date(record.paidDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "N/A";
    const monthLabel = new Date(record.month + "-01").toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Rent Receipt – ${record.tenantName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #fff; color: #3E3530; padding: 40px; }
    .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #E8E3DC; border-radius: 16px; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #D4A574; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 700; color: #B8865A; }
    .logo-sub { font-size: 12px; color: #9B918A; margin-top: 4px; }
    .badge { background: #7A9B76; color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .receipt-id { font-size: 11px; color: #9B918A; margin-top: 8px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9B918A; margin-bottom: 8px; font-weight: 600; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F7F4F0; }
    .row:last-child { border-bottom: none; }
    .label { color: #6B615B; font-size: 14px; }
    .value { font-weight: 600; font-size: 14px; }
    .amount-row { background: #FBF8F4; border-radius: 12px; padding: 16px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center; }
    .amount-label { font-size: 16px; font-weight: 600; }
    .amount-value { font-size: 24px; font-weight: 700; color: #B8865A; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E8E3DC; text-align: center; font-size: 11px; color: #9B918A; }
    .stamp { display: inline-block; border: 2px solid #7A9B76; color: #7A9B76; padding: 8px 24px; border-radius: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; transform: rotate(-5deg); margin-bottom: 16px; font-size: 14px; }
    @media print {
      body { padding: 20px; }
      .receipt { border: 1px solid #ccc; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div>
        <div class="logo">AASHRAY</div>
        <div class="logo-sub">Student Housing Platform</div>
        <div class="receipt-id">Receipt #${record.id.slice(-8).toUpperCase()}</div>
      </div>
      <div style="text-align: right;">
        <div class="badge">✓ PAID</div>
        <div class="receipt-id" style="margin-top: 8px;">${paidDate}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Tenant Details</div>
      <div class="row"><span class="label">Name</span><span class="value">${record.tenantName}</span></div>
      <div class="row"><span class="label">Room / Bed</span><span class="value">Room ${record.roomNumber} / Bed ${record.bedNumber}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Property Details</div>
      <div class="row"><span class="label">Property</span><span class="value">${listingTitle}</span></div>
      ${listingAddress ? `<div class="row"><span class="label">Address</span><span class="value">${listingAddress}</span></div>` : ""}
    </div>

    <div class="section">
      <div class="section-title">Payment Details</div>
      <div class="row"><span class="label">Period</span><span class="value">${monthLabel}</span></div>
      <div class="row"><span class="label">Due Date</span><span class="value">${new Date(record.dueDate).toLocaleDateString("en-IN")}</span></div>
      <div class="row"><span class="label">Paid On</span><span class="value">${paidDate}</span></div>
    </div>

    <div class="amount-row">
      <span class="amount-label">Amount Paid</span>
      <span class="amount-value">₹${record.amount.toLocaleString()}</span>
    </div>

    <div class="footer">
      <div class="stamp">PAID</div>
      <p>This is a computer-generated receipt and does not require a signature.</p>
      <p style="margin-top: 4px;">AASHRAY – Safe Student Housing</p>
    </div>
  </div>
</body>
</html>`;

    // Open a new window and trigger print (which allows Save as PDF)
    const printWindow = window.open("", "_blank", "width=700,height=900");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.print();
    };
}
