import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, FilePlus, Search, Filter, 
  Download, List, Calendar, User, FileText, 
  CheckCircle2, AlertCircle, ArrowUpDown, Truck,
  Building2, Layers, Info, Trash2, Save, X, Plus,
  Package, LayoutGrid, Clock, ClipboardList, RefreshCcw
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function DOGeneration() {
  const [activeTab, setActiveTab] = useState('New PDO');
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    state: 'MOCK STATE',
    center: 'SMMK - SM MOCK MARKET',
    stateAgency: 'SM MOCK STATE AG (G4863)',
    districtAgency: 'SM MOCK DIST AG (G4864)',
    seasonId: '22R',
    commodity: 'MOCK PADDY A',
    availableQty: '123.057',
    packType: '50 KG JUTE BAG',
    quantity: '32.000',
    totalNewBags: '1',
    totalOldBags: '5',
    totalOneTimeBags: '10',
    noOfBags: '16',
    liftPeriodValidity: '2024-04-10',
    millWarehouse: 'SMMB - SMMB MILLER MOCK PRI...',
    millAddress: 'GHF, MOCK LOCATION',
    remarks: ''
  });

  const godownDetails = [
    { code: 'SMMK07', name: 'JGHVBN NH', available: 18.887, qty: 2, oldBags: 0, availableOld: 2011, newBags: 1, availableNew: 106, oneTime: 0, availableOneTime: 307 },
    { code: 'SMMK10', name: 'MOCK GODO...', available: 16.114, qty: 10, oldBags: 5, availableOld: 122, newBags: 0, availableNew: 233, oneTime: 0, availableOneTime: 43 },
    { code: 'SMMK12', name: 'GODOWN GO...', available: 23.034, qty: 20, oldBags: 0, availableOld: 21, newBags: 0, availableNew: 42, oneTime: 10, availableOneTime: 0 },
    { code: 'SMMK13', name: 'TEST ONE', available: 14.124, qty: 0, oldBags: 0, availableOld: 25, newBags: 0, availableNew: 6, oneTime: 0, availableOneTime: 7 },
  ];

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Delivery Order (DO) Generation</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <FilePlus className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Delivery Order Generation
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Issue delivery orders and allocate godown-wise inventory for mill dispatch
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
            {['View PDO', 'New PDO', 'Advance LD', 'DO Request'].map((tab) => (
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
          {/* New PDO Form Portion */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
             {[
               { label: 'State', value: formData.state, required: true },
               { label: 'Center', value: formData.center, required: true },
               { label: 'State Agency', value: formData.stateAgency, required: true },
               { label: 'District Agency', value: formData.districtAgency, required: true },
               { label: 'Season ID', value: formData.seasonId, required: true },
               { label: 'Commodity', value: formData.commodity, required: true },
               { label: 'Pack Type', value: formData.packType, required: true },
               { label: 'Validity Period', value: formData.liftPeriodValidity, type: 'date', required: true }
             ].map((field, i) => (
               <div key={i} className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'date' ? (
                    <input type="date" defaultValue={field.value} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                  ) : (
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>
                      {field.value}
                    </div>
                  )}
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10 p-6 rounded-2xl bg-[#F0F9FF]/50 border border-blue-100">
             {[
               { label: 'Available Qty', value: formData.availableQty, icon: Package },
               { label: 'DO Quantity', value: formData.quantity, icon: ClipboardList, color: 'text-blue-600' },
               { label: 'Total Bags', value: formData.noOfBags, icon: Layers },
               { label: 'New Bags', value: formData.totalNewBags, icon: Plus },
               { label: 'Old Bags', value: formData.totalOldBags, icon: RefreshCcw },
               { label: 'One Time Used', value: formData.totalOneTimeBags, icon: Clock },
             ].map((stat, i) => (
               <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1.5">
                    <stat.icon className="w-3 h-3" />
                    {stat.label}
                  </p>
                  <p className={`text-lg font-black ${stat.color || 'text-[#003A5D]'}`}>{stat.value}</p>
               </div>
             ))}
          </div>

          {/* Godown Table Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#315B78] flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-[#027F83] rounded-full"></div>
                   Godown wise Quantity Details
                </h3>
                <button className="text-xs font-bold text-[#027F83] hover:underline">Auto-allocate Inventory</button>
             </div>
             
             <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
                <table className="w-full text-nowrap">
                   <thead style={{ backgroundColor: '#F7F9FA' }}>
                      <tr className="divide-x divide-slate-100">
                         {['Godown', 'Available', 'Qty to DO', 'Old Bag', 'Avail. Old', 'New Bag', 'Avail. New', 'One Time', 'Avail. One'].map((h, i) => (
                           <th key={i} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">{h}</th>
                         ))}
                      </tr>
                   </thead>
                   <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                      {godownDetails.map((row, i) => (
                        <tr key={i} className="divide-x divide-slate-50 hover:bg-slate-50 transition-colors">
                           <td className="px-4 py-3">
                              <div className="flex flex-col">
                                 <span className="text-sm font-bold text-[#315B78]">{row.code}</span>
                                 <span className="text-[10px] text-slate-400 font-bold">{row.name}</span>
                              </div>
                           </td>
                           <td className="px-4 py-3 text-sm font-bold text-slate-600">{row.available}</td>
                           <td className="px-4 py-3">
                              <input type="text" className="w-20 h-9 px-2 rounded-lg border bg-white focus:border-[#027F83] outline-none text-sm font-bold" defaultValue={row.qty} />
                           </td>
                           <td className="px-4 py-3">
                              <input type="text" className="w-16 h-9 px-2 rounded-lg border bg-white focus:border-[#027F83] outline-none text-sm font-bold" defaultValue={row.oldBags} />
                           </td>
                           <td className="px-4 py-3 text-xs font-bold text-slate-400">{row.availableOld}</td>
                           <td className="px-4 py-3">
                              <input type="text" className="w-16 h-9 px-2 rounded-lg border bg-white focus:border-[#027F83] outline-none text-sm font-bold" defaultValue={row.newBags} />
                           </td>
                           <td className="px-4 py-3 text-xs font-bold text-slate-400">{row.availableNew}</td>
                           <td className="px-4 py-3">
                              <input type="text" className="w-16 h-9 px-2 rounded-lg border bg-white focus:border-[#027F83] outline-none text-sm font-bold" defaultValue={row.oneTime} />
                           </td>
                           <td className="px-4 py-3 text-xs font-bold text-slate-400">{row.availableOneTime}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Footer Details */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t" style={{ borderColor: '#E5EBEF' }}>
             <div className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase">Mill / Warehouse <span className="text-red-500">*</span></label>
                   <select className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }}>
                      <option>{formData.millWarehouse}</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase">Mill Address</label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-medium text-slate-500" style={{ borderColor: '#E2E8F0' }}>
                      {formData.millAddress}
                   </div>
                </div>
             </div>
             <div className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase">Remarks</label>
                   <textarea placeholder="Enter remarks if any..." className="w-full p-4 min-h-[100px] rounded-xl border bg-white text-sm outline-none focus:border-[#027F83]" style={{ borderColor: '#E2E8F0' }}></textarea>
                </div>
                <div className="flex gap-4 justify-end">
                   <button className="px-8 h-12 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all">Cancel</button>
                   <button className="px-12 h-12 rounded-xl bg-[#027F83] text-white font-black shadow-lg shadow-[#027F83]/20 flex items-center gap-2 hover:translate-y-[-2px] transition-all">
                      <Save className="w-5 h-5" />
                      Generate DO
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
