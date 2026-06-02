import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Truck, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Package, Layers, Info,
  RefreshCcw, Upload, FileText, LayoutGrid, Save,
  Plus, Smartphone, ShieldCheck, X
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function CenterToMillDispatch() {
  const [activeTab, setActiveTab] = useState('Create Dispatch');
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    doNumber: 'ROW6103042404041848',
    dispatchDate: '2024-04-03',
    state: 'MOCK STATE',
    seasonId: '22R',
    centerCode: 'SMMK - SM MOCK MARKET',
    commodityCode: 'MOCK PADDY A',
    millCode: 'SMMB - SMMB MILLER MOCK PRIVATE LIMITED',
    bagType: '50 KG JUTE BAG',
    grossQty: '24.000',
    quantity: '0.000',
    bags: '12',
    oldBags: '2',
    newBags: '5',
    oneTimeBags: '5'
  });

  const godownDetails = [
    { code: 'SMMK04', name: 'TEST', availableDO: 4, grossQty: 4, dispatchQty: 0, oldBags: 2, availableOld: 2, newBags: 0, availableNew: 0, oneTime: 0, availableOne: 0 },
    { code: 'SMMK06', name: 'MOCKK KKK', availableDO: 20, grossQty: 20, dispatchQty: 0, oldBags: 0, availableOld: 0, newBags: 5, availableNew: 5, oneTime: 5, availableOne: 5 },
  ];

  const handleSave = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1000);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Center to Mill Dispatch</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Truck className="w-5 h-5 text-[#027F83]" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Dispatch to Milling Unit
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Register transit documents and facilitate raw material transfer from storage to mill
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
            {['Create Dispatch', 'View Dispatch', 'Dispatch With DO'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-[#027F83] shadow-sm' : 'text-slate-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
           {/* Top Form Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5 mb-10">
              <div className="space-y-1.5 lg:col-span-2">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DO Number <span className="text-red-500">*</span></label>
                 <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>
                    {formData.doNumber}
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dispatch Date <span className="text-red-500">*</span></label>
                 <input type="date" defaultValue={formData.dispatchDate} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Season Id</label>
                 <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>
                    {formData.seasonId}
                 </div>
              </div>
              
              <div className="space-y-1.5 lg:col-span-2">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Center Code</label>
                 <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>
                    {formData.centerCode}
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Commodity Code</label>
                 <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>
                    {formData.commodityCode}
                 </div>
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mill / Processing Unit</label>
                 <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }} title={formData.millCode}>
                    <span className="truncate">{formData.millCode}</span>
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bag Type</label>
                 <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>
                    {formData.bagType}
                 </div>
              </div>
           </div>

           {/* Stats Summary Panel */}
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 p-6 rounded-2xl bg-[#003A5D]/5 border border-indigo-100">
              {[
                { label: 'Gross Qty', value: formData.grossQty, sub: 'QTL', icon: Package, color: 'text-indigo-600' },
                { label: 'Net Weight', value: formData.quantity, sub: 'QTL', icon: TrendingUp },
                { label: 'Total Bags', value: formData.bags, sub: 'QTY', icon: Layers },
                { label: 'Old Bags', value: formData.oldBags, sub: 'QTY', icon: RotateCcw },
                { label: 'New Bags', value: formData.newBags, sub: 'QTY', icon: Plus, color: 'text-emerald-600' },
                { label: 'One Time', value: formData.oneTimeBags, sub: 'QTY', icon: Clock },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <stat.icon className="w-3 h-3" />
                      {stat.label}
                   </p>
                   <p className={`text-xl font-black ${stat.color || 'text-[#003A5D]'} leading-tight`}>
                      {stat.value} <span className="text-[10px] text-slate-400">{stat.sub}</span>
                   </p>
                </div>
              ))}
           </div>

           {/* Table Section */}
           <div className="space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black text-[#315B78] uppercase tracking-wider flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    Storage Site Allocation
                 </h3>
                 <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Input Mode:</span>
                    <button className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-[#027F83]">Manual Quantities</button>
                 </div>
              </div>

              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
                 <table className="w-full text-nowrap">
                    <thead className="bg-slate-50">
                       <tr className="divide-x divide-slate-100">
                          {['Site / Godown', 'Avail. DO', 'Gross Qty', 'Dispatch', 'Old Bag', 'New Bag', 'One Time'].map((h, i) => (
                            <th key={i} className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                       {godownDetails.map((row, i) => (
                         <tr key={i} className="divide-x divide-slate-50 hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-4">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-blue-400'}`}></div>
                                  <div className="flex flex-col">
                                     <span className="text-sm font-black text-[#315B78]">{row.code}</span>
                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{row.name}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-5 py-4 text-sm font-bold text-slate-600">{row.availableDO}</td>
                            <td className="px-5 py-4 text-sm font-black text-[#003A5D]">{row.grossQty}</td>
                            <td className="px-5 py-4">
                               <input type="text" className="w-24 h-10 px-3 rounded-xl border bg-white focus:border-indigo-400 outline-none text-sm font-bold transition-all shadow-sm" defaultValue={row.dispatchQty} style={{ borderColor: '#E2E8F0' }} />
                            </td>
                            <td className="px-5 py-4">
                               <input type="text" className="w-16 h-10 px-2 rounded-xl border bg-white focus:border-indigo-400 outline-none text-sm font-bold transition-all" defaultValue={row.oldBags} style={{ borderColor: '#E2E8F0' }} />
                            </td>
                            <td className="px-5 py-4">
                               <input type="text" className="w-16 h-10 px-2 rounded-xl border bg-white focus:border-indigo-400 outline-none text-sm font-bold transition-all" defaultValue={row.newBags} style={{ borderColor: '#E2E8F0' }} />
                            </td>
                            <td className="px-5 py-4">
                               <input type="text" className="w-16 h-10 px-2 rounded-xl border bg-white focus:border-indigo-400 outline-none text-sm font-bold transition-all" defaultValue={row.oneTime} style={{ borderColor: '#E2E8F0' }} />
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Actions Footer */}
           <div className="mt-10 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6" style={{ borderColor: '#E5EBEF' }}>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-xl">
                 <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                 <p className="text-xs text-slate-500 leading-relaxed">
                    Ensure the <strong>Vehicle Details</strong> and <strong>LR / Gate Pass Number</strong> are correctly mapped before confirming the dispatch. Inventory once dispatched cannot be altered without a reversal request.
                 </p>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all">Reset Form</button>
                 <button 
                  onClick={handleSave}
                  className="px-12 h-12 rounded-xl bg-[#315B78] text-white font-black shadow-lg shadow-[#315B78]/20 flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all"
                 >
                    {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    Confirm & Save Dispatch
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
