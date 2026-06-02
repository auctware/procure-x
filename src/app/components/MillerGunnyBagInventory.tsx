import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Package, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Layers, Info,
  RefreshCcw, Upload, FileText, LayoutGrid, X,
  ArrowRight
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function MillerGunnyBagInventory() {
  const [activeTab, setActiveTab] = useState('Filled Gunny Bags');
  const [isSearching, setIsSearching] = useState(false);

  const inventoryData = [
    { state: 'MOCK STATE', millName: 'SM MOCK MILL', millCode: 'SMML', season: '21K', totalBags: 293, oneTime: 0, oldBags: 151, newBags: 151 },
    { state: 'MOCK STATE', millName: 'SM MOCK MILL', millCode: 'SMML', season: '21R', totalBags: 41, oneTime: 5, oldBags: 17, newBags: 17 },
    { state: 'MOCK STATE', millName: 'SM MOCK MILL', millCode: 'SMML', season: '22R', totalBags: 0, oneTime: 0, oldBags: 1, newBags: 1 },
    { state: 'MOCK STATE', millName: 'SM MOCK MILL', millCode: 'SMML', season: '22R', totalBags: 655, oneTime: 18, oldBags: 448, newBags: 457 },
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
        <span style={{ fontWeight: '600', color: '#222' }}>Miller Gunny Bag Inventory</span>
      </div>

      {/* Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Package className="w-20 h-20" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Available Bags</p>
            <h3 className="text-2xl font-black text-[#003A5D]">989</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-500">
               <ArrowUpRight className="w-3.5 h-3.5" />
               <span>+12.4% vs last week</span>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total New Bags</p>
            <h3 className="text-2xl font-black text-blue-600">626</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Allocated for 2024 Kharif</p>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Old Bags In Stock</p>
            <h3 className="text-2xl font-black text-orange-500">340</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Requires sterilization check</p>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rejected Bags</p>
            <h3 className="text-2xl font-black text-red-500">23</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">Pending return to center</p>
         </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Layers className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Inventory Positions
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Track filled and rejected gunny bag stocks across processing units
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button className="h-10 px-5 rounded-lg border border-[#027F83] text-[#027F83] font-bold text-xs bg-white hover:bg-[#027F83]/5 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Ledger
             </button>
             <button className="h-10 px-5 rounded-lg bg-[#315B78] text-white font-bold text-xs shadow-md flex items-center gap-2 shrink-0">
                <RefreshCcw className="w-4 h-4" />
                Sync Inventory
             </button>
          </div>
        </div>

        <div className="p-8">
           {/* Filters */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 items-end p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">State</label>
                 <select className="w-full h-11 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>MOCK STATE</option>
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mill Code</label>
                 <select className="w-full h-11 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>SMML - SM MOCK MILL</option>
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pack Type</label>
                 <select className="w-full h-11 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>50 KG JUTE BAG</option>
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Season</label>
                 <select className="w-full h-11 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>--Select--</option>
                    <option>21K</option>
                    <option>21R</option>
                    <option>22R</option>
                 </select>
              </div>
              <button 
                onClick={handleSearch}
                className="h-11 rounded-xl bg-[#027F83] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
              >
                {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
                Search stock
              </button>
           </div>

           {/* Tab Switcher */}
           <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#E5EBEF' }}>
              {['Filled Gunny Bags', 'Rejected Gunny Bags'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#027F83]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#027F83] rounded-t-full"></div>}
                </button>
              ))}
           </div>

           {/* Table Section */}
           <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
              <table className="w-full text-nowrap">
                 <thead className="bg-[#F7F9FA]">
                    <tr className="border-b" style={{ borderColor: '#E5EBEF' }}>
                       {['State', 'Mill Details', 'Season', 'Total Bags', 'One Time', 'Old Bags', 'New Bags', 'Ledger'].map((h, i) => (
                         <th key={i} className="px-5 py-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                    {inventoryData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="px-5 py-4 text-xs font-bold text-[#315B78]">{row.state}</td>
                         <td className="px-5 py-4">
                            <div className="flex flex-col">
                               <span className="text-sm font-black text-[#003A5D]">{row.millName}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Code: {row.millCode}</span>
                            </div>
                         </td>
                         <td className="px-5 py-4">
                            <span className="px-2 py-1 rounded bg-slate-100 text-[10px] font-black text-slate-600 tracking-tighter">{row.season}</span>
                         </td>
                         <td className="px-5 py-4 text-sm font-black text-[#315B78]">{row.totalBags}</td>
                         <td className="px-5 py-4 text-sm font-bold text-blue-600">{row.oneTime}</td>
                         <td className="px-5 py-4 text-sm font-bold text-orange-500">{row.oldBags}</td>
                         <td className="px-5 py-4 text-sm font-bold text-emerald-600">{row.newBags}</td>
                         <td className="px-5 py-4">
                            <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[#027F83] font-bold text-xs bg-white hover:bg-[#027F83] hover:text-white transition-all flex items-center gap-2">
                               View
                               <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Inventory Legend */}
           <div className="mt-8 p-5 rounded-xl border border-dashed border-slate-200 flex flex-wrap gap-8 items-center justify-center">
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Filled Stock</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Refurbished Stock</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Brand New Stock</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Damaged / Rejected</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
