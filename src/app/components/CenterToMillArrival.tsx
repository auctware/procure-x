import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Building2, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building, Package, Layers, Info, Calendar,
  RefreshCcw, Upload, FileText, Send, Save,
  X, Check, ShieldCheck, MapPin, Truck
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function CenterToMillArrival() {
  const [arrivalType, setArrivalType] = useState('bg'); // 'advance' or 'bg'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    dispatchId: 'RDW610304240404072649',
    challanNo: '',
    vehicleNo: 'MH29AB4563',
    stateCode: 'MOCK STATE',
    seasonId: '22R',
    millCode: 'SMMB - SMMB MILLER MOCK ...',
    commodityCode: 'MOCK PADDY A',
    stateAgency: 'G4863',
    sourceCenter: 'SMMK - SM MOCK MARKET',
    oldBags: '2',
    newBags: '5',
    oneTimeBags: '5',
    totalAcceptedBags: '12',
    arrivalDate: '2024-04-03',
    arrivalQty: '24',
    acceptedQty: '24',
    noOfBags: '12'
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1200);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Center to Mill Arrival</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-8 py-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-6" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E0F2FE' }}>
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#003A5D', letterSpacing: '-0.5px' }}>
                Add Mill Arrival Details
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Acknowledge receipt of raw materials at the processing unit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 rounded-xl bg-slate-50 border flex items-center gap-2" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID:</span>
                <span className="text-xs font-bold text-[#315B78]">ARR-AUTO-2024</span>
             </div>
          </div>
        </div>
        
        <div className="p-8 lg:p-12">
           {/* Form Section */}
           <div className="max-w-6xl mx-auto space-y-12">
              
              {/* Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pb-8 border-b border-slate-100">
                 <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#315B78]">Arrival Classification</h4>
                    <p className="text-xs text-slate-400">Select the type of arrival based on CMR or Guarantees</p>
                 </div>
                 <div className="md:col-span-2 flex gap-4">
                    <button 
                      onClick={() => setArrivalType('advance')}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${arrivalType === 'advance' ? 'border-[#027F83] bg-[#E6F7F7]/50' : 'border-slate-100 bg-white opacity-60'}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${arrivalType === 'advance' ? 'border-[#027F83]' : 'border-slate-300'}`}>
                          {arrivalType === 'advance' && <div className="w-2.5 h-2.5 rounded-full bg-[#027F83]"></div>}
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black text-[#315B78] uppercase">Advance CMR</p>
                          <p className="text-[10px] text-slate-500">Arrival against advance CMR</p>
                       </div>
                    </button>
                    <button 
                      onClick={() => setArrivalType('bg')}
                      className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${arrivalType === 'bg' ? 'border-[#027F83] bg-[#E6F7F7]/50' : 'border-slate-100 bg-white opacity-60'}`}
                    >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${arrivalType === 'bg' ? 'border-[#027F83]' : 'border-slate-300'}`}>
                          {arrivalType === 'bg' && <div className="w-2.5 h-2.5 rounded-full bg-[#027F83]"></div>}
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black text-[#315B78] uppercase">Bank Guarantee (BG)</p>
                          <p className="text-[10px] text-slate-500">Arrival against security deposit</p>
                       </div>
                    </button>
                 </div>
              </div>

              {/* Main Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" /> Dispatch ID <span className="text-red-500">*</span>
                       </label>
                       <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78] border-[#E2E8F0]">
                          {formData.dispatchId}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" /> Arrival Challan No
                       </label>
                       <input type="text" placeholder="Enter Reference No." className="w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78] outline-none focus:border-[#027F83] transition-all" style={{ borderColor: '#E2E8F0' }} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Truck className="w-3.5 h-3.5" /> Vehicle Number
                       </label>
                       <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78] border-[#E2E8F0]">
                          {formData.vehicleNo}
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">State Code</label>
                          <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-xs font-bold text-[#315B78] border-[#E2E8F0]">{formData.stateCode}</div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Season</label>
                          <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-xs font-bold text-[#315B78] border-[#E2E8F0]">{formData.seasonId}</div>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Building className="w-3.5 h-3.5" /> Mill Unit
                       </label>
                       <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78] border-[#E2E8F0] overflow-hidden truncate">
                          {formData.millCode}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" /> Commodity
                       </label>
                       <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78] border-[#E2E8F0]">
                          {formData.commodityCode}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> Source Center
                       </label>
                       <div className="h-12 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78] border-[#E2E8F0] overflow-hidden truncate">
                          {formData.sourceCenter}
                       </div>
                    </div>
                    
                    {/* Bag Counts Grid */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-4">
                       <div className="text-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Old Bags</p>
                          <p className="text-lg font-black text-[#315B78]">{formData.oldBags}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">New Bags</p>
                          <p className="text-lg font-black text-emerald-600">{formData.newBags}</p>
                       </div>
                       <div className="text-center">
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">One Time</p>
                          <p className="text-lg font-black text-blue-600">{formData.oneTimeBags}</p>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" /> Arrival Date <span className="text-red-500">*</span>
                       </label>
                       <input type="date" defaultValue={formData.arrivalDate} className="w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Arrival Qty</label>
                          <input type="text" className="h-12 w-full px-4 rounded-xl border bg-white text-sm font-black text-[#003A5D] border-[#E2E8F0]" defaultValue={formData.arrivalQty} />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Accepted Qty</label>
                          <input type="text" className="h-12 w-full px-4 rounded-xl border bg-emerald-50 text-sm font-black text-emerald-700 border-emerald-100" defaultValue={formData.acceptedQty} />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Verified Panel */}
              <div className="p-8 rounded-2xl bg-[#003A5D] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                       <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold">Verification Acknowledgment</h4>
                       <p className="text-xs text-slate-300 max-w-sm">By clicking submit, you confirm that the raw material quantity and quality matches the dispatch records.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 relative z-10 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-8 h-12 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all">Back</button>
                    <button 
                      onClick={handleSubmit}
                      className="flex-1 md:flex-none px-12 h-12 rounded-xl bg-emerald-500 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                       {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Check className="w-4 h-4" />}
                       Submit Arrival
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
