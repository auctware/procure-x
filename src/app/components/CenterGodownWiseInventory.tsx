import { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Package, Search, RotateCcw, 
  Filter, Eye, Download, MoreVertical, LayoutGrid, List,
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, 
  PieChart as PieChartIcon, Info, Sparkles, Building2,
  Tag, Layers, ArrowRight, Warehouse, ArrowLeft
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function CenterGodownWiseInventory() {
  const [filters, setFilters] = useState({
    state: 'MAHARASHTRA',
    center: '',
    season: '',
    commodity: '',
    godown: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  // Dropdown states
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);
  const [godownDropdownOpen, setGodownDropdownOpen] = useState(false);

  const centerRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const commodityRef = useRef<HTMLDivElement>(null);
  const godownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleReset = () => {
    setFilters({
      state: 'MAHARASHTRA',
      center: '',
      season: '',
      commodity: '',
      godown: ''
    });
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Procurement</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Center Godown Wise Inventory</span>
      </div>

      {/* Main Filter Section Card (Branded) */}
      <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Warehouse className="w-5 h-5 text-[#027F83]" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Godown Position
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Inventory quantity and bag count mapped to storage spaces
              </p>
            </div>
          </div>
          <button className="h-9 px-4 rounded-lg bg-[#003A5D] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Stock Analytics
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
             <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>State</label>
              <div className="h-12 w-full px-4 rounded-lg border bg-slate-50 border-slate-100 flex items-center text-sm font-bold text-slate-700">
                {filters.state}
              </div>
            </div>
            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Center</label>
              <CustomDropdown
                value={filters.center}
                onChange={(val) => setFilters(prev => ({ ...prev, center: val }))}
                options={[{ value: 'BHMK - BHANDARA MARKET', label: 'BHMK - BHANDARA MARKET' }]}
                placeholder="Select Center"
                isOpen={centerDropdownOpen}
                onToggle={() => setCenterDropdownOpen(!centerDropdownOpen)}
                dropdownRef={centerRef}
              />
            </div>
            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Season</label>
              <CustomDropdown
                value={filters.season}
                onChange={(val) => setFilters(prev => ({ ...prev, season: val }))}
                options={[{ value: '22R', label: '22R' }]}
                placeholder="Select Season"
                isOpen={seasonDropdownOpen}
                onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                dropdownRef={seasonRef}
              />
            </div>
            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Commodity</label>
              <CustomDropdown
                value={filters.commodity}
                onChange={(val) => setFilters(prev => ({ ...prev, commodity: val }))}
                options={[{ value: 'PADDY COMMON', label: 'PADDY COMMON' }]}
                placeholder="Select Commodity"
                isOpen={commodityDropdownOpen}
                onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                dropdownRef={commodityRef}
              />
            </div>
            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Godown</label>
              <CustomDropdown
                value={filters.godown}
                onChange={(val) => setFilters(prev => ({ ...prev, godown: val }))}
                options={[{ value: 'All', label: 'All Godowns' }]}
                placeholder="All Godowns"
                isOpen={godownDropdownOpen}
                onToggle={() => setGodownDropdownOpen(!godownDropdownOpen)}
                dropdownRef={godownRef}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5EBEF' }}>
            <button onClick={handleReset} className="px-8 h-12 rounded-lg border text-slate-600 font-bold text-sm transition-all hover:bg-slate-50" style={{ borderColor: '#E5EBEF' }}>Reset Filters</button>
            <button
              onClick={handleSearch}
              className="px-12 h-12 rounded-lg bg-[#027F83] text-white font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
            >
              {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
              Refresh Inventory
            </button>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50">
                 <List className="w-4 h-4 text-[#315B78]" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>Inventory Position</h2>
           </div>
           <div className="flex items-center gap-3">
              <button className="h-9 px-3 rounded-lg border text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2" style={{ borderColor: '#E5EBEF' }}>
                 Columns
                 <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </button>
              <button className="p-2 rounded-lg bg-slate-50 border text-[#003A5D]" style={{ borderColor: '#E5EBEF' }}>
                 <List className="w-4 h-4" />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full">
              <thead style={{ backgroundColor: '#F7F9FA' }}>
                 <tr>
                    {['Godown Type', 'Capacity (Qtl)', 'Inv. Quantity', 'New Bags', 'Old Bags', 'One Time Bags', 'View Tracking'].map((h, i) => (
                      <th key={i} className="px-8 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {h}
                      </th>
                    ))}
                 </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                 {[
                   { type: 'CLOSE SPACE', cap: 30, qty: 4.786, new: 3, old: 6, oneTime: 0 },
                   { type: 'CLOSE SPACE', cap: 20, qty: 4.023, new: 4, old: 4, oneTime: 5 },
                   { type: 'OPEN SPACE', cap: 300, qty: 5.488, new: 0, old: 0, oneTime: 0 },
                   { type: 'CLOSE SPACE', cap: 16.236, qty: 8.472, new: 10, old: 0, oneTime: 4 },
                 ].map((row, i) => (
                   <tr key={i} className="border-t transition-colors hover:bg-gray-50" style={{ borderColor: '#E5EBEF' }}>
                      <td className="px-8 py-4">
                         <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${row.type === 'CLOSE SPACE' ? 'bg-indigo-500' : 'bg-amber-500'}`}></span>
                            <span className="text-sm font-bold text-[#315B78]">{row.type}</span>
                         </div>
                      </td>
                      <td className="px-8 py-4 text-sm font-bold text-[#315B78]">{row.cap}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-[#027F83]">{row.qty}</span>
                           <TrendingUp className="w-3 h-3 text-emerald-500" />
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm text-[#315B78] font-bold">{row.new}</td>
                      <td className="px-8 py-4 text-sm text-[#315B78] font-bold">{row.old}</td>
                      <td className="px-8 py-4 text-sm text-[#315B78] font-bold">{row.oneTime}</td>
                      <td className="px-8 py-4">
                         <button className="p-2 rounded-lg bg-white border flex items-center justify-center text-slate-400 hover:text-[#027F83] hover:border-[#027F83] transition-all" style={{ borderColor: '#E5EBEF' }}>
                            <Eye className="w-4 h-4" />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="px-8 py-6 border-t flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#027F83] transition-colors">
               <ArrowLeft className="w-4 h-4" />
               Previous Page
            </button>
            <div className="flex items-center gap-1.5">
               {[1, 2, 3].map(n => (
                 <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === 1 ? 'bg-[#027F83] text-white' : 'bg-white border hover:bg-slate-50'}`} style={{ borderColor: n === 1 ? '#027F83' : '#E5EBEF' }}>
                    {n}
                 </button>
               ))}
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-[#027F83] hover:translate-x-1 transition-all">
               Next Page
               <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="mt-8 flex flex-col md:flex-row gap-6">
         <div className="flex-1 p-8 rounded-xl bg-[#003A5D] text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <h4 style={{ fontSize: '18px', fontWeight: '700' }} className="mb-4 flex items-center gap-3 text-white">
               <Sparkles className="w-5 h-5 text-amber-400" />
               Capacity Insight
            </h4>
            <div className="space-y-4">
               <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-300">Space Utilization</span>
                  <span className="text-sm font-bold">74.2%</span>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[74.2%]"></div>
               </div>
               <p className="text-xs text-slate-300 leading-relaxed">Most storage units are approaching full capacity. Procurement should prioritize dispatching older lots to free up critical space.</p>
            </div>
         </div>
         <div className="flex-1 p-8 rounded-xl bg-slate-50 border" style={{ borderColor: '#E5EBEF' }}>
            <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }} className="mb-4">Location Legend</h4>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Close Space', color: 'bg-indigo-500', desc: 'Silos and covered godowns' },
                 { label: 'Open Space', color: 'bg-amber-500', desc: 'Plinths and open storage' },
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} mt-1.5`}></div>
                    <div>
                       <p className="text-sm font-bold text-[#315B78] leading-none mb-1">{item.label}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
