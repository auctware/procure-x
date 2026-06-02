import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Building2, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building, Package, Layers, Info,
  RefreshCcw, Upload, FileText, Send, Save,
  X, Check, ShieldCheck, MapPin, Truck, User, Calendar
} from 'lucide-react';

export default function MillToWarehouseArrival() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    arrivalStatus: 'CMR ARRIVAL',
    stateCode: 'MOCK STATE',
    districtCode: 'Select an Option',
    warehouseCode: 'SMWK - SM MOCK WAREHOUSE',
    depositorStateAgency: 'G4863 - SM MOCK STATE AG',
    depositorDistrictAgency: 'G4864 - SM MOCK DIST AG',
    commodityCode: 'MOCK RICE A',
    seasonId: '22R',
    mill: 'SMMV - SMMV MOCK MILL',
    dumpingGodown: 'SMWK1-SM MOCK GODOWN',
    ldNumber: '',
    truckSheetNumber: 'TCSMWK1712144304426',
    dispatchedBags: '6',
    dispatchedQty: '2.092',
    arrivedNumberBags: '6',
    arrivedQty: '2.092',
    oldBags: '1',
    newBags: '2',
    oneTimeBags: '3',
    truckSheetEntryDate: '2024-04-03',
    vehicleNo: 'GHJG',
    driversName: 'JGHJGH',
    driversLicense: 'GHKG',
    licenseValidity: '2024-03-15',
    vehicleArrivalTime: '2024-04-03 05:08 pm'
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
        <span style={{ fontWeight: '600', color: '#222' }}>Mill to Warehouse Arrival</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-8 py-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-6" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#F0F9FF' }}>
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#003A5D', letterSpacing: '-0.5px' }}>
                Add Mill To Warehouse Arrival
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Acknowledge and record the receipt of milled commodity at the warehouse
              </p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-5 py-2.5 rounded-xl border bg-slate-50 flex flex-col" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction No</span>
                <span className="text-xs font-bold text-[#315B78] uppercase">-</span>
             </div>
             <div className="px-5 py-2.5 rounded-xl border bg-slate-50 flex flex-col" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</span>
                <span className="text-xs font-bold text-[#315B78] uppercase">-</span>
             </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
           {/* Section 1: Core Identification */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Arrival Status</label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.arrivalStatus}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">District Code</label>
                    <select className="h-11 w-full px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                       <option>{formData.districtCode}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Depositor(State Agency) <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.depositorStateAgency}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Commodity Code <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.commodityCode}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Mill <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.mill}</div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">State Code <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.stateCode}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Warehouse Code <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.warehouseCode}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Depositor Detail(District Agency) <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.depositorDistrictAgency}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Season Id <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.seasonId}</div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Dumping Godown <span className="text-red-500">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }}>{formData.dumpingGodown}</div>
                 </div>
              </div>
           </div>

           {/* Section 2: Transit Details (Interactive) */}
           <div className="bg-[#003A5D] rounded-3xl p-8 mb-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest">LD Number</label>
                    <input type="text" defaultValue={formData.ldNumber} placeholder="Enter LD#" className="w-full h-11 px-4 rounded-xl border bg-white/10 text-white font-bold border-white/20 outline-none focus:bg-white/20" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Truck Sheet Number</label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-white/10 flex items-center text-sm font-bold text-emerald-400 border-emerald-400/30 overflow-hidden truncate">
                       {formData.truckSheetNumber}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Dispatched Bags <span className="text-white">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-white/10 flex items-center text-sm font-black text-white border-white/20">{formData.dispatchedBags}</div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Dispatched Qty (QTL) <span className="text-white">*</span></label>
                    <div className="h-11 w-full px-4 rounded-xl border bg-white/10 flex items-center text-sm font-black text-white border-white/20">{formData.dispatchedQty}</div>
                 </div>

                 <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Arrived Number of Bags <span className="text-white">*</span></label>
                    <input type="text" defaultValue={formData.arrivedNumberBags} className="w-full h-11 px-4 rounded-xl border bg-white text-blue-900 font-bold outline-none" />
                 </div>
                 <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest px-1">Arrived Quantity (QTL) <span className="text-white">*</span></label>
                    <input type="text" defaultValue={formData.arrivedQty} className="w-full h-11 px-4 rounded-xl border bg-white text-blue-900 font-bold outline-none" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest">No. Old Bags</label>
                    <input type="text" defaultValue={formData.oldBags} className="w-full h-11 px-4 rounded-xl border bg-white/10 text-white font-bold border-white/10 outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest">No. New Bags</label>
                    <input type="text" defaultValue={formData.newBags} className="w-full h-11 px-4 rounded-xl border bg-white/10 text-white font-bold border-white/10 outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-200 uppercase tracking-widest">No. One Time</label>
                    <input type="text" defaultValue={formData.oneTimeBags} className="w-full h-11 px-4 rounded-xl border bg-white/10 text-white font-bold border-white/10 outline-none" />
                 </div>
                 <div className="pt-6 flex justify-end">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-300">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Vehicle & Driver Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Truck Sheet Entry Date <span className="text-red-500">*</span>
                    </label>
                    <input type="date" defaultValue={formData.truckSheetEntryDate} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <User className="w-3.5 h-3.5" /> Driver's Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" defaultValue={formData.driversName} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <Calendar className="w-3.5 h-3.5" /> License Validity <span className="text-red-500">*</span>
                    </label>
                    <input type="date" defaultValue={formData.licenseValidity} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <Truck className="w-3.5 h-3.5" /> Vehicle No <span className="text-red-500">*</span>
                    </label>
                    <input type="text" defaultValue={formData.vehicleNo} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <FileText className="w-3.5 h-3.5" /> Driver's License Number <span className="text-red-500">*</span>
                    </label>
                    <input type="text" defaultValue={formData.driversLicense} className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Vehicle Arrival Time <span className="text-red-500">*</span>
                    </label>
                    <input type="datetime-local" className="w-full h-11 px-4 rounded-xl border bg-white font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                 </div>
              </div>
           </div>

           {/* Actions Footer */}
           <div className="pt-8 border-t flex items-center justify-end gap-6" style={{ borderColor: '#E5EBEF' }}>
              <button className="px-10 h-12 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all">Clear Form</button>
              <button 
                onClick={handleSubmit}
                className="px-16 h-12 rounded-xl bg-emerald-600 text-white font-black shadow-lg shadow-emerald-600/20 flex items-center gap-3 hover:translate-y-[-2px] transition-all"
              >
                 {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle2 className="w-5 h-5" />}
                 CONFIRM ARRIVAL
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
