import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, FileText, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Package, Layers, Info,
  RefreshCcw, Upload, Send, Save,
  X, Check, DollarSign, Receipt, CreditCard, ChevronDown,
  ArrowLeft
} from 'lucide-react';

export default function MillingBillingDetails() {
  const billingDetail = {
    doNumber: 'ROW102501220958242',
    doQuantityDue: '200',
    doLiftedQuantity: '100',
    ldNumber: 'ABADV01250122',
    cmrDepositedQuantity: '78',
    cmrNoOfBags: '156',
    millingRate: '100',
    equivalentPaddyQuantity: '116.418',
    transportCharges: '140',
    lateLiftPenalty: '6000',
    lateLiftWaiveRemark: 'Lift waive',
    lateLiftApprovalRemark: 'Lift Approve',
    lateDepositPenalty: '0',
    lateDepositWaiveRemark: 'Deposit waive',
    lateDepositApprovalRemark: 'deposit Approve',
    gunnyBagPenalty: '1600',
    gunnyBagWaiveRemark: 'Gunny Waive',
    gunnyBagApprovalRemark: 'Gunny Approve',
    cmrDifferencePenalty: '0',
    cmrDiffWaiveRemark: 'CMR Waive',
    cmrDiffApprovalRemark: 'CMR Approve',
    otherCharges: '50',
    otherWaiveRemark: 'Other Waive',
    otherApprovalRemark: 'Charges Approve',
    initialAmount: '2490.00',
    totalMillingAmount: '10000'
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Billing Report</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Detailed View</span>
      </div>

      <div className="mb-8 flex items-center gap-4">
         <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <div>
            <h1 className="text-xl font-black text-[#003A5D]">Billing Settlement Details</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Reference: {billingDetail.doNumber}</p>
         </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="px-8 py-6 border-b bg-slate-50/30" style={{ borderColor: '#E5EBEF' }}>
          <h2 className="text-sm font-black text-[#315B78] uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
             Full Breakdown - DO {billingDetail.doNumber}
          </h2>
        </div>

        <div className="p-0">
           <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-y md:divide-y-0" style={{ borderColor: '#F1F5F9' }}>
              
              {/* Header Titles */}
              <div className="p-5 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parameter Description</div>
              <div className="p-5 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Value / Calculation</div>
              <div className="p-5 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">Remarks & Approvals</div>

              {/* Rows */}
              {[
                { label: 'DO Detail', v1: `Qty Due: ${billingDetail.doQuantityDue}`, v2: `Lifted: ${billingDetail.doLiftedQuantity}`, isHeader: true },
                { label: 'LD Control', v1: `LD#: ${billingDetail.ldNumber}`, v2: `Dep. Qty: ${billingDetail.cmrDepositedQuantity}` },
                { label: 'Bags & Rate', v1: `Bags: ${billingDetail.cmrNoOfBags}`, v2: `Rate: ₹${billingDetail.millingRate}` },
                { label: 'Conversion', v1: `Equiv Paddy: ${billingDetail.equivalentPaddyQuantity}`, v2: `Transp: ₹${billingDetail.transportCharges}` },
                
                { label: 'Late Lift Penalty', v1: `₹${billingDetail.lateLiftPenalty}`, v2: billingDetail.lateLiftWaiveRemark, v3: billingDetail.lateLiftApprovalRemark, hl: 'text-red-500' },
                { label: 'Late Deposit Penalty', v1: `₹${billingDetail.lateDepositPenalty}`, v2: billingDetail.lateDepositWaiveRemark, v3: billingDetail.lateDepositApprovalRemark, hl: 'text-rose-500' },
                { label: 'Gunny Bag Penalty', v1: `₹${billingDetail.gunnyBagPenalty}`, v2: billingDetail.gunnyBagWaiveRemark, v3: billingDetail.gunnyBagApprovalRemark, hl: 'text-purple-600' },
                { label: 'CMR Diff Penalty', v1: `₹${billingDetail.cmrDifferencePenalty}`, v2: billingDetail.cmrDiffWaiveRemark, v3: billingDetail.cmrDiffApprovalRemark, hl: 'text-cyan-600' },
                { label: 'Other Charges', v1: `₹${billingDetail.otherCharges}`, v2: billingDetail.otherWaiveRemark, v3: billingDetail.otherApprovalRemark, hl: 'text-slate-600' },
                
                { label: 'Summary', v1: `Initial: ₹${billingDetail.initialAmount}`, v2: `Total Milling: ₹${billingDetail.totalMillingAmount}`, isFooter: true },
              ].map((row, i) => (
                <>
                  <div key={`l-${i}`} className={`p-5 px-8 text-xs font-bold ${row.isHeader || row.isFooter ? 'bg-indigo-50/50 text-indigo-900' : 'text-slate-600'}`}>
                     {row.label}
                  </div>
                  <div key={`v1-${i}`} className={`p-5 px-8 flex flex-col gap-1 ${row.isHeader || row.isFooter ? 'bg-indigo-50/50' : ''}`}>
                     <span className={`text-sm font-black ${row.hl || 'text-[#003A5D]'}`}>{row.v1}</span>
                     {row.v2 && !row.isHeader && !row.isFooter && <span className="text-[11px] text-slate-400 font-medium">{row.v2}</span>}
                  </div>
                  <div key={`v2-${i}`} className={`p-5 px-8 flex flex-col gap-1 ${row.isHeader || row.isFooter ? 'bg-indigo-50/50' : ''}`}>
                     {row.isHeader ? (
                        <span className="text-sm font-black text-indigo-700">{row.v2}</span>
                     ) : row.isFooter ? (
                        <div className="px-4 py-2 bg-indigo-600 rounded-xl inline-block w-fit">
                           <span className="text-sm font-black text-white">{row.v2}</span>
                        </div>
                     ) : (
                        <>
                           <span className="text-[11px] font-black text-emerald-600 uppercase tracking-tighter">Approved: {row.v3}</span>
                           <span className="text-[11px] font-black text-amber-600 uppercase tracking-tighter">Waive: {row.v2}</span>
                        </>
                     )}
                  </div>
                </>
              ))}
           </div>
        </div>
        
        <div className="p-8 border-t flex justify-end gap-4" style={{ borderColor: '#F1F5F9' }}>
           <button className="px-10 h-12 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:translate-y-[-2px] transition-all">
              DOWNLOAD SETTLEMENT VOUCHER
           </button>
           <button className="px-8 h-12 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all">
              BACK TO LIST
           </button>
        </div>
      </div>
    </div>
  );
}
