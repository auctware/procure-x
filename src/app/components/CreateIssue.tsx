import { useState } from 'react';
import { 
  Home, ChevronRight, Share, CheckCircle2, 
  Upload, Search, FileSignature, Save, Plus, X
} from 'lucide-react';

export default function CreateIssue() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    state: 'MAHARASHTRA',
    warehouse: '9111-AB WAREHOUSE',
    stackSelection: '911111-1',
    uom: 'MT',
    withdrawalType: 'Free',
    clientAvailableInventory: '10',
    withdrawerId: 'G3062',
    totalWithdrawalQuantity: '1.000',
    withdrawalDate: '13-Apr-2022',
    seasonId: '22R',
    godown: '911111-NAGPUR GODOWN',
    commodity: 'RICE',
    clientId: 'G3062',
    issueType: 'FPS',
    totalBags: '10'
  });

  const [issueRecords, setIssueRecords] = useState([
    { id: '1', whrLotNo: '91111649841181571', packType: '50 KG JUTE BAG', refAvailableEnv: '10', bags: '10', qty: '1', vehicleNo: 'MH54TR52525', receiptNo: '2022' }
  ]);

  const handleProceed = () => {
    setStep(2);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Transactions</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Create Issue</span>
      </div>

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div className="flex-1">
            <h4 className="font-bold">Transaction Submitted Successfully</h4>
            <p className="text-sm mt-0.5">Issue Creation successful. Transaction Status: Submit</p>
          </div>
          <button onClick={() => { setSuccess(false); setStep(1); }} className="text-emerald-700 hover:text-emerald-900 font-bold text-sm">Create New</button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-8 py-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-6" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#F0F9FF' }}>
              <Share className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#003A5D', letterSpacing: '-0.5px' }}>
                Create Issue
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Create withdrawal issues for warehouse dispatch
              </p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-5 py-2.5 rounded-xl border bg-slate-50 flex flex-col" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction No</span>
                <span className="text-xs font-bold text-[#315B78] uppercase">{success ? 'WDDH0000000008' : '-'}</span>
             </div>
             <div className="px-5 py-2.5 rounded-xl border bg-slate-50 flex flex-col" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                <span className="text-xs font-bold text-[#315B78] uppercase">{success ? '13-04-2022' : '-'}</span>
             </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
           {/* Section 1: Basic Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-10">
              <div className="space-y-6">
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">State <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.state}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Warehouse <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.warehouse}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Stack Selection <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.stackSelection}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">UOM</label>
                    <input disabled={step > 1} type="text" defaultValue={formData.uom} className="w-full h-10 px-3 bg-blue-50/50 rounded-md text-sm font-bold text-[#315B78] outline-none" />
                 </div>
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Withdrawal Type <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.withdrawalType}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Client Available Inventory</label>
                    <input disabled={step > 1} type="text" defaultValue={formData.clientAvailableInventory} className="w-full h-10 px-3 bg-blue-50/50 rounded-md text-sm font-bold text-[#315B78] outline-none" />
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Withdrawer Id</label>
                    <div className="flex gap-2">
                      <input disabled={step > 1} type="text" defaultValue={formData.withdrawerId} className="w-full h-10 px-3 bg-blue-50/50 rounded-md text-sm font-bold text-[#315B78] outline-none" />
                      <button disabled={step > 1} className="w-10 h-10 rounded-md bg-blue-500 text-white flex items-center justify-center">...</button>
                    </div>
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Total Withdrawal Quantity <span className="text-red-500">*</span></label>
                    <input disabled={step > 1} type="text" defaultValue={formData.totalWithdrawalQuantity} className="w-full h-10 px-3 bg-blue-50/50 rounded-md text-sm font-bold text-[#315B78] outline-none" />
                 </div>
                 <div className="space-y-1.5 flex flex-col">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Withdrawal Date</label>
                    <input disabled={step > 1} type="text" defaultValue={formData.withdrawalDate} className="w-1/2 h-10 px-3 bg-blue-50/50 rounded-md text-sm font-bold text-[#315B78] outline-none" />
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Season Id <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.seasonId}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Godown <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.godown}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Commodity <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.commodity}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col mt-20 border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Client Id <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                       <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                          <option>{formData.clientId}</option>
                       </select>
                       <button disabled={step > 1} className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center">...</button>
                    </div>
                 </div>
                 <div className="space-y-1.5 flex flex-col border-b pb-2 border-slate-100">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Issue Type <span className="text-red-500">*</span></label>
                    <select disabled={step > 1} className="w-full bg-transparent text-sm font-bold text-[#315B78] outline-none appearance-none">
                       <option>{formData.issueType}</option>
                    </select>
                 </div>
                 <div className="space-y-1.5 flex flex-col mt-24">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Total Bags <span className="text-red-500">*</span></label>
                    <input disabled={step > 1} type="text" defaultValue={formData.totalBags} className="w-3/4 h-10 px-3 bg-blue-50/50 rounded-md text-sm font-bold text-[#315B78] outline-none" />
                 </div>
              </div>
           </div>

           {step === 1 && !success && (
              <div className="flex gap-4">
                 <button onClick={handleProceed} className="px-8 h-12 rounded-xl bg-blue-500 text-white font-black uppercase text-sm shadow-md hover:bg-blue-600 transition-all flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Click to Proceed
                 </button>
              </div>
           )}

           {/* Step 2: Details */}
           {step === 2 && !success && (
             <div className="mt-8 border-t pt-8 bg-blue-50/30 p-6 rounded-2xl border" style={{ borderColor: '#E5EBEF' }}>
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
                   <table className="w-full text-nowrap text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="w-10"></th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">WHR/Lot Number</th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">Pack Type</th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">Reference Available Inventory</th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">No. of Bags</th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">Withdrawal quantity</th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">Vehicle No.</th>
                            <th className="px-3 py-3 text-left font-bold text-slate-600">Receipt No</th>
                         </tr>
                      </thead>
                      <tbody>
                         {issueRecords.map((row, i) => (
                           <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-3 py-3 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                              <td className="px-3 py-3">
                                 <select className="h-9 w-40 px-2 rounded-md border border-slate-300 bg-white text-xs font-bold text-slate-700">
                                    <option>{row.whrLotNo}</option>
                                 </select>
                              </td>
                              <td className="px-3 py-3">
                                 <select className="h-9 w-32 px-2 rounded-md border border-slate-300 bg-white text-xs font-bold text-slate-700">
                                    <option>{row.packType}</option>
                                 </select>
                              </td>
                              <td className="px-3 py-3">
                                 <input type="text" defaultValue={row.refAvailableEnv} className="h-9 w-32 px-3 rounded-md border border-blue-200 bg-blue-50/50 text-xs font-bold text-blue-900" />
                              </td>
                              <td className="px-3 py-3">
                                 <input type="text" defaultValue={row.bags} className="h-9 w-24 px-3 rounded-md border border-slate-200 text-xs text-slate-700" />
                              </td>
                              <td className="px-3 py-3">
                                 <input type="text" defaultValue={row.qty} className="h-9 w-32 px-3 rounded-md border border-slate-200 text-xs text-slate-700" />
                              </td>
                              <td className="px-3 py-3">
                                 <input type="text" defaultValue={row.vehicleNo} className="h-9 w-32 px-3 rounded-md border border-slate-200 text-xs text-slate-700" />
                              </td>
                              <td className="px-3 py-3">
                                 <input type="text" defaultValue={row.receiptNo} className="h-9 w-20 px-3 rounded-md border border-slate-200 text-xs bg-slate-50 text-slate-500" />
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="flex justify-between items-center mt-6">
                   <div className="flex gap-1">
                      <button className="w-8 h-8 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold pb-0.5">+</button>
                      <button className="w-8 h-8 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold pb-0.5">-</button>
                   </div>
                   <div className="flex gap-2">
                      <button className="px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-600 transition-all">
                         Save
                      </button>
                      <button 
                        onClick={handleSubmit} 
                        className="px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-600 transition-all flex items-center gap-2"
                      >
                         {isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Submit'}
                      </button>
                      <button className="px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-600 transition-all">
                         Cancel
                      </button>
                      <button className="px-6 h-10 rounded-lg bg-blue-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-600 transition-all">
                         Reset
                      </button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
