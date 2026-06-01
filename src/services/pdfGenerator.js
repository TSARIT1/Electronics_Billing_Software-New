import jsPDF from "jspdf";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const generateBillPDF = async (billData, backgroundUrl = "/stationery.jpg") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 7;
  const green = [56, 111, 56];
  const darkGreen = [28, 84, 36];
  const lightGreen = [214, 230, 214];

  doc.setLineWidth(0.35);
  doc.setDrawColor(...green);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  let y = 11;

  doc.setFont("times", "bold");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  
  doc.text(`GSTIN : ${billData.gstin || ""}`, margin + 1, y);
  doc.text("CASH/CREDIT BILL", pageWidth / 2, y, { align: "center" });
  doc.setFont("times", "normal");
  doc.text(`Cell : ${billData.mobile || billData.phone || ""}`, pageWidth - margin - 28, y);

  y += 4.5;
  doc.setFont("times", "bold");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  
  doc.text("LG      Whirlpool", margin + 2, y);
  doc.text("STAR SPS Electronics", pageWidth / 2 - 20, y);
  doc.text("SAMSUNG      SONY", pageWidth - margin - 30, y);

  y += 3.5;
  doc.setFont("times", "normal");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  
  doc.text(
    "Room No 16, 17 & 18, Opp Society Co-op Rural Bank Complex, TB Road, KALIKIRI-517 234, Annamayya Dt. (A.P)",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 3.5;
  doc.setFont("times", "bold");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.2);
  
  doc.text("Seller for All Electronics", pageWidth / 2, y, { align: "center" });
  y += 3;
  doc.setFont("times", "normal");
  doc.setFontSize(6.2);
  doc.text("(cash/ card/ cheque/ neft/ rtgs)", pageWidth / 2, y, { align: "center" });

  const invoiceNo = String(billData.invoiceNo || billData.id || "145").replace(/^INV-/, "");
  
  // Large red invoice number on the right
  doc.setTextColor(180, 0, 0);
  doc.setFont("times", "bold");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  
  doc.text(invoiceNo, pageWidth - margin - 4, 39, { align: "right" });
  doc.setTextColor(0, 0, 0);

  y = 47;
  const leftX = margin + 1;
  const rightX = 115;
  const fieldWidth = 65;
  const rightFieldWidth = 35;
  
  // LEFT COLUMN: Purchaser, Address, GSTIN, Phone
  // RIGHT COLUMN: Invoice No, Date, Transporter, Vehical No
  
  doc.setFontSize(7.5);
  doc.setFont("times", "normal");
  
  // Row 1: Purchaser | Invoice No
  doc.text("Purchaser :", leftX, y);
  doc.line(leftX + 25, y + 0.8, leftX + 25 + fieldWidth, y + 0.8);
  if (billData.customer) doc.text(String(billData.customer), leftX + 27, y);
  
  doc.text("Invoice No :", rightX, y);
  doc.line(rightX + 23, y + 0.8, rightX + 23 + rightFieldWidth, y + 0.8);
  
  y += 5;
  // Row 2: Address | Date
  doc.text("Address :", leftX, y);
  doc.line(leftX + 25, y + 0.8, leftX + 25 + fieldWidth, y + 0.8);
  if (billData.address) doc.text(String(billData.address).substring(0, 40), leftX + 27, y);
  
  doc.text("Date :", rightX, y);
  doc.line(rightX + 23, y + 0.8, rightX + 23 + rightFieldWidth, y + 0.8);
  if (billData.date) doc.text(String(billData.date), rightX + 25, y);
  
  y += 5;
  // Row 3: GSTIN | Transporter
  doc.text("GSTIN :", leftX, y);
  doc.line(leftX + 25, y + 0.8, leftX + 25 + fieldWidth, y + 0.8);
  if (billData.gstin) doc.text(String(billData.gstin), leftX + 27, y);
  
  doc.text("Transporter :", rightX, y);
  doc.line(rightX + 23, y + 0.8, rightX + 23 + rightFieldWidth, y + 0.8);
  if (billData.transporter) doc.text(String(billData.transporter), rightX + 25, y);
  
  y += 5;
  // Row 4: Phone | Vehical No
  doc.text("Phone :", leftX, y);
  doc.line(leftX + 25, y + 0.8, leftX + 25 + fieldWidth, y + 0.8);
  if (billData.phone) doc.text(String(billData.phone), leftX + 27, y);
  
  doc.text("Vehical No :", rightX, y);
  doc.line(rightX + 23, y + 0.8, rightX + 23 + rightFieldWidth, y + 0.8);
  if (billData.vehicleNo) doc.text(String(billData.vehicleNo), rightX + 25, y);
  
  y += 5;
  // Row 5: State Code | Mobile
  doc.text("State Code :", leftX, y);
  doc.line(leftX + 25, y + 0.8, leftX + 25 + 30, y + 0.8);
  if (billData.stateCode) doc.text(String(billData.stateCode), leftX + 27, y);
  
  doc.text("Mobile :", rightX, y);
  doc.line(rightX + 23, y + 0.8, rightX + 23 + rightFieldWidth, y + 0.8);
  if (billData.mobile) doc.text(String(billData.mobile), rightX + 25, y);

  
  y += 6.5;
  const tableX = margin;
  const tableTop = y;
  const headerHeight = 8;
  const tableWidths = [9, 42, 16, 10, 13, 18, 32];
  const headers = ["S.No.", "Item Description", "HSN Code", "Qty.", "Units", "Rate ₹", "Gross Amount ₹"];

  doc.setFillColor(...lightGreen);
  doc.rect(tableX, tableTop, pageWidth - tableX * 2, headerHeight, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(7.2);
  doc.setTextColor(...darkGreen);

  let x = tableX;
  headers.forEach((header, index) => {
    doc.rect(x, tableTop, tableWidths[index], headerHeight);
    doc.text(header, x + 0.8, tableTop + 4.4);
    x += tableWidths[index];
  });

  const items = Array.isArray(billData.items) ? billData.items : [];
  const visibleRows = Math.max(items.length, 6);
  const rowHeight = 20;
  const bodyTop = tableTop + headerHeight;
  const bodyBottom = bodyTop + visibleRows * rowHeight;

  doc.setDrawColor(...green);
  for (let index = 0; index <= visibleRows; index += 1) {
    const rowY = bodyTop + index * rowHeight;
    doc.line(tableX, rowY, pageWidth - tableX, rowY);
  }

  x = tableX;
  tableWidths.forEach((width) => {
    doc.line(x, tableTop, x, bodyBottom);
    x += width;
  });
  doc.line(pageWidth - tableX, tableTop, pageWidth - tableX, bodyBottom);

  doc.setTextColor(0, 0, 0);
  doc.setFont("times", "normal");
  doc.setFontSize(7);

  let taxableAmount = Number(billData.taxableAmount || billData.netAmount || 0);
  for (let rowIndex = 0; rowIndex < visibleRows; rowIndex += 1) {
    const item = items[rowIndex];
    if (!item) {
      continue;
    }

    const rowY = bodyTop + rowIndex * rowHeight;
    const quantity = Number(item.qty || 1);
    const rate = Number(item.price || 0);
    const grossAmount = Number(item.grossAmount || rate * quantity);
    if (!taxableAmount) {
      taxableAmount = grossAmount;
    }

    const cells = [
      String(rowIndex + 1),
      String(item.name || item.description || "").slice(0, 28),
      String(item.hsnCode || "8517"),
      String(quantity),
      String(item.units || "Pcs"),
      formatCurrency(rate),
      formatCurrency(grossAmount),
    ];

    let cellX = tableX;
    for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
      const value = cells[cellIndex];
      const width = tableWidths[cellIndex];
      if (cellIndex === 1) {
        doc.text(value, cellX + 0.8, rowY + 4.2);
      } else if (cellIndex >= 5) {
        doc.text(value, cellX + width - 0.8, rowY + 4.2, { align: "right" });
      } else {
        doc.text(value, cellX + width / 2, rowY + 4.2, { align: "center" });
      }
      cellX += width;
    }
  }

  const netY = bodyBottom + 4;
  doc.setFont("times", "bold");
  doc.setFontSize(7);
  doc.text("Net Amount ₹", tableX + 2, netY);

  const taxable = Number(taxableAmount || billData.taxableAmount || 0);
  const cgstPercent = Number(billData.cgst || 9);
  const sgstPercent = Number(billData.sgst || 9);
  const igstPercent = Number(billData.igst || 0);
  const roundOff = Number(billData.roundOff || 0);
  const cgstAmount = taxable * (cgstPercent / 100);
  const sgstAmount = taxable * (sgstPercent / 100);
  const igstAmount = taxable * (igstPercent / 100);
  const grandTotal = Number(billData.grandTotal || taxable + cgstAmount + sgstAmount + igstAmount + roundOff);

  doc.text(formatCurrency(taxable), pageWidth - tableX - 2, netY, { align: "right" });

  // Right side summary section - positioned below the table
  const summaryX = 130;
  let summaryY = bodyBottom + 8;
  doc.setFont("times", "normal");
  doc.setFontSize(6.6);
  
  doc.text("Spot Disc %", summaryX, summaryY);
  doc.text("Spl Sea Disc", summaryX, summaryY + 4);
  doc.text("Other Disc", summaryX, summaryY + 8);
  doc.text("Taxable Amount", summaryX, summaryY + 12);
  doc.text("CGST%", summaryX, summaryY + 16);
  doc.text("SGST%", summaryX, summaryY + 20);
  doc.text("IGST%", summaryX, summaryY + 24);
  doc.text("Round off", summaryX, summaryY + 28);

  doc.text(String(billData.spotDiscount || ""), summaryX + 35, summaryY);
  doc.text(String(billData.splSeaDiscount || ""), summaryX + 35, summaryY + 4);
  doc.text(String(billData.otherDiscount || ""), summaryX + 35, summaryY + 8);
  doc.text(formatCurrency(taxable), summaryX + 35, summaryY + 12);
  doc.text(String(cgstPercent), summaryX + 35, summaryY + 16);
  doc.text(String(sgstPercent), summaryX + 35, summaryY + 20);
  doc.text(String(igstPercent), summaryX + 35, summaryY + 24);
  doc.text(Number(roundOff || 0).toFixed(2), summaryX + 35, summaryY + 28);

  doc.setFont("times", "bold");
  doc.setFontSize(7.2);
  doc.text("Grand Total in ₹", summaryX, summaryY + 34);
  doc.setTextColor(180, 0, 0);
  doc.text(formatCurrency(grandTotal), summaryX + 65, summaryY + 34, { align: "right" });
  doc.setTextColor(0, 0, 0);

  const termsY = bodyBottom + 48;
  doc.setDrawColor(...green);
  doc.line(margin, termsY - 1.5, pageWidth - margin, termsY - 1.5);

  doc.setFont("times", "bold");
  doc.setFontSize(7.5);
  doc.text("TERMS & CONDITIONS :", margin + 1, termsY + 1);
  doc.setFont("times", "normal");
  doc.setFontSize(5.8);
  doc.text("1. Goods once sold will not be taken back or exchanged.", margin + 1, termsY + 4.5);
  doc.text("2. For Refrigerators, LED TVs and all other products warranty as for companies policy.", margin + 1, termsY + 7.5);
  doc.text("3. Any problems occurred in product above 7 days of purchase should not be replaced only service", margin + 1, termsY + 10.5);
  doc.text("   repair will happen.", margin + 1, termsY + 13.5);
  doc.text("4. Any disputes & regarding this invoice shall be subject to Valayapadu, Piler jurisdiction only.", margin + 1, termsY + 16.5);

  doc.setFont("times", "bold");
  doc.setFontSize(7.2);
  doc.text("For Star SPS Electronics", pageWidth / 2, pageHeight - 18, { align: "center" });
  doc.setFont("times", "normal");
  doc.text("Signature of Receiver", margin + 1, pageHeight - 10);
  doc.text("Authorised Signatory", pageWidth / 2 - 14, pageHeight - 10);
  doc.text("Seal", pageWidth - margin - 12, pageHeight - 10);

  // Helper to convert fetched image blob to base64 data URL
  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // If a background image URL was provided, try to fetch and add it as the page background
  if (backgroundUrl) {
    try {
      const resp = await fetch(backgroundUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        const dataUrl = await blobToDataURL(blob);
        // draw the background image full page
        doc.addImage(dataUrl, "JPEG", 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
      }
    } catch (e) {
      // If fetching background fails, continue without it
      // console.warn('Could not load stationery background', e);
    }
  }

  doc.save(`Bill_${invoiceNo.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
};
