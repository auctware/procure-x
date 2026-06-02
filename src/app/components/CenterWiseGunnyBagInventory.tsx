import { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Package, Search, RotateCcw, 
  Filter, Eye, Download, MoreVertical, LayoutGrid, List,
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, 
  PieChart as PieChartIcon, Info, Sparkles, Building2,
  Tag, Layers, ArrowRight, ArrowLeft
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function CenterWiseGunnyBagInventory() {
  const [activeTab, setActiveTab] = useState<'empty' | 'filled' | 'rejected'>('filled');
  const [filters, setFilters] = useState({
    stateAgency: '',
    districtAgency: '',
    season: '',
    center: '',
    commodity: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  // Dropdown states
  const [stateAgencyDropdownOpen, setStateAgencyDropdownOpen] = useState(false);
  const [districtAgencyDropdownOpen, setDistrictAgencyDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);

  const stateAgencyRef = useRef<HTMLDivElement>(null);
  const districtAgencyRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const commodityRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleReset = () => {
    setFilters({
      stateAgency: '',
      districtAgency: '',
      season: '',
      center: '',
      commodity: ''
    });
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Procurement</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Center-wise Gunny Bag Inventory</span>
      </div>

      {/* Filter Section Card */}
      <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Layers className="w-5 h-5 text-[#027F83]" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Center-wise Inventory
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Real-time stock position across all procurement centers
              </p>
            </div>
          </div>
          <button className="h-9 px-4 rounded-lg bg-[#003A5D] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Analytics
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
             <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>State Agency</label>
                <CustomDropdown
                  value={filters.stateAgency}
                  onChange={(val) => setFilters(prev => ({ ...prev, stateAgency: val }))}
                  options={[{ value: 'MAHAFED', label: 'MAHAFED' }]}
                  placeholder="Select State Agency"
                  isOpen={stateAgencyDropdownOpen}
                  onToggle={() => setStateAgencyDropdownOpen(!stateAgencyDropdownOpen)}
                  dropdownRef={stateAgencyRef}
                />
             </div>
             <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>District Agency</label>
                <CustomDropdown
                  value={filters.districtAgency}
                  onChange={(val) => setFilters(prev => ({ ...prev, districtAgency: val }))}
                  options={[{ value: 'DMO_NANDED', label: 'DMO NANDED' }]}
                  placeholder="Select District Agency"
                  isOpen={districtAgencyDropdownOpen}
                  onToggle={() => setDistrictAgencyDropdownOpen(!districtAgencyDropdownOpen)}
                  dropdownRef={districtAgencyRef}
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
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Center</label>
                <CustomDropdown
                  value={filters.center}
                  onChange={(val) => setFilters(prev => ({ ...prev, center: val }))}
                  options={[{ value: 'AB_MSP_CENTER', label: 'AB MSP CENTER' }]}
                  placeholder="Select Center"
                  isOpen={centerDropdownOpen}
                  onToggle={() => setCenterDropdownOpen(!centerDropdownOpen)}
                  dropdownRef={centerRef}
                />
             </div>
             <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Commodity</label>
                <CustomDropdown
                  value={filters.commodity}
                  onChange={(val) => setFilters(prev => ({ ...prev, commodity: val }))}
                  options={[{ value: 'PADDY_COMMON', label: 'PADDY COMMON' }]}
                  placeholder="Select Commodity"
                  isOpen={commodityDropdownOpen}
                  onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                  dropdownRef={commodityRef}
                />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5EBEF' }}>
            <button onClick={handleReset} className="px-8 h-12 rounded-lg border text-slate-600 font-bold text-sm transition-all hover:bg-slate-50" style={{ borderColor: '#E5EBEF' }}>Reset Filters</button>
            <button
              onClick={handleSearch}
              className="px-10 h-12 rounded-lg bg-[#027F83] text-white font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
            >
              {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Tabs & Table Container */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="flex items-center px-6 border-b gap-4 bg-slate-50/50" style={{ borderColor: '#E5EBEF' }}>
           {['empty', 'filled', 'rejected'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className="px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative border-b-2"
               style={{
                 borderBottomColor: activeTab === tab ? '#027F83' : 'transparent',
                 color: activeTab === tab ? '#027F83' : '#64748B',
               }}
             >
               {tab} Gunny Bag
             </button>
           ))}
        </div>

        <div className="p-8">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#027F83]/10">
                    <List className="w-4 h-4 text-[#027F83]" />
                 </div>
                 <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }} className="capitalize">{activeTab} Bag Details</h3>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-xs font-bold text-[#027F83] bg-[#E6F7F7] px-4 py-2 rounded-lg border border-[#027F83]/10">
                   14 Active Columns
                 </span>
                 <button className="p-2.5 rounded-lg border bg-white hover:bg-slate-50 transition-all text-slate-500" style={{ borderColor: '#E5EBEF' }}>
                    <Download className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
              <table className="w-full">
                 <thead style={{ backgroundColor: '#F7F9FA' }}>
                    <tr>
                       {['Commodity', 'Pack Type', 'Total Bags', 'Old Bags', 'New Bags', 'One Time bags', 'Last Reference No', 'Ledger'].map((h, i) => (
                         <th key={i} className="px-6 py-4 text-left" style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                           {h}
                         </th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                    <tr className="border-t transition-colors hover:bg-gray-50" style={{ borderColor: '#E5EBEF' }}>
                       <td className="px-6 py-4 text-sm font-bold text-[#315B78]">PADDY COMMON</td>
                       <td className="px-6 py-4 text-sm text-[#315B78] font-bold">-</td>
                       <td className="px-6 py-4 text-base font-bold text-[#027F83]">213</td>
                       <td className="px-6 py-4 text-sm text-[#315B78] font-bold">61</td>
                       <td className="px-6 py-4 text-sm text-[#315B78] font-bold">71</td>
                       <td className="px-6 py-4 text-sm text-[#315B78] font-bold">81</td>
                       <td className="px-6 py-4 text-xs text-slate-500 font-medium tracking-tight">1014102303532940</td>
                       <td className="px-6 py-4">
                          <button className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-slate-400 hover:text-[#027F83] hover:border-[#027F83] hover:bg-[#027F83]/5 transition-all shadow-sm" style={{ borderColor: '#E5EBEF' }}>
                             <Eye className="w-5 h-5" />
                          </button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>

           <div className="mt-8 flex items-center justify-between text-sm text-slate-500 font-medium">
              <div>Page 1 of 12</div>
              <div className="flex gap-2">
                 <button className="p-2 rounded-lg border opacity-50 cursor-not-allowed" style={{ borderColor: '#E5EBEF' }}><ArrowLeft className="w-4 h-4" /></button>
                 {[1, 2, 3, '...', 12].map((n, i) => (
                    <button key={i} className={`w-9 h-9 rounded-lg border flex items-center justify-center font-bold ${n === 1 ? 'bg-[#027F83] text-white border-[#027F83]' : 'bg-white hover:bg-slate-50 text-slate-600'}`} style={{ borderColor: n === 1 ? '#027F83' : '#E5EBEF' }}>{n}</button>
                 ))}
                 <button className="p-2 rounded-lg border hover:bg-slate-50" style={{ borderColor: '#E5EBEF' }}><ArrowRight className="w-4 h-4" /></button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
