import jsPDF from "jspdf";

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

// Helper to convert fetched image blob to base64 data URL
const blobToDataURL = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const generateBillPDF = async (billData, backgroundUrl = "/stationery.jpg") => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 7;
  const green = [30, 70, 32];
  const darkGreen = [20, 55, 22];
  const lightGreen = [235, 245, 236];

  // 1. Draw stationery background image first (if available) so text is drawn on top
  if (backgroundUrl) {
    try {
      const resp = await fetch(backgroundUrl);
      if (resp.ok) {
        const blob = await resp.blob();
        const dataUrl = await blobToDataURL(blob);
        doc.addImage(dataUrl, "JPEG", 0, 0, pageWidth, pageHeight);
      }
    } catch (e) {
      // Ignore background image fetch errors
    }
  }

  // 2. Draw outer border
  doc.setLineWidth(0.4);
  doc.setDrawColor(...green);
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

  let y = 11;

  // Header Details
  doc.setFont("times", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGreen);
  
  doc.text("GSTIN : 37AXLPP2664M1ZO", margin + 2, y);
  doc.text("CASH/CREDIT BILL", pageWidth / 2, y, { align: "center" });
  doc.text("Cell : 9490579417, 7989255179", pageWidth - margin - 35, y);

  y += 4.5;
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.text("LG      Whirlpool", margin + 3, y);
  
  doc.setFontSize(18);
  doc.text("STAR SPS Electronics", pageWidth / 2, y + 1, { align: "center" });
  
  doc.setFontSize(8);
  doc.text("SAMSUNG      SONY", pageWidth - margin - 31, y);

  y += 5.5;
  doc.setFont("times", "normal");
  doc.setFontSize(6.8);
  doc.text(
    "Room No. 15, 17 & 18, Opp. Society Co-op Rural Bank Complex, T.B. Road, KALIKIRI-517 234, Annamayya Dt. (A.P.)",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 3.5;
  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.text("Seller for All Electronics", pageWidth / 2, y, { align: "center" });

  y += 3.2;
  doc.setFont("times", "normal");
  doc.setFontSize(6.5);
  doc.text("(Rural Bank Complex, near Junction)", pageWidth / 2, y, { align: "center" });

  // Large red invoice number on the right
  const invoiceNo = String(billData.invoiceNo || billData.id || "286").replace(/^INV-/, "");
  doc.setTextColor(180, 0, 0);
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text(invoiceNo, pageWidth - margin - 4, 25, { align: "right" });
  doc.setTextColor(0, 0, 0);

  y = 35;
  const leftX = margin + 2;
  const rightX = 115;
  const fieldWidth = 65;
  const rightFieldWidth = 35;
  
  doc.setFontSize(7.5);
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  
  // Row 1: Purchaser | Invoice No
  doc.text("Purchaser :", leftX, y);
  doc.line(leftX + 16, y + 0.8, leftX + 16 + fieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.customer) doc.text(String(billData.customer), leftX + 18, y);
  
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Invoice No :", rightX, y);
  doc.line(rightX + 18, y + 0.8, rightX + 18 + rightFieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.invoiceNo) doc.text(String(billData.invoiceNo), rightX + 20, y);
  
  y += 5;
  // Row 2: Address | Date
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Address :", leftX, y);
  doc.line(leftX + 16, y + 0.8, leftX + 16 + fieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.address) doc.text(String(billData.address).substring(0, 42), leftX + 18, y);
  
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Date :", rightX, y);
  doc.line(rightX + 18, y + 0.8, rightX + 18 + rightFieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.date) doc.text(String(billData.date), rightX + 20, y);
  
  y += 5;
  // Row 3: GSTIN + State Code | Transporter
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("GSTIN :", leftX, y);
  doc.line(leftX + 13, y + 0.8, leftX + 13 + 32, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.gstin) doc.text(String(billData.gstin), leftX + 15, y);
  
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("State Code :", leftX + 48, y);
  doc.line(leftX + 65, y + 0.8, leftX + 65 + 16, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.stateCode) doc.text(String(billData.stateCode), leftX + 66, y);
  
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Transporter :", rightX, y);
  doc.line(rightX + 18, y + 0.8, rightX + 18 + rightFieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.transporter) doc.text(String(billData.transporter), rightX + 20, y);
  
  y += 5;
  // Row 4: Phone | Vehical No
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Phone :", leftX, y);
  doc.line(leftX + 13, y + 0.8, leftX + 13 + fieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.phone) doc.text(String(billData.phone), leftX + 15, y);
  
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Vehical No :", rightX, y);
  doc.line(rightX + 18, y + 0.8, rightX + 18 + rightFieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.vehicleNo) doc.text(String(billData.vehicleNo), rightX + 20, y);
  
  y += 5;
  // Row 5: Mobile (Right column only)
  doc.setFont("times", "bold");
  doc.setTextColor(...darkGreen);
  doc.text("Mobile :", rightX, y);
  doc.line(rightX + 18, y + 0.8, rightX + 18 + rightFieldWidth, y + 0.8);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  if (billData.mobile) doc.text(String(billData.mobile), rightX + 20, y);
  
  y += 6.5;
  const tableX = margin;
  const tableTop = y;
  const headerHeight = 8;
  const tableWidths = [10, 52, 20, 12, 16, 22, 28];
  const headers = ["S.No.", "Item Description", "HSN Code", "Qty.", "Units", "Rate ₹", "Gross Amount ₹"];

  doc.setFillColor(...lightGreen);
  doc.rect(tableX, tableTop, pageWidth - tableX * 2, headerHeight, "F");
  
  doc.setFont("times", "bold");
  doc.setFontSize(7.2);
  doc.setDrawColor(...green);
  doc.setTextColor(...darkGreen);

  let x = tableX;
  headers.forEach((header, index) => {
    doc.rect(x, tableTop, tableWidths[index], headerHeight);
    doc.text(header, x + 1.5, tableTop + 4.8);
    x += tableWidths[index];
  });

  const items = Array.isArray(billData.items) ? billData.items : [];
  const visibleRows = Math.max(items.length, 6);
  const rowHeight = 8; // Adjust row height to look tight like the paper bill
  const bodyTop = tableTop + headerHeight;
  const bodyBottom = bodyTop + visibleRows * rowHeight;

  // Draw row grid lines
  for (let index = 0; index <= visibleRows; index += 1) {
    const rowY = bodyTop + index * rowHeight;
    doc.line(tableX, rowY, pageWidth - tableX, rowY);
  }

  // Draw column grid lines
  x = tableX;
  tableWidths.forEach((width) => {
    doc.line(x, tableTop, x, bodyBottom);
    x += width;
  });
  doc.line(pageWidth - tableX, tableTop, pageWidth - tableX, bodyBottom);

  doc.setTextColor(0, 0, 0);
  doc.setFont("times", "normal");
  doc.setFontSize(7.2);

  let calculatedSubtotal = 0;
  for (let rowIndex = 0; rowIndex < visibleRows; rowIndex += 1) {
    const item = items[rowIndex];
    if (!item) continue;

    const rowY = bodyTop + rowIndex * rowHeight;
    const quantity = Number(item.qty || item.quantity || 1);
    const rate = Number(item.price || 0);
    const grossAmount = rate * quantity;
    calculatedSubtotal += grossAmount;

    const cells = [
      String(rowIndex + 1),
      String(item.name || "").slice(0, 36),
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
        doc.text(value, cellX + 1.5, rowY + 4.8);
      } else if (cellIndex >= 5) {
        doc.text(value, cellX + width - 1.5, rowY + 4.8, { align: "right" });
      } else {
        doc.text(value, cellX + width / 2, rowY + 4.8, { align: "center" });
      }
      cellX += width;
    }
  }

  // Net Amount Row
  const netY = bodyBottom + 5;
  doc.setFont("times", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGreen);
  doc.text("Net Amount ₹", pageWidth - tableWidths[6] - tableWidths[5] - 2, netY);
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(calculatedSubtotal), pageWidth - margin - 2, netY, { align: "right" });

  // Calculations for Summary
  const spotDiscount = Number(billData.spotDiscount || 0);
  const splSeaDiscount = Number(billData.splSeaDiscount || 0);
  const otherDiscount = Number(billData.otherDiscount || 0);
  
  const spotDiscAmount = (calculatedSubtotal * spotDiscount) / 100;
  
  const taxable = billData.taxableAmount !== undefined && billData.taxableAmount !== "" && billData.taxableAmount !== null && Number(billData.taxableAmount) !== 0
    ? Number(billData.taxableAmount)
    : (calculatedSubtotal - spotDiscAmount - splSeaDiscount - otherDiscount);
    
  const cgstPercent = Number(billData.cgst || 9);
  const sgstPercent = Number(billData.sgst || 9);
  const igstPercent = Number(billData.igst || 0);
  const roundOff = Number(billData.roundOff || 0);
  
  const cgstAmount = taxable * (cgstPercent / 100);
  const sgstAmount = taxable * (sgstPercent / 100);
  const igstAmount = taxable * (igstPercent / 100);
  
  const grandTotal = billData.grandTotal !== undefined && billData.grandTotal !== "" && billData.grandTotal !== null && Number(billData.grandTotal) !== 0
    ? Number(billData.grandTotal)
    : (taxable + cgstAmount + sgstAmount + igstAmount + roundOff);

  // Right side summary section
  const summaryX = 130;
  let summaryY = bodyBottom + 11;
  doc.setFont("times", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...darkGreen);
  
  doc.text("Spot Disc %", summaryX, summaryY);
  doc.text("Spl/Sea Disc", summaryX, summaryY + 4);
  doc.text("Other Disc", summaryX, summaryY + 8);
  doc.text("Taxable Amount", summaryX, summaryY + 12);
  doc.text(`CGST (${cgstPercent}%)`, summaryX, summaryY + 16);
  doc.text(`SGST (${sgstPercent}%)`, summaryX, summaryY + 20);
  doc.text(`IGST (${igstPercent}%)`, summaryX, summaryY + 24);
  doc.text("Round off", summaryX, summaryY + 28);

  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(`${spotDiscount}%`, pageWidth - margin - 2, summaryY, { align: "right" });
  doc.text(formatCurrency(splSeaDiscount), pageWidth - margin - 2, summaryY + 4, { align: "right" });
  doc.text(formatCurrency(otherDiscount), pageWidth - margin - 2, summaryY + 8, { align: "right" });
  doc.text(formatCurrency(taxable), pageWidth - margin - 2, summaryY + 12, { align: "right" });
  doc.text(formatCurrency(cgstAmount), pageWidth - margin - 2, summaryY + 16, { align: "right" });
  doc.text(formatCurrency(sgstAmount), pageWidth - margin - 2, summaryY + 20, { align: "right" });
  doc.text(formatCurrency(igstAmount), pageWidth - margin - 2, summaryY + 24, { align: "right" });
  doc.text(formatCurrency(roundOff), pageWidth - margin - 2, summaryY + 28, { align: "right" });

  doc.setFont("times", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...darkGreen);
  doc.text("Grand Total in ₹", summaryX, summaryY + 34);
  
  doc.setTextColor(180, 0, 0); // Red grand total
  doc.setFontSize(8.5);
  doc.text(formatCurrency(Math.round(grandTotal)), pageWidth - margin - 2, summaryY + 34, { align: "right" });
  doc.setTextColor(0, 0, 0);

  // Draw summary boundary box
  doc.setDrawColor(...green);
  doc.setLineWidth(0.2);
  doc.rect(summaryX - 2, summaryY - 2.5, pageWidth - margin - summaryX + 1, 41);

  // Terms and Conditions
  const termsY = bodyBottom + 12;
  doc.setFont("times", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGreen);
  doc.text("TERMS & CONDITIONS :", margin + 2, termsY);
  
  doc.setFont("times", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(0, 0, 0);
  
  // Note: PDF uses English text fallbacks for Telugu characters to prevent encoding square-character boxes
  doc.text("1. Goods once sold will not be taken back or exchanged.", margin + 2, termsY + 4);
  doc.text("2. For Refrigerators, LED TVs and all other products warranty as for companies ploly.", margin + 2, termsY + 7.5);
  doc.text("3. Any Problems occurred in product above 7 days of purchase should not be replaced only service", margin + 2, termsY + 11);
  doc.text("   repair will happen.", margin + 2, termsY + 14);
  doc.text("4. Any disputes & Regarding this invoice Shall be subject to Vayalapadu, Piler Jurisdiction only.", margin + 2, termsY + 17.5);

  // Signatures
  const sigY = pageHeight - 18;
  doc.setFont("times", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...darkGreen);
  doc.text("For Star SPS Electronics", pageWidth / 2 - 20, sigY - 8);
  
  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);
  doc.line(margin + 2, sigY, margin + 42, sigY);
  doc.text("Signature of Receiver", margin + 4, sigY + 3.5);
  
  doc.line(pageWidth / 2 - 20, sigY, pageWidth / 2 + 20, sigY);
  doc.text("Authorised Signatory", pageWidth / 2 - 15, sigY + 3.5);
  
  doc.line(pageWidth - margin - 35, sigY, pageWidth - margin - 2, sigY);
  doc.text("Seal", pageWidth - margin - 20, sigY + 3.5);

  doc.save(`Bill_${invoiceNo.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
};
