import React, { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Printer, Download, Trash2, Receipt } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

// Minimal SVG Logos in theme color
const LgLogo = () => (
  <div className="flex items-center gap-1 text-amber-500">
    <svg className="h-5 w-5" viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="44" strokeWidth="7" />
      <path d="M50 32 v22 h12" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M68 50 A 18 18 0 1 1 50 32" strokeWidth="7" strokeLinecap="round" />
      <circle cx="40" cy="45" r="4.5" fill="currentColor" />
    </svg>
    <span className="font-sans font-black text-xs tracking-tight">LG</span>
  </div>
);

const WhirlpoolLogo = () => (
  <div className="flex items-center text-amber-500 mt-1">
    <svg className="h-4 w-16" viewBox="0 0 100 35" fill="none" stroke="currentColor">
      <ellipse cx="40" cy="18" rx="36" ry="11" strokeWidth="1.2" strokeDasharray="3 2" transform="rotate(-8 40 18)" />
      <text x="40" y="22" fontSize="12" fontWeight="bold" fontStyle="italic" fontFamily="serif" textAnchor="middle" fill="currentColor">Whirlpool</text>
    </svg>
  </div>
);

const SamsungLogo = () => (
  <div className="flex items-center text-amber-500">
    <svg className="h-4 w-16" viewBox="0 0 100 35" fill="none" stroke="currentColor">
      <ellipse cx="50" cy="17" rx="46" ry="12" strokeWidth="2" />
      <text x="50" y="21" fontSize="9.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5" textAnchor="middle" fill="currentColor">SAMSUNG</text>
    </svg>
  </div>
);

const SonyLogo = () => (
  <div className="flex items-center text-amber-500 mt-1">
    <svg className="h-4 w-12" viewBox="0 0 80 30" fill="none">
      <text x="40" y="21" fontSize="18" fontWeight="bold" fontFamily="serif" letterSpacing="0.8" textAnchor="middle" fill="currentColor">SONY</text>
    </svg>
  </div>
);

const InvoicePreview = ({ details = {}, items = [], onCheckout, onClearCart }) => {
  // Local state for the editable fields
  const [customerName, setCustomerName] = useState(details.customer || "");
  const [phone, setPhone] = useState(details.phone || "");
  const [address, setAddress] = useState(details.address || "");
  const [vehicleNo, setVehicleNo] = useState(details.vehicleNo || "");
  const [transporter, setTransporter] = useState(details.transporter || "");
  
  const [currentGst, setCurrentGst] = useState(18);

  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  
  const cgstPercent = currentGst / 2;
  const sgstPercent = currentGst / 2;
  const cgstAmount = details.cgst !== undefined && details.cgst !== null ? details.cgst : (subtotal * cgstPercent) / 100;
  const sgstAmount = details.sgst !== undefined && details.sgst !== null ? details.sgst : (subtotal * sgstPercent) / 100;
  const taxAmount = cgstAmount + sgstAmount;
  const grandTotal = details.grandTotal !== undefined && details.grandTotal !== null && details.grandTotal !== 0 ? details.grandTotal : subtotal + taxAmount;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const invoiceNoText = details.invoiceNo || "1001";

  // Fill up display items to have at least 6 rows
  const minRows = 6;
  const displayItems = [...items];
  while (displayItems.length < minRows) {
    displayItems.push({ name: "", qty: "", price: "", hsnCode: "", units: "" });
  }

  const handleDownloadPDF = async () => {
    const input = document.getElementById("invoice-print-area");
    if (!input) return false;
    try {
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoiceNoText}.pdf`);
      return true;
    } catch (error) {
      console.error("Failed to generate PDF", error);
      return false;
    }
  };

  return (
    <Card className="h-full flex flex-col p-0 border-card-border/20 bg-surface text-text-main overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-card-border/20">
        <h3 className="font-bold flex items-center gap-2 text-lg">
          <Receipt size={18} className="text-amber-500" />
          Bill Summary
        </h3>
        <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded text-xs font-bold">A4</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Customer Forms */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Customer / Name</label>
              <input type="text" className="w-full bg-surface-alt border border-card-border/20 rounded-md p-2 text-sm focus:border-amber-500/50 outline-none" placeholder="Optional" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Phone Number</label>
              <input type="text" className="w-full bg-surface-alt border border-card-border/20 rounded-md p-2 text-sm focus:border-amber-500/50 outline-none" placeholder="Optional" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Address</label>
              <input type="text" className="w-full bg-surface-alt border border-card-border/20 rounded-md p-2 text-sm focus:border-amber-500/50 outline-none" placeholder="Optional" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Vehicle No.</label>
              <input type="text" className="w-full bg-surface-alt border border-card-border/20 rounded-md p-2 text-sm focus:border-amber-500/50 outline-none" placeholder="Optional" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Transporter</label>
              <input type="text" className="w-full bg-surface-alt border border-card-border/20 rounded-md p-2 text-sm focus:border-amber-500/50 outline-none" placeholder="Optional" value={transporter} onChange={e => setTransporter(e.target.value)} />
            </div>
          </div>

          <div className="bg-surface-alt border border-card-border/20 rounded-lg p-3 flex justify-between items-center mt-2">
            <span className="font-semibold text-text-main text-sm">Bill No.</span>
            <span className="font-bold text-amber-500 tracking-wide">{invoiceNoText}</span>
          </div>
        </div>

        {/* A4 Paper Preview Container */}
        <div className="bg-[#0f172a] p-4 flex justify-center border-y border-card-border/20">
          <div id="invoice-print-area" className="bg-white border border-slate-300 p-4 w-[500px] shadow-lg text-[9px] text-black" style={{ fontFamily: "Arial, sans-serif" }}>
            <div className="border border-slate-400 p-2">
              {/* Invoice Header */}
              <div className="flex justify-between items-end border-b border-slate-400 pb-1 mb-2 font-bold text-[8px] text-slate-800">
                <div>GSTIN : 37CXLPP2604M1ZO</div>
                <div className="underline text-amber-600 text-[9px]">CASH/CREDIT BILL</div>
                <div>Cell : 9490579417, 7989255179</div>
              </div>

              {/* Title & Logos */}
              <div className="flex justify-between items-center mb-2">
                <div className="w-12"><LgLogo /><WhirlpoolLogo /></div>
                <div className="text-center flex-1">
                  <h1 className="text-xl font-black tracking-wider text-amber-600 m-0 uppercase" style={{ fontFamily: "'Times New Roman', serif" }}>STAR SPS Electronics</h1>
                  <div className="text-[7px] text-slate-700 mt-0.5 leading-tight">Room No. 16, 17 & 18, Opp. Soceity Co-op Rural Bank Complex, T.B Road, KALIKIRI-517 234, Annamayya Dt. (A.P.)</div>
                  <div className="text-[9px] font-bold mt-1 text-amber-600 uppercase tracking-widest">Seller for All Electronics</div>
                </div>
                <div className="w-12 text-right"><SamsungLogo /><SonyLogo /></div>
              </div>
              <div className="border-b border-slate-400 mb-2"></div>

              {/* Meta Info */}
              <div className="flex mb-2 gap-4 text-black">
                <div className="flex-1 space-y-1">
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Purchaser :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{customerName}</div></div>
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Address :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{address}</div></div>
                  <div className="flex items-center">
                    <div className="w-16 font-bold text-slate-800">GSTIN :</div>
                    <div className="flex-1 border-b border-slate-400 border-dotted px-1 mr-1"></div>
                    <div className="text-slate-800">State Code..</div>
                    <div className="w-8 border-b border-slate-400 border-dotted"></div>
                  </div>
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Phone :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{phone}</div></div>
                </div>
                <div className="flex-1 space-y-1 text-black">
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Invoice No. :</div><div className="flex-1 font-bold text-amber-600 text-[11px] text-center border-b border-slate-400 border-dotted">{invoiceNoText}</div></div>
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Date :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{dateStr}</div></div>
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Transporter :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{transporter}</div></div>
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Vehical No. :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{vehicleNo}</div></div>
                  <div className="flex"><div className="w-16 font-bold text-slate-800">Mobile :</div><div className="flex-1 border-b border-slate-400 border-dotted px-1">{phone}</div></div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse border border-slate-400 text-[8px] text-black">
                <thead>
                  <tr className="border-b border-slate-400 bg-amber-50 text-amber-700">
                    <th className="border-r border-slate-400 p-1 w-6">S.No.</th>
                    <th className="border-r border-slate-400 p-1 text-left">Item Description</th>
                    <th className="border-r border-slate-400 p-1 w-12">HSN Code</th>
                    <th className="border-r border-slate-400 p-1 w-8">Qty.</th>
                    <th className="border-r border-slate-400 p-1 w-8">Units</th>
                    <th className="border-r border-slate-400 p-1 w-12 text-right">Rate ₹</th>
                    <th className="p-1 w-16 text-right">Gross Amount ₹</th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, idx) => {
                    const isFiller = !item.name;
                    return (
                      <tr key={idx} className="h-4">
                        <td className="border-r border-slate-400 p-1 text-center align-top">{isFiller ? "" : idx + 1}</td>
                        <td className="border-r border-slate-400 p-1 text-left align-top font-medium">{item.name}</td>
                        <td className="border-r border-slate-400 p-1 text-center align-top">{isFiller ? "" : item.hsnCode || "8517"}</td>
                        <td className="border-r border-slate-400 p-1 text-center align-top">{item.qty}</td>
                        <td className="border-r border-slate-400 p-1 text-center align-top">{isFiller ? "" : "Nos"}</td>
                        <td className="border-r border-slate-400 p-1 text-right align-top">{isFiller ? "" : Number(item.price).toFixed(2)}</td>
                        <td className="p-1 text-right align-top">{isFiller ? "" : (Number(item.price) * Number(item.qty)).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                  <tr className="h-20">
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td className="border-r border-slate-400"></td>
                    <td></td>
                  </tr>
                  <tr className="border-t border-slate-400 bg-slate-50">
                    <td colSpan="6" className="border-r border-slate-400 p-1 text-right font-bold text-amber-600">Net Amount ₹</td>
                    <td className="p-1 text-right font-bold">{subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Terms & Taxes */}
              <div className="flex mt-2 pt-1 gap-2 text-black">
                <div className="w-1/2 pr-2 text-[7px] text-slate-600">
                  <div className="font-bold underline text-amber-600 mb-1">TERMS & CONDITIONS :</div>
                  <ol className="pl-3 m-0 space-y-0.5">
                    <li>Goods once sold will not be taken back.</li>
                    <li>For Refrigerators, LED TVs and all other products warranty as for companies policy</li>
                    <li>Any Problems occured in product above 7 days of purchase should not be replaced only service repair will happen.</li>
                    <li>Any disputes & Regarding this invoice. Shall be subject to Vayalapadu, Piler Jurisdiction only.</li>
                  </ol>
                  <div className="mt-6 text-[8px] font-bold text-slate-800">Signature of Receiver</div>
                </div>
                
                <div className="w-1/2 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-center w-1/2 mt-1">
                      <div className="font-bold text-[8px] mb-8 text-amber-600">For Star SPS Electronics</div>
                      <div className="text-[7px]">Authorised Signatory<br/>Seal</div>
                    </div>
                    <div className="w-1/2 space-y-0.5 text-[7px] font-medium border border-slate-400 p-1 rounded bg-slate-50 text-slate-800">
                      <div className="flex justify-between"><span>Spot Disc %</span><span></span></div>
                      <div className="flex justify-between"><span>Spl/Sea Disc</span><span></span></div>
                      <div className="flex justify-between"><span>Other Disc</span><span></span></div>
                      <div className="flex justify-between text-amber-600 font-bold border-b border-slate-400 pb-0.5"><span>Taxable Amt</span><span>{subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between pt-0.5"><span>CGST%</span><span>{cgstAmount.toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>SGST%</span><span>{sgstAmount.toFixed(2)}</span></div>
                      <div className="flex justify-between border-b border-slate-400 pb-0.5"><span>IGST%</span><span>0.00</span></div>
                      <div className="flex justify-between pt-0.5"><span>Round off</span><span>0.00</span></div>
                      <div className="flex justify-between font-bold text-[9px] text-amber-600 pt-0.5 mt-0.5 border-t border-slate-400">
                        <span>Grand Total</span><span>₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary Native UI - Only show during active billing */}
        {onCheckout && (
          <div className="p-4">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm text-text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-text-main">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span>GST %</span>
                <div className="flex gap-2">
                  {[5, 12, 18, 28].map(rate => (
                    <button 
                      key={rate} 
                      onClick={() => setCurrentGst(rate)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${currentGst === rate ? 'bg-amber-500 text-slate-900' : 'bg-surface-alt border border-card-border/30 hover:border-amber-500/50 text-text-main'}`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <span>CGST ({cgstPercent}%)</span>
                <span className="font-medium text-text-main">₹{cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-card-border/20 pb-3">
                <span>SGST ({sgstPercent}%)</span>
                <span className="font-medium text-text-main">₹{sgstAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-1 text-lg font-bold text-text-main">
                <span>Grand Total</span>
                <span className="text-amber-500">₹{Math.round(grandTotal).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-surface border-t border-card-border/20 flex gap-2 mt-auto print:hidden">
        {onClearCart && (
          <Button variant="ghost" onClick={onClearCart} className="border border-card-border/30 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-text-muted px-4">
            <Trash2 size={16} className="mr-1 inline" /> Clear
          </Button>
        )}
        
        <div className="flex gap-2 w-full justify-center">
          <Button variant="outline" onClick={handleDownloadPDF} className="border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-900 px-3 font-semibold transition-colors flex-1 sm:flex-none">
            <Download size={16} className="mr-1 inline" /> Download
          </Button>

          <Button variant="outline" onClick={() => window.print()} className="border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-900 px-3 font-semibold transition-colors flex-1 sm:flex-none">
            <Printer size={16} className="mr-1 inline" /> Print
          </Button>
        </div>
        
        {onCheckout && (
          <Button variant="primary" onClick={async () => {
            const success = await handleDownloadPDF();
            if (success) {
              toast.success("Invoice downloaded successfully!");
            }
            onCheckout({
              customer: customerName,
              phone,
              address,
              vehicleNo,
              transporter,
              cgst: cgstAmount,
              sgst: sgstAmount,
              igst: 0,
              grandTotal: grandTotal,
              taxableAmount: subtotal
            });
          }} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 border-none font-bold min-w-[120px]">
            <Receipt size={18} className="mr-1 inline" /> Checkout
          </Button>
        )}
      </div>
    </Card>
  );
};

export default InvoicePreview;
