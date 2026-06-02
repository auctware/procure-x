import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Microscope, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Package, Layers, Info,
  RefreshCcw, Upload, FileText, Send, Save,
  X, Check, ShieldCheck, MapPin, Truck, Smartphone
} from 'lucide-react';

export default function WHArrivalAssaying() {
  const [lotStatus, setLotStatus] = useState('Accepted');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    stateAgency: 'G4863-SM MOCK STATE AG',
    districtAgency: 'G4864-SM MOCK DIST AG',
    millCodeName: 'SMML-SM MOCK MILL',
    millLocation: 'SM MOCK ADDRESS, MOCK CITY',
    millerMobile: '7855555555',
    dumpingSerial: 'fhfhfd',
    whCodeName: 'SMWK-SM MOCK WAREHOUSE',
    whLocation: 'MOCK',
    commodity: 'MOCK RICE A',
    season: '22R',
    ldNo: 'GHSFDHFD',
    arrivalId: 'DMWARR0000124497',
    foreignMatter: '',
    damagedGrains: '',
    otherFoodGrains: ''
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Warehouse Arrival Assaying</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E0F2FE' }}>
              <Microscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                WH Arrival Assaying Parameters
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Enter quality assay results for the incoming milled commodity batch
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 ${lotStatus === 'Accepted' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${lotStatus === 'Accepted' ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`}></div>
                Lot Status: {lotStatus}
             </div>
          </div>
        </div>

        <div className="p-8">
           {/* Info Display Block */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 mb-12 p-8 rounded-2xl bg-slate-50 border border-slate-100">
              {[
                { label: 'State Agency', value: formData.stateAgency },
                { label: 'District Agency', value: formData.districtAgency },
                { label: 'Mill Code-Name', value: formData.millCodeName },
                { label: 'Mill Location', value: formData.millLocation },
                { label: 'Miller Mobile No', value: formData.millerMobile },
                { label: 'Dumping Serial', value: formData.dumpingSerial },
                { label: 'WH Code-Name', value: formData.whCodeName },
                { label: 'WH Location', value: formData.whLocation },
                { label: 'Commodity', value: formData.commodity },
                { label: 'Season', value: formData.season },
                { label: 'LD No', value: formData.ldNo, hl: true },
                { label: 'Arrival ID', value: formData.arrivalId, hl: true },
              ].map((field, i) => (
                <div key={i} className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{field.label}</span>
                   <span className={`text-[13px] font-black ${field.hl ? 'text-blue-600' : 'text-[#315B78] uppercase'}`}>{field.value}</span>
                </div>
              ))}
           </div>

           {/* Input Parameters Section */}
           <div className="max-w-xl mx-auto space-y-8 py-4">
              <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                    Lot Acceptance Status <span className="text-red-500 font-normal">*</span>
                 </label>
                 <select 
                  className="w-full h-12 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78] focus:border-blue-400 outline-none transition-all shadow-sm"
                  style={{ borderColor: '#E2E8F0' }}
                  value={lotStatus}
                  onChange={(e) => setLotStatus(e.target.value)}
                 >
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Partially Accepted">Partially Accepted</option>
                 </select>
              </div>

              {[
                { label: 'Foreign Matter (%)', name: 'foreignMatter', icon: AlertCircle },
                { label: 'Damaged Grains (%)', name: 'damagedGrains', icon: AlertCircle },
                { label: 'Other Food Grains (%)', name: 'otherFoodGrains', icon: AlertCircle },
              ].map((inp, i) => (
                <div key={i} className="space-y-2">
                   <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <inp.icon className="w-3.5 h-3.5 text-slate-400" />
                      {inp.label} <span className="text-red-500 font-normal">*</span>
                   </label>
                   <input type="text" placeholder="0.00" className="w-full h-12 px-4 rounded-xl border bg-white text-sm font-black text-[#003A5D] focus:border-blue-400 outline-none transition-all shadow-sm" style={{ borderColor: '#E2E8F0' }} />
                </div>
              ))}

              <div className="mt-12 flex gap-4 pt-8">
                 <button className="flex-1 h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-500 font-black tracking-widest text-xs hover:bg-slate-50 transition-all uppercase">Back</button>
                 <button 
                  onClick={handleSave}
                  className="flex-[2] h-14 rounded-2xl bg-blue-600 text-white font-black tracking-widest text-xs shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 uppercase"
                 >
                    {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
                    Save Assaying Result
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
