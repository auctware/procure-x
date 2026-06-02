import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, CreditCard, Search, Download, 
  PlusCircle, FileText, CheckCircle2, Info, Building2,
  Calendar, Upload, Smartphone, ShieldCheck, X,
  Save, AlertCircle, ArrowLeft, MoreHorizontal,
  Lock, Key, FilePlus
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function PaymentFileDetailsPFMS() {
  const [activeView, setActiveView] = useState<'list' | 'generate' | 'upload'>('list');
  const [showSigningTool, setShowSigningTool] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    dateSearchBy: 'Created Date',
    toDate: '2021-08-09',
    searchField: '--All--',
    searchText: '',
    accountCode: '',
    bankName: '',
    status: '--All--',
    commodity: 'SOYABEAN A',
    season: '21R'
  });

  const [sanctionData, setSanctionData] = useState({
    sanctionDate: '2021-08-08',
    sanctionNo: 'OK'
  });

  // Table Data
  const paymentRecords = [
    { seqno: 'AM13213543856511', farmerId: 'WF192050904', refNo: '908210137220011', status: 'File Not Generated', commodity: 'SOYABEAN A', account: '', beneficiary: 'FARMER TWO', billNo: 'H14', lotId: 'M13310-1A', season: '21R' },
    { seqno: 'AM13011232773401', farmerId: 'WF192051023', refNo: '1707211237310009', status: 'File Not Generated', commodity: 'SOYABEAN A', account: '', beneficiary: 'FARMER SEVEN', billNo: 'L41', lotId: 'S12910-3A', season: '21R' },
    { seqno: 'AF12812445980009', farmerId: 'WF192050904', refNo: '1307210205310009', status: 'PFMS Generated', commodity: 'SOYABEAN A', account: 'PFMS123456', beneficiary: 'FARMER TWO', billNo: 'P15', lotId: 'T12910-5A', season: '21R' },
  ];

  const handleGenerate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSigningTool(true);
    }, 1200);
  };

  const handleFinalSign = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSigningTool(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Funds Operation</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Payment File Details (PFMS)</span>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300" style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', color: '#065F46' }}>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span style={{ fontWeight: '600' }}>Payment file generated and digitally signed successfully. Notification sent to banks.</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Building2 className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                PFMS Payment Management
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Generate, sign and upload bank payment files for PFMS settlement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex bg-slate-100 p-1 rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
                <button onClick={() => setActiveView('list')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeView === 'list' ? 'bg-white text-[#027F83] shadow-sm' : 'text-slate-500'}`}>Records</button>
                <button onClick={() => setActiveView('generate')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeView === 'generate' ? 'bg-white text-[#027F83] shadow-sm' : 'text-slate-500'}`}>Generate File</button>
                <button onClick={() => setActiveView('upload')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeView === 'upload' ? 'bg-white text-[#027F83] shadow-sm' : 'text-slate-500'}`}>Upload Responses</button>
             </div>
          </div>
        </div>
        
        <div className="p-8">
           {/* Filters */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 p-6 rounded-xl bg-slate-50/50 border border-slate-100">
              <div className="space-y-1.5 cursor-pointer">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Date By</label>
                 <select className="w-full h-10 px-3 bg-white border rounded-lg text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>Created Date</option>
                    <option>Order Date</option>
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>To Date</label>
                 <input type="date" value={filters.toDate} className="w-full h-10 px-3 border rounded-lg text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }} />
              </div>
              <div className="space-y-1.5">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Commodity</label>
                 <select className="w-full h-10 px-3 bg-white border rounded-lg text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>SOYABEAN A</option>
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Season</label>
                 <select className="w-full h-10 px-3 bg-white border rounded-lg text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>21R</option>
                 </select>
              </div>
              <div className="flex items-end">
                 <button className="w-full h-10 rounded-lg bg-[#315B78] text-white font-bold text-xs flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" />
                    Apply Filters
                 </button>
              </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
              <table className="w-full border-collapse">
                 <thead style={{ backgroundColor: '#F7F9FA' }}>
                    <tr className="border-b" style={{ borderColor: '#E5EBEF' }}>
                       <th className="px-4 py-4"><input type="checkbox" className="w-4 h-4 accent-[#027F83]" /></th>
                       {['Seqno', 'Farmer ID', 'Book Ref', 'Status', 'Commodity', 'Beneficiary', 'Bill No', 'Lot ID'].map((h, i) => (
                         <th key={i} className="px-4 py-4 text-left whitespace-nowrap" style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                    {paymentRecords.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-4 text-center"><input type="checkbox" className="w-4 h-4 accent-[#027F83]" /></td>
                         <td className="px-4 py-4 text-xs font-bold text-[#027F83]">{row.seqno}</td>
                         <td className="px-4 py-4 text-sm font-bold text-[#315B78]">{row.farmerId}</td>
                         <td className="px-4 py-4 text-xs text-blue-600 underline cursor-pointer">{row.refNo}</td>
                         <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${row.status.includes('Not') ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600'}`}>
                               {row.status}
                            </span>
                         </td>
                         <td className="px-4 py-4 text-xs text-slate-600">{row.commodity}</td>
                         <td className="px-4 py-4 text-sm font-bold text-[#315B78]">{row.beneficiary}</td>
                         <td className="px-4 py-4 text-xs font-medium text-slate-400">{row.billNo}</td>
                         <td className="px-4 py-4 text-xs font-bold text-[#315B78]">{row.lotId}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Bulk Actions */}
           <div className="mt-8 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-3">
                 <button 
                  onClick={() => setActiveView('generate')}
                  className="px-6 h-11 rounded-xl bg-[#027F83] text-white font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-95 transition-all"
                >
                    <FilePlus className="w-4 h-4" />
                    Generate Bank File
                 </button>
                 <button className="px-6 h-11 rounded-xl border border-[#027F83] text-[#027F83] font-bold text-sm bg-white hover:bg-[#027F83]/5 transition-all flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Bank File
                 </button>
                 <button className="px-6 h-11 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm bg-white hover:bg-slate-50 transition-all">
                    Update Beneficiary Details
                 </button>
              </div>
              <button className="px-6 h-11 rounded-xl border border-dashed border-slate-300 text-slate-400 font-bold text-sm hover:border-[#027F83] hover:text-[#027F83] transition-all">
                 Export Selection to Excel
              </button>
           </div>
        </div>
      </div>

      {/* Generation Overlay / Modal */}
      {activeView === 'generate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
              <div className="p-6 bg-[#003A5D] text-white flex justify-between items-center">
                 <h3 className="font-bold text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    Payment File Generation
                 </h3>
                 <button onClick={() => setActiveView('list')} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sanction Date <span className="text-red-500">*</span></label>
                    <input type="date" value={sanctionData.sanctionDate} className="w-full h-12 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78]" style={{ borderColor: '#E2E8F0' }} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Sanction Number / Remarks <span className="text-red-500">*</span></label>
                    <textarea value={sanctionData.sanctionNo} className="w-full p-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] min-h-[100px]" style={{ borderColor: '#E2E8F0' }}></textarea>
                 </div>
                 <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                    <p className="text-xs text-orange-800 leading-relaxed font-medium">
                       You are trying to generate 1 file against Bank Account: <strong>PFMS123456</strong>. Proceeding will trigger the digital signing sequence.
                    </p>
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button onClick={() => setActiveView('list')} className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all">Cancel</button>
                    <button onClick={handleGenerate} className="flex-1 h-12 rounded-xl bg-[#027F83] text-white font-black shadow-lg shadow-[#027F83]/20 flex items-center justify-center gap-2">
                       {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
                       Proceed to Sign
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Signing Tool Modal (The "Maker" signing tool from screenshot) */}
      {showSigningTool && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl border-[6px] border-[#315B78]/20 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#315B78]" />
                    <span className="font-black text-[#315B78] text-sm italic tracking-tight">MSP Digital Signing Tool V1.0.0</span>
                 </div>
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    <button onClick={() => setShowSigningTool(false)} className="w-4 h-4 rounded-full bg-red-400 ml-1"></button>
                 </div>
              </div>
              <div className="p-8 bg-[#F8FAFC]">
                 <div className="flex justify-center mb-8">
                    <div className="px-6 py-3 rounded-lg border-2 border-[#027F83]/30 bg-white flex items-center gap-4">
                       <Building2 className="w-8 h-8 text-[#027F83]" />
                       <div className="leading-tight">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Issuing Authority</p>
                          <p className="text-xs font-black text-[#315B78]">MAHARASHTRA GOVT - MSP DEPT</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex gap-4 items-end">
                       <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Selected Payment File</label>
                          <input type="text" readOnly value="0077EATPAYREQ0908202141.xml" className="w-full h-11 px-4 rounded-lg border bg-white text-xs font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }} />
                       </div>
                       <button className="h-11 px-6 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition-all border border-slate-300">Select File</button>
                    </div>

                    <div className="flex gap-4 items-end">
                       <div className="flex-1 space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Security Certificate (DSC)</label>
                          <input type="text" readOnly value="CN=AKSHAY, OU=MSP, O=GOVT OF MH" className="w-full h-11 px-4 rounded-lg border bg-emerald-50 text-xs font-bold text-emerald-700" style={{ borderColor: '#10B981' }} />
                       </div>
                       <button className="h-11 px-6 rounded-lg bg-[#003A5D] text-white font-bold text-xs hover:opacity-90 transition-all shadow-md">Select DSC</button>
                    </div>

                    <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center gap-4">
                       <ShieldCheck className="w-8 h-8 text-indigo-500" />
                       <div>
                          <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Level 1 Verification Active</p>
                          <p className="text-[11px] font-medium text-indigo-900 italic">Maker authorization required for file batch #PFMS-G3062</p>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                        onClick={handleFinalSign}
                        disabled={isLoading}
                        className="flex-1 h-12 rounded-xl bg-[#027F83] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-[#027F83]/20 flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all"
                       >
                          {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Lock className="w-4 h-4" />}
                          Sign Payment File
                       </button>
                       <button onClick={() => setShowSigningTool(false)} className="flex-1 h-12 rounded-xl bg-white border-2 border-[#CCD8DF] text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Sign DSC File Only</button>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t flex items-center justify-between border-slate-200">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[9px] font-black text-emerald-700 uppercase tracking-tighter">Signer Service Connected</span>
                    </div>
                    <button className="text-[10px] font-bold text-[#027F83] hover:underline" onClick={() => setShowSigningTool(false).then(() => handleReset())}>Reset Tool State</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
