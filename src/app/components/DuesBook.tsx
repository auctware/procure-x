import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Wallet, Search, Filter, 
  Download, List, Calendar, User, FileText, 
  CheckCircle2, AlertCircle, ArrowUpDown, CreditCard,
  Building2, Layers, Info
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function DuesBook() {
  const [filters, setFilters] = useState({
    toOrderDate: '2021-07-26',
    referenceNo: '',
    status: 'ALL',
    commodity: '',
    season: '',
    duesType: 'ALL',
    accountHead: ''
  });

  const [isSearching, setIsSearching] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [duesTypeDropdownOpen, setDuesTypeDropdownOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const commodityRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const duesTypeRef = useRef<HTMLDivElement>(null);

  const duesData = [
    { id: 'DUES-10245', account: 'FARMER TWO', billNo: 'B-2023-9012', farmName: 'GREEN VALLEY', docNo: 'DOC-4451', amount: 12500, status: 'PENDING', date: '2023-11-15' },
    { id: 'DUES-10246', account: 'MSWC AGENCY', billNo: 'B-2023-9013', farmName: 'RIVER SIDE', docNo: 'DOC-4452', amount: 45000, status: 'APPROVED', date: '2023-11-16' },
    { id: 'DUES-10247', account: 'FARMER ONE', billNo: 'B-2023-9014', farmName: 'SUNRISE AGRO', docNo: 'DOC-4453', amount: 8900, status: 'PENDING', date: '2023-11-16' },
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
        <span style={{ color: '#027F83', fontWeight: '500' }}>Settlement</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Dues Book</span>
      </div>

      {/* Main Single Card Container */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Wallet className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Farmer Dues Book
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Track and manage outstanding payments and settlement dues
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowPayoutModal(true)}
                className="h-10 px-5 rounded-lg bg-[#027F83] text-white font-bold text-xs shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
             >
                <CreditCard className="w-4 h-4" />
                Batch Payout Run
             </button>
             <button className="p-2.5 rounded-lg border bg-white hover:bg-slate-50 transition-all text-slate-500" style={{ borderColor: '#E5EBEF' }}>
                <Download className="w-5 h-5" />
             </button>
          </div>
        </div>
        
        <div className="p-8">
           {/* Filters */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>To Date</label>
                <div className="relative">
                  <input type="date" value={filters.toOrderDate} onChange={(e) => setFilters(p => ({ ...p, toOrderDate: e.target.value }))} className="w-full h-10 px-3 rounded-lg border text-sm font-bold text-[#315B78]" style={{ borderColor: '#E5EBEF' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reference No</label>
                <input type="text" placeholder="REF-..." value={filters.referenceNo} onChange={(e) => setFilters(p => ({ ...p, referenceNo: e.target.value }))} className="w-full h-10 px-3 rounded-lg border text-sm" style={{ borderColor: '#E5EBEF' }} />
              </div>

              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</label>
                <CustomDropdown
                  value={filters.status}
                  onChange={(val) => setFilters(prev => ({ ...prev, status: val }))}
                  options={[
                    { value: 'ALL', label: 'ALL' },
                    { value: 'PENDING', label: 'PENDING' },
                    { value: 'APPROVED', label: 'APPROVED' }
                  ]}
                  placeholder="Select Status"
                  isOpen={statusDropdownOpen}
                  onToggle={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  dropdownRef={statusRef}
                />
              </div>

              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Commodity</label>
                <CustomDropdown
                  value={filters.commodity}
                  onChange={(val) => setFilters(prev => ({ ...prev, commodity: val }))}
                  options={[
                    { value: 'PADDY', label: 'PADDY COMMON' },
                    { value: 'SOYABEAN', label: 'SOYABEAN A' }
                  ]}
                  placeholder="Select Commodity"
                  isOpen={commodityDropdownOpen}
                  onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                  dropdownRef={commodityRef}
                />
              </div>

              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Season</label>
                <CustomDropdown
                  value={filters.season}
                  onChange={(val) => setFilters(prev => ({ ...prev, season: val }))}
                  options={[{ value: '23K', label: '23K' }, { value: '22R', label: '22R' }]}
                  placeholder="Select Season"
                  isOpen={seasonDropdownOpen}
                  onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                  dropdownRef={seasonRef}
                />
              </div>

              <div className="space-y-1.5">
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dues Type</label>
                <CustomDropdown
                  value={filters.duesType}
                  onChange={(val) => setFilters(prev => ({ ...prev, duesType: val }))}
                  options={[{ value: 'ALL', label: 'ALL' }, { value: 'BONUS', label: 'BONUS' }]}
                  placeholder="Select Type"
                  isOpen={duesTypeDropdownOpen}
                  onToggle={() => setDuesTypeDropdownOpen(!duesTypeDropdownOpen)}
                  dropdownRef={duesTypeRef}
                />
              </div>

              <div className="flex items-end">
                <button 
                  onClick={handleSearch}
                  className="w-full h-10 rounded-lg bg-[#315B78] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#25465d] transition-all"
                >
                  {isSearching ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search className="w-3.5 h-3.5" />}
                  Search
                </button>
              </div>
           </div>

           {/* Results Table */}
           <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
              <table className="w-full">
                 <thead style={{ backgroundColor: '#F7F9FA' }}>
                    <tr className="divide-x divide-slate-200" style={{ borderColor: '#E5EBEF' }}>
                       {['Dues ID', 'Account Holder', 'Bill No', 'Farmer Name', 'Doc No', 'Amount (₹)', 'Status', 'Actions'].map((h, i) => (
                         <th key={i} className="px-5 py-4 text-left" style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                           <div className="flex items-center gap-1.5">
                             {h}
                             {i < 7 && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                           </div>
                         </th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                    {duesData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100" style={{ borderColor: '#E5EBEF' }}>
                         <td className="px-5 py-4 text-xs font-bold text-[#027F83]">{row.id}</td>
                         <td className="px-5 py-4 text-sm font-bold text-[#315B78]">{row.account}</td>
                         <td className="px-5 py-4 text-xs font-medium text-slate-500">{row.billNo}</td>
                         <td className="px-5 py-4 text-sm text-[#315B78] font-semibold">{row.farmName}</td>
                         <td className="px-5 py-4 text-xs text-slate-400 font-bold">{row.docNo}</td>
                         <td className="px-5 py-4 text-sm font-black text-[#003A5D]">{row.amount.toLocaleString()}</td>
                         <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                               {row.status}
                            </span>
                         </td>
                         <td className="px-5 py-4">
                            <button className="p-2 rounded-lg bg-white border flex items-center justify-center text-[#315B78] hover:bg-slate-50 transition-all shadow-sm" style={{ borderColor: '#E5EBEF' }}>
                               <List className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Showing 3 entries in current view</p>
              <div className="flex gap-2">
                 <button className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-500" style={{ borderColor: '#E5EBEF' }}>Previous</button>
                 <button className="px-4 py-2 rounded-lg bg-[#315B78] text-white text-xs font-bold">1</button>
                 <button className="px-4 py-2 rounded-lg border text-xs font-bold text-slate-500" style={{ borderColor: '#E5EBEF' }}>Next</button>
              </div>
           </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 rounded-xl bg-slate-50 border flex items-start gap-4" style={{ borderColor: '#E5EBEF' }}>
        <div className="p-2 rounded-lg bg-[#315B78]/10">
          <Info className="w-5 h-5 text-[#315B78]" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>About Dues Book</h4>
          <p className="text-sm text-slate-600 mt-1">The Dues Book provides a centralized view of all procurement-related financial obligations. Approved dues can be included in batch payout runs for bank file generation.</p>
        </div>
      </div>
    </div>
  );
}
