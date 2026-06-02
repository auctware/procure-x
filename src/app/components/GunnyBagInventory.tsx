import { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Package, Search, RotateCcw, 
  Filter, Eye, Download, MoreVertical, LayoutGrid, List,
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, 
  PieChart as PieChartIcon, Info, Sparkles, Building2
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface InventoryDetails {
  godown: string;
  districtAgency: string;
  season: string;
  packType: string;
  oldBags: number;
  newBags: number;
  oneTimeBags: number;
  totalBags: number;
  lastUpdated: string;
}

export default function GunnyBagInventory() {
  const [filters, setFilters] = useState({
    stateAgency: '',
    districtAgency: '',
    season: '',
    packType: '',
    godown: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Dropdown states
  const [stateAgencyDropdownOpen, setStateAgencyDropdownOpen] = useState(false);
  const [districtAgencyDropdownOpen, setDistrictAgencyDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [packTypeDropdownOpen, setPackTypeDropdownOpen] = useState(false);
  const [godownDropdownOpen, setGodownDropdownOpen] = useState(false);

  const stateAgencyRef = useRef<HTMLDivElement>(null);
  const districtAgencyRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const packTypeRef = useRef<HTMLDivElement>(null);
  const godownRef = useRef<HTMLDivElement>(null);

  const [inventoryData, setInventoryData] = useState<InventoryDetails[]>([
    {
      godown: 'DEF',
      districtAgency: 'AB District Agency',
      season: '22R',
      packType: '35 KG JUTE BAG',
      oldBags: 10,
      newBags: 10,
      oneTimeBags: 10,
      totalBags: 30,
      lastUpdated: '2025-01-18'
    },
    {
      godown: 'WAREHOUSE-A',
      districtAgency: 'DMO Nanded',
      season: '23K',
      packType: '50 KG HDPE BAG',
      oldBags: 150,
      newBags: 500,
      oneTimeBags: 50,
      totalBags: 700,
      lastUpdated: '2025-01-17'
    }
  ]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleReset = () => {
    setFilters({
      stateAgency: '',
      districtAgency: '',
      season: '',
      packType: '',
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
        <span style={{ fontWeight: '600', color: '#222' }}>Gunny Bag Inventory</span>
      </div>


      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Bag Stock', val: '730', icon: Package, trend: '+5.2%', color: '#027F83' },
          { label: 'Total Godowns', val: '12', icon: Building2, trend: 'Optimal', color: '#003A5D' },
          { label: 'Recent Deliveries', val: '45', icon: Activity, trend: 'Active', color: '#00A040' },
          { label: 'Stock Value', val: '₹12.4L', icon: TrendingUp, trend: '+2.1%', color: '#3B82F6' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md group" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: `${stat.color}10`, color: stat.color }}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-tighter shadow-sm border border-emerald-100">
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-[#315B78] leading-none">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Filter Section Card */}
      <div className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Package className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Gunny Bag Inventory
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Filter and analyze stock across all warehouses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="h-9 px-4 rounded-lg border text-slate-600 font-bold text-xs transition-all hover:bg-slate-50 flex items-center gap-2"  style={{ borderColor: '#E5EBEF' }}>
                <Download className="w-3.5 h-3.5" />
                Export
             </button>
             <div className="px-3 py-1.5 rounded-lg bg-[#027F83]/10 border border-[#027F83]/20 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#027F83]" />
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#027F83' }}>AI Active</span>
             </div>
          </div>
        </div>

        <div className="p-8">
           <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="space-y-2">
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>State Agency</label>
            <CustomDropdown
              value={filters.stateAgency}
              onChange={(val) => setFilters(prev => ({ ...prev, stateAgency: val }))}
              options={[{ value: 'AB State Agency', label: 'AB State Agency' }]}
              placeholder="All Agencies"
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
              options={[{ value: 'AB District Agency', label: 'AB District Agency' }]}
              placeholder="All Districts"
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
              options={[{ value: '22R', label: '22R' }, { value: '23K', label: '23K' }]}
              placeholder="All Seasons"
              isOpen={seasonDropdownOpen}
              onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
              dropdownRef={seasonRef}
            />
          </div>
          <div className="space-y-2">
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Pack Type</label>
            <CustomDropdown
              value={filters.packType}
              onChange={(val) => setFilters(prev => ({ ...prev, packType: val }))}
              options={[{ value: '35 KG JUTE BAG', label: '35 KG JUTE BAG' }]}
              placeholder="All Types"
              isOpen={packTypeDropdownOpen}
              onToggle={() => setPackTypeDropdownOpen(!packTypeDropdownOpen)}
              dropdownRef={packTypeRef}
            />
          </div>
          <div className="space-y-2">
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Godown</label>
            <CustomDropdown
              value={filters.godown}
              onChange={(val) => setFilters(prev => ({ ...prev, godown: val }))}
              options={[{ value: 'DEF', label: 'DEF' }]}
              placeholder="All Godowns"
              isOpen={godownDropdownOpen}
              onToggle={() => setGodownDropdownOpen(!godownDropdownOpen)}
              dropdownRef={godownRef}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E5EBEF' }}>
          <button
            onClick={handleReset}
            className="px-6 h-11 rounded-lg border text-slate-600 font-bold text-sm transition-all hover:bg-slate-50"
            style={{ borderColor: '#E5EBEF' }}
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            className="px-10 h-11 rounded-lg bg-[#027F83] text-white font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
          >
            {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
            Filter Records
          </button>
        </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-slate-50">
              <List className="w-5 h-5 text-[#027F83]" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>Inventory Details</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Quick search..." 
                  className="h-10 pl-9 pr-4 rounded-lg border outline-none focus:border-[#027F83] text-sm w-64"
                  style={{ borderColor: '#E5EBEF' }}
                />
             </div>
             <button className="p-2.5 rounded-lg border bg-white hover:bg-slate-50 transition-all" style={{ borderColor: '#E5EBEF' }}>
               <MoreVertical className="w-5 h-5 text-slate-500" />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                {['Godown', 'District Agency', 'Season', 'Pack Type', 'Old Bags', 'New Bags', 'One Time Bags', 'Total Bags', 'Ledger'].map((header, i) => (
                  <th key={i} className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
              {inventoryData.map((row, i) => (
                <tr key={i} className="border-t transition-colors hover:bg-gray-50" style={{ borderColor: '#E5EBEF' }}>
                  <td className="px-6 py-4 text-sm font-bold text-[#315B78]">{row.godown}</td>
                  <td className="px-6 py-4 text-sm text-[#315B78] font-medium">{row.districtAgency}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 uppercase">
                      {row.season}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#315B78] font-medium">{row.packType}</td>
                  <td className="px-6 py-4 text-sm text-[#315B78] font-bold">{row.oldBags}</td>
                  <td className="px-6 py-4 text-sm text-[#315B78] font-bold">{row.newBags}</td>
                  <td className="px-6 py-4 text-sm text-[#315B78] font-bold">{row.oneTimeBags}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-base font-black text-[#027F83]">{row.totalBags}</span>
                       <TrendingUp className="w-3 h-3 text-emerald-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 rounded-lg bg-[#027F83]/10 text-[#027F83] hover:bg-[#027F83] hover:text-white transition-all border border-[#027F83]/10">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between text-sm">
           <p className="text-slate-500 font-medium">Showing <span className="text-[#003A5D] font-bold">1-2</span> of 12 godowns</p>
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-400 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 rounded-xl bg-[#027F83] text-white font-bold shadow-md shadow-[#027F83]/20">1</button>
              <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[#003A5D] hover:bg-slate-50 transition-all font-bold">2</button>
              <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-[#003A5D] hover:bg-slate-50 transition-all font-bold">Next</button>
           </div>
        </div>
      </div>

      <div className="mt-8 flex items-start gap-4 p-6 rounded-[2rem] bg-amber-50 border border-amber-100 shadow-sm">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-amber-900/70 text-sm leading-relaxed font-medium">
          Note: This inventory represents physical stock currently held in various godowns across the state. Discrepancies should be reported to the DMO immediately. Manual adjustments require proper authorization.
        </p>
      </div>
    </div>
  );
}
