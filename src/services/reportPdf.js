import jsPDF from "jspdf";

const svgToPngDataUrl = async (svgElement) => {
  if (!svgElement) return null;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const svgBase64 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = svgBase64;
  });
};

export const generateReportPDF = async ({ summary, monthly, revenueChartSelector, paymentsChartSelector }) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;

  doc.setFontSize(16);
  doc.setFont(undefined, "bold");
  doc.text("ElectroShop - Business Report", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Total Revenue: ₹${Number(summary.totalRevenue || 0).toLocaleString("en-IN")}`, 14, y);
  doc.text(`Total Purchases: ₹${Number(summary.totalPurchases || 0).toLocaleString("en-IN")}`, 80, y);
  doc.text(`Profit: ₹${Number(summary.profit || 0).toLocaleString("en-IN")}`, 150, y);
  doc.text(`Avg Order: ₹${Number(summary.avgOrderValue || 0).toLocaleString("en-IN")}`, 210, y);
  y += 8;

  // Try to capture revenue chart
  const revenueSvg = document.querySelector(revenueChartSelector + " svg");
  const paymentsSvg = document.querySelector(paymentsChartSelector + " svg");

  const revenueImg = await svgToPngDataUrl(revenueSvg);
  const paymentsImg = await svgToPngDataUrl(paymentsSvg);

  const imgWidthMm = pageWidth / 2 - 20;
  const startXLeft = 10;
  const startXRight = pageWidth / 2 + 0;

  if (revenueImg) {
    doc.addImage(revenueImg, "PNG", startXLeft, y, imgWidthMm, 60);
  }
  if (paymentsImg) {
    doc.addImage(paymentsImg, "PNG", startXRight, y, imgWidthMm, 60);
  }
  y += 65;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Monthly Series", 14, y);
  y += 6;

  // table header
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  const tableX = 14;
  const colW = 40;
  doc.text("Month", tableX, y);
  doc.text("Revenue (₹)", tableX + colW, y);
  doc.text("Purchases (₹)", tableX + colW * 2, y);
  y += 6;

  monthly.labels.forEach((label, idx) => {
    const r = monthly.revenue[idx] || 0;
    const p = monthly.purchases[idx] || 0;
    doc.text(label, tableX, y);
    doc.text(Number(r).toLocaleString("en-IN"), tableX + colW, y);
    doc.text(Number(p).toLocaleString("en-IN"), tableX + colW * 2, y);
    y += 6;
    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 14;
    }
  });

  doc.save(`ElectroShop_Report_${new Date().toISOString().slice(0,10)}.pdf`);
};
