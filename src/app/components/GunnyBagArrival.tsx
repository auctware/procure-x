import { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Truck, PlusCircle, RotateCcw, 
  Calendar, Layers, MapPin, Building2, Package, 
  CheckCircle2, Info, Calculator, FileText, Search,
  ArrowLeft, List, Activity
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function GunnyBagArrival() {
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('create');
  const [formData, setFormData] = useState({
    dispatchNo: 'GDSGC410230405395191023033',
    dispatchDate: '2023-10-19',
    state: 'MAHARASHTRA',
    districtAgency: 'AB District Agency',
    season: '22R',
    center: 'AB MSP CENTER',
    godown: 'DEF',
    packType: '35 KG JUTE BAG',
    newBags: 0,
    totalNewBags: 0,
    oldBags: 0,
    totalOldBags: 0,
    oneTimeBags: 1,
    totalOneTimeBags: 1,
    arrivalDate: new Date().toISOString().split('T')[0],
    remark: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Procurement</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Gunny Bag Arrival</span>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300" style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', color: '#065F46' }}>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span style={{ fontWeight: '600' }}>Arrival successfully acknowledged and centers inventory updated.</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border" style={{ borderColor: '#E5EBEF' }}>
        {/* Shared Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Truck className="w-5 h-5 text-[#027F83]" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Gunny Bag Arrival
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {activeTab === 'create' ? 'Register new bag arrival against dispatch' : 'View and track bag arrival history'}
              </p>
            </div>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
            <button 
              onClick={() => setActiveTab('view')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === 'view' ? 'bg-[#027F83] text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
            >
              <List className="w-3.5 h-3.5" />
              View Arrival
            </button>
            <button 
              onClick={() => setActiveTab('create')}
              className={`px-4 py-1.5 rounded-md text-[13px] font-bold transition-all flex items-center gap-2 ${activeTab === 'create' ? 'bg-[#027F83] text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Arrival
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' ? (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Row 1 */}
              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Dispatch No <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <input
                    type="text"
                    value={formData.dispatchNo}
                    readOnly
                    className="w-full h-12 pl-4 pr-10 rounded-lg border bg-slate-50 border-slate-200 outline-none text-sm font-bold text-[#315B78]"
                  />
                  <FileText className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                </div>
              </div>

              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Dispatch Date <span className="text-red-500">*</span></label>
                <div className="w-full h-12 px-4 rounded-lg border bg-slate-50 border-slate-200 flex items-center text-sm font-bold text-[#315B78]">
                  {formData.dispatchDate}
                </div>
              </div>

              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>State <span className="text-red-500">*</span></label>
                <div className="w-full h-12 px-4 rounded-lg border bg-slate-50 border-slate-200 flex items-center text-sm font-bold text-[#315B78]">
                  {formData.state}
                </div>
              </div>

              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>District Agency <span className="text-red-500">*</span></label>
                <div className="w-full h-12 px-4 rounded-lg border bg-slate-50 border-slate-200 flex items-center text-sm font-bold text-[#315B78]">
                  {formData.districtAgency}
                </div>
              </div>
            </div>

            {/* Second Row for specific bag verification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
               <div className="p-6 rounded-xl bg-slate-50/50 border" style={{ borderColor: '#E5EBEF' }}>
                  <div className="flex items-center gap-3 mb-6">
                     <Package className="w-5 h-5 text-[#027F83]" />
                     <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#315B78', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity Verification</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Old Bags</label>
                      <input type="number" value={formData.oldBags} onChange={(e) => setFormData(p => ({ ...p, oldBags: parseInt(e.target.value) || 0 }))} className="w-full h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: '#CCD8DF' }} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>New Bags</label>
                      <input type="number" value={formData.newBags} onChange={(e) => setFormData(p => ({ ...p, newBags: parseInt(e.target.value) || 0 }))} className="w-full h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: '#CCD8DF' }} />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>1-Time Bags</label>
                      <input type="number" value={formData.oneTimeBags} onChange={(e) => setFormData(p => ({ ...p, oneTimeBags: parseInt(e.target.value) || 0 }))} className="w-full h-10 px-3 rounded-lg border outline-none text-sm" style={{ borderColor: '#CCD8DF' }} />
                    </div>
                  </div>
               </div>

               <div className="p-6 rounded-xl bg-emerald-50/30 border border-emerald-100/50">
                  <div className="flex items-center gap-3 mb-6">
                     <Calculator className="w-5 h-5 text-emerald-600" />
                     <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Arrival Summary</h4>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Received</p>
                        <p className="text-2xl font-black text-[#027F83]">{formData.oldBags + formData.newBags + formData.oneTimeBags}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Arrival Date</p>
                        <p className="text-sm font-bold text-[#315B78]">{formData.arrivalDate}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5EBEF' }}>
              <button type="button" className="px-8 h-12 rounded-lg border text-slate-600 font-bold text-sm transition-all hover:bg-slate-50" style={{ borderColor: '#E5EBEF' }}>Cancel</button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-10 h-12 rounded-lg bg-[#027F83] text-white font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <SaveIcon className="w-4 h-4" />}
                Confirm Weight & Arrival
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>Recent Arrival History</h3>
               </div>
               <button className="text-xs font-bold text-[#027F83] hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
              <table className="w-full">
                <thead style={{ backgroundColor: '#F7F9FA' }}>
                  <tr>
                    {['Arrival ID', 'Dispatch No', 'Center', 'Date', 'Status'].map((h, i) => (
                      <th key={i} className="px-6 py-4 text-left" style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#315B78]">ARR-00{i}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">GDSGC4102304053...</td>
                      <td className="px-6 py-4 text-sm text-[#315B78]">AB MSP CENTER</td>
                      <td className="px-6 py-4 text-sm text-slate-600">2023-10-19</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 rounded-xl bg-slate-50 border flex items-start gap-4" style={{ borderColor: '#E5EBEF' }}>
        <div className="p-2 rounded-lg bg-[#315B78]/10">
          <Info className="w-5 h-5 text-[#315B78]" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>About Bag Arrival</h4>
          <p className="text-sm text-slate-600 mt-1">Arrival acknowledgment is a critical step in the supply chain. It confirms that the physical quantity matches the dispatched count and updates the center's usable inventory in real-time.</p>
        </div>
      </div>
    </div>
  );
}

function SaveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v13a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
