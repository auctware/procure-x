import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, FileCheck, Search, Filter, 
  Download, List, Calendar, User, FileText, 
  CheckCircle2, AlertCircle, ArrowUpDown, Truck,
  Building2, Layers, Info, Trash2, Save, X, Plus,
  Package, LayoutGrid, Clock, ClipboardList, RefreshCcw
} from 'lucide-react';

export default function CMROGeneration() {
  const [activeTab, setActiveTab] = useState('New CMRO');
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    state: 'MOCK STATE',
    mill: 'SMMB - SMMB MILLER MOCK...',
    commodity: 'MOCK RICE A',
    seasonId: '22R',
    stateAgency: 'G4863 - SM MOCK STATE AG',
    districtAgency: 'G4864 - SM MOCK DIST AG',
    warehouse: 'MCK - MOCK WAREHOUSE SM...',
    validityDate: '2024-04-20',
    finalDOQty: '24.000',
    paddyQtyAvailable: '24.000',
    cmroQty: '16.080',
    doNumber: 'ROW6103042404041848',
    oldBags: '10',
    newBags: '2',
    oneTimeBags: '0',
    remarks: 'OK',
    godownDetails: 'ABC Godown'
  });

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>CMRO Generation</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <FileCheck className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Custom Mill RO (CMRO)
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Generate and manage Custom Milled Rice delivery orders
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
            {['View CMRO', 'New CMRO', 'View CMRO Request'].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
             {/* Left Column */}
             <div className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">State <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.state}</div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Commodity <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.commodity}</div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">State Agency <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.stateAgency}</div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Warehouse <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.warehouse}</div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Final DO Quantity <span className="text-red-500">*</span></label>
                      <div className="h-11 w-full px-4 rounded-xl border bg-[#F0F9FF] flex items-center text-sm font-black text-blue-700" style={{ borderColor: '#BAE6FD' }}>{formData.finalDOQty}</div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CMRO Quantity <span className="text-red-500">*</span></label>
                      <div className="h-11 w-full px-4 rounded-xl border bg-[#F0F9FF] flex items-center text-sm font-black text-blue-700" style={{ borderColor: '#BAE6FD' }}>{formData.cmroQty}</div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Old Bags</label>
                      <input type="text" defaultValue={formData.oldBags} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">New Bags</label>
                      <input type="text" defaultValue={formData.newBags} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">One Time</label>
                      <input type="text" defaultValue={formData.oneTimeBags} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                   </div>
                </div>
             </div>

             {/* Right Column */}
             <div className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Mill <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.mill}</div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Season ID <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.seasonId}</div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">District Agency <span className="text-red-500">*</span></label>
                   <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.districtAgency}</div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Validity Date <span className="text-red-500">*</span></label>
                   <input type="date" defaultValue={formData.validityDate} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                </div>

                <div className="pt-4 grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Paddy Qty Available <span className="text-red-500">*</span></label>
                      <div className="h-11 w-full px-4 rounded-xl border bg-[#F0F9FF] flex items-center text-sm font-black text-blue-700" style={{ borderColor: '#BAE6FD' }}>{formData.paddyQtyAvailable}</div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">DO Number <span className="text-red-500">*</span></label>
                      <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.doNumber}</div>
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Remarks <span className="text-red-500">*</span></label>
                   <input type="text" defaultValue={formData.remarks} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">Godown Details <span className="text-red-500">*</span></label>
                   <input type="text" defaultValue={formData.godownDetails} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] text-sm" style={{ borderColor: '#E2E8F0' }} />
                </div>
             </div>
          </div>

          {/* Footer Area */}
          <div className="mt-12 pt-8 border-t flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
             <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 max-w-lg">
                <Info className="w-5 h-5 text-[#027F83] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                   <strong>Verification Rule:</strong> CMRO quantity must not exceed the available paddy equivalent quantity. Ensure the grain quality assay is uploaded before final submission.
                </p>
             </div>
             <div className="flex gap-4">
                <button className="px-8 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all border border-transparent">Back</button>
                <button className="px-12 h-12 rounded-xl bg-[#027F83] text-white font-black shadow-lg shadow-[#027F83]/20 flex items-center gap-2 hover:translate-y-[-2px] transition-all">
                   <Save className="w-5 h-5" />
                   Save CMRO
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
