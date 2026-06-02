import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Activity, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Package, Layers, Info,
  RefreshCcw, Upload
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function PFMSTracker() {
  const [filters, setFilters] = useState({
    toOrderDate: '2021-08-09',
    status: '--All--',
    searchText: ''
  });

  const [isSearching, setIsSearching] = useState(false);

  const trackerData = [
    { 
      nemlBatchId: 'N012A132135752129', 
      batchId: 'P007709082...', 
      msgId: '0077EATPAY...', 
      totalPayments: 1, 
      totalAmount: 1000, 
      noOfFail: 0, 
      success: 0, 
      failPayments: 0, 
      status: 'UPLOADED',
      processStatus: 'SUCCESS',
      signedBy: 'UATAKSHAY'
    },
    { 
      nemlBatchId: 'N001A128143704503', 
      batchId: 'P007716072...', 
      msgId: '0077EATPAY...', 
      totalPayments: 2, 
      totalAmount: 2800, 
      noOfFail: 0, 
      success: 0, 
      failPayments: 0, 
      status: 'GENERATED',
      processStatus: 'PENDING',
      signedBy: 'UATAKSHAY'
    },
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
        <span style={{ fontWeight: '600', color: '#222' }}>PFMS Tracker</span>
      </div>

      {/* Stats Cards for Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
               <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Batches</p>
               <h3 className="text-2xl font-black text-[#003A5D]">142</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
               <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processed</p>
               <h3 className="text-2xl font-black text-[#003A5D]">₹ 4.2M</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
               <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Sign</p>
               <h3 className="text-2xl font-black text-[#003A5D]">18</h3>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
               <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Failed</p>
               <h3 className="text-2xl font-black text-[#003A5D]">04</h3>
            </div>
         </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Activity className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                PFMS Batch Tracker
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Monitor end-to-end payment batch lifecycle and bank processing status
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="h-10 px-5 rounded-lg border border-[#027F83] text-[#027F83] font-bold text-xs bg-white hover:bg-[#027F83]/5 transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Callback
             </button>
             <button className="h-10 px-5 rounded-lg bg-[#315B78] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
             </button>
          </div>
        </div>
        
        <div className="p-8">
           {/* Filters */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 items-end">
              <div className="space-y-1.5">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>To Order Date</label>
                 <input type="date" value={filters.toOrderDate} className="w-full h-11 px-4 border rounded-xl text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }} />
              </div>
              <div className="space-y-1.5">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Status</label>
                 <select className="w-full h-11 px-4 border rounded-xl bg-white text-sm font-bold text-[#315B78]" style={{ borderColor: '#CCD8DF' }}>
                    <option>--All--</option>
                    <option>UPLOADED</option>
                    <option>GENERATED</option>
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Search Text</label>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Batch or Msg ID..." className="w-full h-11 pl-10 pr-4 border rounded-xl text-sm" style={{ borderColor: '#CCD8DF' }} />
                 </div>
              </div>
              <button 
                onClick={handleSearch}
                className="h-11 rounded-xl bg-[#027F83] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <RefreshCcw className="w-4 h-4" />}
                Refresh Tracker
              </button>
           </div>

           {/* Results Table */}
           <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
              <table className="w-full">
                 <thead style={{ backgroundColor: '#F7F9FA' }}>
                    <tr className="border-b" style={{ borderColor: '#E5EBEF' }}>
                       {['Batch ID', 'Msg ID', 'Count', 'Amount (₹)', 'Success/Fail', 'Status', 'Process', 'Signed By', 'Actions'].map((h, i) => (
                         <th key={i} className="px-5 py-4 text-left whitespace-nowrap" style={{ fontSize: '11px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody className="divide-y" style={{ borderColor: '#E5EBEF' }}>
                    {trackerData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="px-5 py-4 text-xs font-bold text-[#027F83]">{row.batchId}</td>
                         <td className="px-5 py-4">
                            <div className="max-w-[120px] truncate text-xs text-slate-600 font-medium" title={row.msgId}>{row.msgId}</div>
                         </td>
                         <td className="px-5 py-4 text-sm font-bold text-[#315B78]">{row.totalPayments}</td>
                         <td className="px-5 py-4 text-sm font-black text-[#003A5D]">₹{row.totalAmount.toLocaleString()}</td>
                         <td className="px-5 py-4 text-[10px] font-bold">
                            <div className="flex flex-col gap-0.5">
                               <span className="text-emerald-600">{row.success} SUC</span>
                               <span className="text-red-600">{row.noOfFail} ERR</span>
                            </div>
                         </td>
                         <td className="px-5 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${row.status === 'UPLOADED' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                               {row.status}
                            </span>
                         </td>
                         <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                               <div className={`w-1.5 h-1.5 rounded-full ${row.processStatus === 'SUCCESS' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                               <span className="text-[10px] font-black text-slate-500">{row.processStatus}</span>
                            </div>
                         </td>
                         <td className="px-5 py-4 text-xs font-black text-slate-400">{row.signedBy}</td>
                         <td className="px-5 py-4">
                            <button className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-slate-400 hover:text-[#027F83] hover:border-[#027F83] transition-all shadow-sm" style={{ borderColor: '#E5EBEF' }}>
                               <Eye className="w-4 h-4" />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="mt-8 p-6 rounded-2xl bg-[#003A5D] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                       <TrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                       <h4 className="text-lg font-bold">Settlement Efficiency</h4>
                       <p className="text-slate-400 text-xs">Current batch success rate is 98.4% across all nodal banks.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="text-center px-6 border-x border-white/10">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Response</p>
                       <p className="text-xl font-black">2.4 Hrs</p>
                    </div>
                    <div className="text-center px-6">
                       <p className="text-[10px] font-bold text-slate-400 uppercase">Uptime</p>
                       <p className="text-xl font-black text-emerald-400">99.9%</p>
                    </div>
                 </div>
                 <button className="px-8 h-12 rounded-xl bg-white text-[#003A5D] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                    View Live Node Status
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
