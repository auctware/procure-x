import { useState } from 'react';
import { 
  Home, ChevronRight, Eye, Search, Filter, 
  RotateCcw, Truck, X, Check, CheckCircle2
} from 'lucide-react';

export default function ViewIssue() {
  const [isSearching, setIsSearching] = useState(false);
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [truckFormData, setTruckFormData] = useState({
    state: 'MAHARASHTRA',
    warehouse: 'AB WAREHOUSE',
    issueId: 'WDDH0000000008',
    truckSheetNo: '91111649845275266',
    depositorDetails: 'AB State Agency',
    vehicleType: '',
    driverName: '',
    licenceValidity: '',
    commodity: 'RICE',
    truckSheetDate: '13-Apr-2022',
    depositor: 'G3062',
    issueType: 'M',
    vehicleNo: '',
    licenceNo: '',
    gateExitTime: ''
  });

  const issuesList = [
    { state: 'MH', commodityCode: 'RICE', warehouseName: 'AB WAREHOUSE', purposeCode: 'Milling', totalQty: '1', withdrawalDate: 'Apr 13, 2022' }
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  const handleSubmitTruckSheet = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowTruckModal(false);
    }, 1200);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Transactions</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>View Issue</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-8 py-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-6" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#F0F9FF' }}>
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#003A5D', letterSpacing: '-0.5px' }}>
                View Issue
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Search past withdrawal issues and manage truck sheets
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
           {/* Section 1: Filters */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6 mb-10">
              <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">State</label>
                 <select className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                    <option>MAHARASHTRA</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col pt-6"></div>
              <div className="space-y-1.5 flex flex-col pt-6"></div>

              <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Warehouse</label>
                 <select className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                    <option>AB WAREHOUSE</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Commodity</label>
                 <select className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                    <option>RICE</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col pt-6"></div>

              <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Season Id</label>
                 <select className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                    <option>22R</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col pt-6"></div>
              <div className="space-y-1.5 flex flex-col pt-6"></div>

              <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Client Id</label>
                 <div className="flex gap-2">
                   <input type="text" className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none" />
                   <button className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center">...</button>
                 </div>
              </div>
              <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Issue Type</label>
                 <select className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                    <option>--Select--</option>
                 </select>
              </div>
              
              <div className="flex items-end justify-end gap-3 pt-6">
                 <button 
                  onClick={handleSearch}
                  className="px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-600 transition-all flex items-center gap-2"
                 >
                    {isSearching ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Search'}
                 </button>
                 <button className="px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-600 transition-all">
                    Reset
                 </button>
              </div>
           </div>

           {/* Results Table */}
           <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
              <table className="w-full text-nowrap text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs">
                    <tr>
                       <th className="px-4 py-3 text-left">State</th>
                       <th className="px-4 py-3 text-left">Commodity Code</th>
                       <th className="px-4 py-3 text-left">Warehouse Name</th>
                       <th className="px-4 py-3 text-left">Purpose Code</th>
                       <th className="px-4 py-3 text-left">Total Quantity</th>
                       <th className="px-4 py-3 text-left">Withdrawal Date</th>
                       <th className="px-4 py-3 text-left border-l border-slate-200">Truck Sheet</th>
                       <th className="px-4 py-3 text-left">Auction Date</th>
                       <th className="px-4 py-3 text-left">Auction Number</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-xs">
                    {/* Filter Inputs Row */}
                    <tr className="bg-slate-50/50">
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2 border-l border-slate-200"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                       <td className="p-2"><input type="text" className="w-full h-7 px-2 border rounded" /></td>
                    </tr>
                    
                    {/* Actual Data Row */}
                    {issuesList.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                         <td className="px-4 py-3 text-slate-600">{row.state}</td>
                         <td className="px-4 py-3 text-slate-600">{row.commodityCode}</td>
                         <td className="px-4 py-3 text-slate-600">{row.warehouseName}</td>
                         <td className="px-4 py-3 text-slate-600">{row.purposeCode}</td>
                         <td className="px-4 py-3 text-slate-600">{row.totalQty}</td>
                         <td className="px-4 py-3 text-slate-600">{row.withdrawalDate}</td>
                         <td className="px-4 py-2 border-l border-slate-200">
                            <button 
                              onClick={() => setShowTruckModal(true)}
                              className="px-4 py-1.5 bg-[#02B8C2] text-white font-bold rounded-md hover:bg-[#029FA8] transition-all"
                            >
                               TRUCK SHEET
                            </button>
                         </td>
                         <td className="px-4 py-3 text-slate-400"></td>
                         <td className="px-4 py-3 text-slate-400"></td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Truck Sheet Modal */}
      {showTruckModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col border border-slate-200">
              <div className="px-6 py-5 border-b flex justify-between items-center bg-white">
                 <h3 className="font-black text-[#003A5D]">Truck Sheet</h3>
              </div>
              <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">State <span className="text-red-500">*</span></label>
                          <select className="w-full bg-transparent text-sm font-bold text-slate-500 outline-none appearance-none">
                             <option>{truckFormData.state}</option>
                          </select>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Season Id <span className="text-red-500">*</span></label>
                          <select className="w-full bg-transparent text-sm font-bold text-slate-500 outline-none appearance-none">
                             <option>22R</option>
                          </select>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Issue Id <span className="text-red-500">*</span></label>
                          <div className="px-1 text-sm font-bold text-blue-800">{truckFormData.issueId}</div>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Truck Sheet No <span className="text-red-500">*</span></label>
                          <div className="px-1 text-sm font-bold text-blue-800">{truckFormData.truckSheetNo}</div>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Depositor Details <span className="text-red-500">*</span></label>
                          <div className="px-1 text-sm font-bold text-blue-800">{truckFormData.depositorDetails}</div>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Vehicle Type</label>
                          <input type="text" placeholder="Enter Vehicle Type" className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none px-1" />
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Driver Name <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="Enter Driver Name" className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none px-1" />
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Licence Validity <span className="text-red-500">*</span></label>
                          <input type="date" className="w-full bg-transparent text-sm font-bold text-blue-800 outline-none px-1" />
                       </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Commodity <span className="text-red-500">*</span></label>
                          <select className="w-full bg-transparent text-sm font-bold text-slate-500 outline-none appearance-none">
                             <option>{truckFormData.commodity}</option>
                          </select>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Warehouse <span className="text-red-500">*</span></label>
                          <select className="w-full bg-transparent text-sm font-bold text-slate-500 outline-none appearance-none">
                             <option>{truckFormData.warehouse}</option>
                          </select>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Truck Sheet Date <span className="text-red-500">*</span></label>
                          <input type="date" defaultValue="2022-04-13" className="w-full bg-transparent text-sm font-bold text-blue-800 outline-none px-1" />
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Depositor <span className="text-red-500">*</span></label>
                          <div className="px-1 text-sm font-bold text-blue-800">{truckFormData.depositor}</div>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100 bg-blue-50/50 p-2 rounded -mx-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Issue Type <span className="text-red-500">*</span></label>
                          <div className="px-1 text-sm font-bold text-blue-800">{truckFormData.issueType}</div>
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Vehicle No <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="Enter Vehicle No" className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none px-1" />
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Licence No <span className="text-red-500">*</span></label>
                          <input type="text" placeholder="Enter Licence No" className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none px-1" />
                       </div>
                       <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Gate Exit Time <span className="text-red-500">*</span></label>
                          <input type="datetime-local" className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none px-1" />
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 flex justify-end gap-3">
                    <button 
                      onClick={handleSubmitTruckSheet}
                      className="px-8 h-10 rounded text-white bg-emerald-500 hover:bg-emerald-600 font-bold text-xs shadow flex items-center gap-2"
                    >
                       {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'SUBMIT'}
                    </button>
                    <button className="px-8 h-10 rounded text-white bg-blue-500 hover:bg-blue-600 font-bold text-xs shadow">
                       RESET
                    </button>
                    <button onClick={() => setShowTruckModal(false)} className="px-8 h-10 rounded text-white bg-red-500 hover:bg-red-600 font-bold text-xs shadow">
                       CLOSE
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
