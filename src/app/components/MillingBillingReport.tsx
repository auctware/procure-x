import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Calculator, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Package, Layers, Info,
  RefreshCcw, Upload, FileText, Send, Save,
  X, Check, DollarSign, Receipt, CreditCard, ChevronDown, Truck
} from 'lucide-react';

export default function MillingBillingReport() {
  const [isSearching, setIsSearching] = useState(false);

  const billingData = [
    { code: '9111', commodity: 'PADDY COMMON', season: '21R', agency: 'G3062', doNo: 'ROW102501220402511', doQty: 200, lifted: 100, ldNo: 'ABADV01250122', cmrQty: 78, cmrNoBags: 156, rate: 100, equivalentPaddy: 116.418, lateLift: 6000, lateDeposit: 0, millingAmount: 10000, initial: 12500, final: 12500 },
    { code: '9111', commodity: 'PADDY COMMON', season: '21R', agency: 'G3062', doNo: 'ROW102501220402512', doQty: 300, lifted: 200, ldNo: 'ABADV01250123', cmrQty: 156, cmrNoBags: 312, rate: 100, equivalentPaddy: 232.836, lateLift: 0, lateDeposit: 1200, millingAmount: 20000, initial: 24000, final: 24000 },
  ];

  const stats = [
    { label: 'Total DO Lifted Qty', value: '3,221', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total CMR Deposited', value: '1,495', icon: Layers, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Equiv. Paddy', value: '2,231.344', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Milling Amount', value: '₹2,21,492', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Paddy Due', value: '989.656', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Late Lift Penalty', value: '₹48,000', icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Late Deposit Penalty', value: '₹12,089', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Gunny Bag Penalty', value: '₹65,120', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'CMR Diff Penalty', value: '₹6,740', icon: RefreshCcw, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Transportation Chg', value: '₹2,530', icon: Truck, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Milling Billing Report</span>
      </div>

      {/* Main Header */}
      <div className="mb-8 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
               <Receipt className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-[#003A5D] tracking-tight">Milling Billing Reports</h1>
               <p className="text-sm text-slate-400 font-medium">Consolidated billing summary and penalty adjustments for all milled batches</p>
            </div>
         </div>
         <div className="flex gap-3">
            <button className="h-12 px-6 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
               <Download className="w-4 h-4" />
               Export PDF
            </button>
            <button className="h-12 px-8 rounded-xl bg-[#027F83] text-white font-black text-sm shadow-lg shadow-[#027F83]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
               <Calculator className="w-5 h-5" />
               Generate Bill
            </button>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
         {stats.map((stat, i) => (
           <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:border-indigo-100 transition-all group">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                 <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                 <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
           </div>
         ))}
      </div>

      {/* Filters Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-end">
            <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">State</label>
               <select className="w-full h-11 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                  <option>MAHARASHTRA</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Agency</label>
               <select className="w-full h-11 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                  <option>G3062 - AB State Agency</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">District</label>
               <select className="w-full h-11 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                  <option>NANDED</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mill</label>
               <select className="w-full h-11 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                  <option>9111 - SHRI DATTA RICE MILL</option>
               </select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Commodity</label>
               <select className="w-full h-11 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                  <option>PADDY COMMON</option>
               </select>
            </div>
            <button 
              onClick={handleSearch}
              className="h-11 rounded-xl bg-indigo-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all"
            >
               {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
               Run Report
            </button>
         </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-nowrap">
               <thead className="bg-[#F8FAFC]">
                  <tr className="border-b" style={{ borderColor: '#E2E8F0' }}>
                     {['Mill Code', 'Do No', 'DO Qty', 'Lifted', 'Equivalent Paddy', 'Late Lift', 'Late Deposit', 'Milling Amt', 'Final Amount', 'Actions'].map((h, i) => (
                       <th key={i} className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y" style={{ borderColor: '#F1F5F9' }}>
                  {billingData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-5">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-[#003A5D]">{row.code}</span>
                             <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{row.commodity}</span>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-[12px] font-black text-slate-600 font-mono tracking-tight">{row.doNo}</span>
                       </td>
                       <td className="px-6 py-5 text-sm font-black text-slate-600">{row.doQty}</td>
                       <td className="px-6 py-5 text-sm font-black text-emerald-600">{row.lifted}</td>
                       <td className="px-6 py-5 text-sm font-black text-indigo-600">{row.equivalentPaddy}</td>
                       <td className="px-6 py-5 text-sm font-black text-red-500">₹{row.lateLift}</td>
                       <td className="px-6 py-5 text-sm font-black text-rose-500">₹{row.lateDeposit}</td>
                       <td className="px-6 py-5 text-sm font-black text-amber-600">₹{row.millingAmount}</td>
                       <td className="px-6 py-5">
                          <div className="px-3 py-1 bg-indigo-50 rounded-lg inline-block">
                             <span className="text-sm font-black text-indigo-700">₹{row.final}</span>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex gap-2">
                             <button className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#027F83] shadow-sm hover:bg-[#027F83] hover:text-white transition-all group">
                                <Eye className="w-4 h-4" />
                             </button>
                             <button className="h-9 px-3 rounded-lg bg-white border border-indigo-200 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                                Waive Off
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
