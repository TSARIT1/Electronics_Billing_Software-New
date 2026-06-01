export const dashboardStats = [
  { title: "Monthly Sales", value: "₹12,45,320", change: "+12.5%" },
  { title: "Weekly Sales", value: "₹3,48,920", change: "+5.2%" },
  { title: "Today's Sales", value: "₹86,450", change: "+2.1%" },
  { title: "Stock Alerts", value: "24 Items", change: "-3.4%" },
];

export const salesOverview = [
  { name: "Mon", sales: 24000 },
  { name: "Tue", sales: 18900 },
  { name: "Wed", sales: 26000 },
  { name: "Thu", sales: 27800 },
  { name: "Fri", sales: 32000 },
  { name: "Sat", sales: 29000 },
  { name: "Sun", sales: 34000 },
];

export const monthlySalesOverview = [
  { name: "Jan", sales: 184000 },
  { name: "Feb", sales: 196500 },
  { name: "Mar", sales: 212000 },
  { name: "Apr", sales: 224500 },
  { name: "May", sales: 238000 },
  { name: "Jun", sales: 251500 },
  { name: "Jul", sales: 266000 },
  { name: "Aug", sales: 279500 },
  { name: "Sep", sales: 288000 },
  { name: "Oct", sales: 301500 },
  { name: "Nov", sales: 318000 },
  { name: "Dec", sales: 336500 },
];

export const categoryBreakdown = [
  { name: "Mobiles", value: 35 },
  { name: "Laptops", value: 28 },
  { name: "Accessories", value: 18 },
  { name: "Appliances", value: 19 },
];

export const inventoryStats = [
  { title: "Total Products", value: "1,245" },
  { title: "Total Stock Units", value: "38,490" },
  { title: "Inventory Value", value: "₹48.2L" },
  { title: "Low Stock Items", value: "32" },
];

export const inventoryProducts = [
  {
    name: "iPhone 15 Pro",
    sku: "ES-IP15P",
    category: "Mobiles",
    hsn: "8517",
    cost: "₹92,000",
    price: "₹1,21,990",
    stock: 18,
    status: "Low",
  },
  {
    name: "Samsung S24 Ultra",
    sku: "ES-SS24U",
    category: "Mobiles",
    hsn: "8517",
    cost: "₹89,000",
    price: "₹1,19,990",
    stock: 42,
    status: "In Stock",
  },
  {
    name: "Dell XPS 15",
    sku: "ES-DXPS",
    category: "Laptops",
    hsn: "8471",
    cost: "₹1,45,000",
    price: "₹1,79,990",
    stock: 9,
    status: "Low",
  },
  {
    name: "Sony WH-1000XM5",
    sku: "ES-SWHM5",
    category: "Accessories",
    hsn: "8518",
    cost: "₹24,500",
    price: "₹29,990",
    stock: 58,
    status: "In Stock",
  },
  {
    name: "LG OLED 55",
    sku: "ES-LGOLED",
    category: "Appliances",
    hsn: "8528",
    cost: "₹1,18,000",
    price: "₹1,49,990",
    stock: 4,
    status: "Out of Stock",
  },
];

export const purchaseStats = [
  { title: "Total Orders", value: "128" },
  { title: "Delivered Value", value: "₹18.6L" },
  { title: "Pending/Processing", value: "14" },
];

export const purchaseOrders = [
  {
    id: "PO-1845",
    supplier: "Nova Distributors",
    date: "11 May 2026",
    items: 24,
    amount: "₹3,24,500",
    status: "Delivered",
  },
  {
    id: "PO-1844",
    supplier: "BlueWave Electronics",
    date: "09 May 2026",
    items: 18,
    amount: "₹2,10,200",
    status: "Processing",
  },
  {
    id: "PO-1843",
    supplier: "Delta Supplies",
    date: "07 May 2026",
    items: 36,
    amount: "₹4,05,000",
    status: "Pending",
  },
];

export const billHistoryStats = [
  { title: "Total Bills", value: "2,436" },
  { title: "Revenue", value: "₹84.5L" },
  { title: "Returns", value: "18" },
];

export const billHistory = [
  {
    id: "INV-9021",
    customer: "Rohan Sharma",
    date: "11 May 2026",
    items: 4,
    total: "₹42,990",
    payment: "UPI",
    status: "Paid",
  },
  {
    id: "INV-9020",
    customer: "Isha Verma",
    date: "11 May 2026",
    items: 2,
    total: "₹18,400",
    payment: "Card",
    status: "Paid",
  },
  {
    id: "INV-9019",
    customer: "Karan Patel",
    date: "10 May 2026",
    items: 6,
    total: "₹56,120",
    payment: "Cash",
    status: "Pending",
  },
];

export const reportsStats = [
  { title: "Total Revenue", value: "₹1.24Cr" },
  { title: "Purchases", value: "₹46.2L" },
  { title: "Profit", value: "₹32.8L" },
  { title: "Avg Order Value", value: "₹3,480" },
];

export const revenueVsPurchases = [
  { name: "Jan", revenue: 420000, purchases: 240000 },
  { name: "Feb", revenue: 480000, purchases: 310000 },
  { name: "Mar", revenue: 520000, purchases: 300000 },
  { name: "Apr", revenue: 610000, purchases: 350000 },
  { name: "May", revenue: 680000, purchases: 390000 },
  { name: "Jun", revenue: 720000, purchases: 410000 },
];

export const paymentMethods = [
  { name: "UPI", value: 44 },
  { name: "Card", value: 28 },
  { name: "Cash", value: 18 },
  { name: "Wallet", value: 10 },
];

export const billingCart = [
  { name: "iPhone 15 Pro", qty: 1, price: 121990, gst: 18 },
  { name: "AirPods Pro", qty: 2, price: 24990, gst: 18 },
  { name: "Logitech MX Keys", qty: 1, price: 9990, gst: 18 },
];

export const invoiceDetails = {
  invoiceNo: "GST/2026/0456",
  date: "11 May 2026",
  customer: "Arjun Mehta",
  phone: "+91 98765 43210",
  address: "24/A, MG Road, Bengaluru, KA",
  gstin: "29ABCDE1234F1Z6",
  paymentMode: "UPI",
};
