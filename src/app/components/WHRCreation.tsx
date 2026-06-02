import { useState } from 'react';
import { 
  Home, ChevronRight, Building2, Search, 
  CheckCircle2, AlertCircle, FileText, Download,
  Save, X, Check, FileSignature
} from 'lucide-react';

export default function WHRCreation() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    state: 'MAHARASHTRA',
    warehouse: '9111-AB WAREHOUSE',
    commodity: 'RICE',
    seasonId: '22R',
    godown: '911111-NAGPUR GODOWN',
    uom: 'MT',
    depositer: 'G3062',
    centerCode: 'AB MSP CENTER',
    whrNo: '91111649841181571',
    totalQuantity: '10',
    totalBags: '20',
    depositDate: '13-Apr-2022',
    whrExpiryDate: '02-May-2022',
    remark: ''
  });

  const [arrivalRecords, setArrivalRecords] = useState([
    { id: '1', refNo: 'DMWARR0000000923', lotId: '911116498411', packType: '50 KG JUTE BAG', bags: '20', uom: 'MT', qty: '10', vehicleNo: 'MH05AP8155', date: '13-04-2022', selected: false }
  ]);

  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const handleAddDetails = () => {
    setStep(2);
  };

  const handleSelectRecord = (id: string) => {
    setArrivalRecords(records => 
      records.map(r => r.id === id ? { ...r, selected: !r.selected } : r)
    );
  };

  const handleSave = () => {
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
        <span style={{ fontWeight: '600', color: '#222' }}>WHR Creation</span>
      </div>

      {success && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <div className="flex-1">
            <h4 className="font-bold">Deposit Records submitted Successfully</h4>
            <p className="text-sm mt-0.5">WHR Creation successful. Transaction Status: Submit</p>
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
              <FileSignature className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#003A5D', letterSpacing: '-0.5px' }}>
                WHR Creation
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Create Warehouse Receipt against arriving commodities
              </p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-5 py-2.5 rounded-xl border bg-slate-50 flex flex-col" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction No</span>
                <span className="text-xs font-bold text-[#315B78] uppercase">{success ? 'DH00000000018' : '-'}</span>
             </div>
             <div className="px-5 py-2.5 rounded-xl border bg-slate-50 flex flex-col" style={{ borderColor: '#E5EBEF' }}>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                <span className="text-xs font-bold text-[#315B78] uppercase">{success ? 'Submit' : 'Pending'}</span>
             </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
           {/* Section 1: Basic Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 mb-10">
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">State <span className="text-red-500">*</span></label>
                 <select disabled={step > 1} className="h-11 w-full px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                    <option>{formData.state}</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Warehouse <span className="text-red-500">*</span></label>
                 <select disabled={step > 1} className="h-11 w-full px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                    <option>{formData.warehouse}</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Season Id <span className="text-red-500">*</span></label>
                 <select disabled={step > 1} className="h-11 w-full px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                    <option>{formData.seasonId}</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Commodity <span className="text-red-500">*</span></label>
                 <select disabled={step > 1} className="h-11 w-full px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                    <option>{formData.commodity}</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Godown <span className="text-red-500">*</span></label>
                 <select disabled={step > 1} className="h-11 w-full px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                    <option>{formData.godown}</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">UOM</label>
                 <input disabled={step > 1} type="text" defaultValue={formData.uom} className="h-11 w-full px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Depositer <span className="text-red-500">*</span></label>
                 <div className="flex gap-2">
                   <input disabled={step > 1} type="text" defaultValue={formData.depositer} className="h-11 flex-1 px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                   <button disabled={step > 1} className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center disabled:opacity-50">...</button>
                 </div>
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Center Code <span className="text-red-500">*</span></label>
                 <select disabled={step > 1} className="h-11 w-full px-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }}>
                    <option>{formData.centerCode}</option>
                 </select>
              </div>
              <div className="space-y-1.5 flex flex-col"></div>

              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">WHR No. <span className="text-red-500">*</span></label>
                 <input disabled={step > 1} type="text" defaultValue={formData.whrNo} className="h-11 w-full px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Total Quantity</label>
                 <input disabled={step > 1} type="text" defaultValue={formData.totalQuantity} className="h-11 w-full px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Depositor</label>
                 <div className="flex gap-2">
                   <input disabled={step > 1} type="text" defaultValue={formData.depositer} className="h-11 flex-1 px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
                   <button disabled={step > 1} className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center disabled:opacity-50">...</button>
                 </div>
              </div>

              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Total Bags</label>
                 <input disabled={step > 1} type="text" defaultValue={formData.totalBags} className="h-11 w-full px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
              
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Deposit Date</label>
                 <input disabled={step > 1} type="text" defaultValue={formData.depositDate} className="h-11 w-full px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
              <div className="space-y-1.5 flex flex-col">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">WHR Expiry Date <span className="text-red-500">*</span></label>
                 <input disabled={step > 1} type="text" defaultValue={formData.whrExpiryDate} className="h-11 w-full px-4 rounded-xl border bg-slate-50 text-sm font-bold text-[#315B78] outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>

              <div className="space-y-1.5 flex flex-col lg:col-span-3">
                 <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">Remark</label>
                 <textarea disabled={step > 1} rows={2} className="w-full p-4 rounded-xl border bg-white disabled:bg-slate-50 text-sm font-bold text-[#315B78] outline-none resize-none" style={{ borderColor: '#E2E8F0' }}></textarea>
              </div>
           </div>

           {step === 1 && !success && (
              <div className="flex gap-4">
                 <button onClick={handleAddDetails} className="px-8 h-12 rounded-xl bg-blue-600 text-white font-black uppercase text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                    + Add Details
                 </button>
                 <button className="px-8 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold uppercase text-sm hover:bg-slate-200 transition-all">
                    Back
                 </button>
              </div>
           )}

           {/* Step 2: Arrival Records */}
           {step === 2 && !success && (
             <div className="mt-8 border-t pt-8" style={{ borderColor: '#E5EBEF' }}>
                <div className="mb-6">
                   <button onClick={() => setShowArrivalModal(true)} className="px-6 h-10 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-700 transition-all">
                     Select Arrival Record...
                   </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                   <table className="w-full text-nowrap">
                      <thead className="bg-slate-50">
                         <tr className="border-b border-slate-200">
                            <th className="w-12 px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Arrival Reference No</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">WHR No/Lot ID</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Pack Type</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">No Of Bags</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">UOM</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Quantity</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Vehicle No</th>
                            <th className="px-4 py-3 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Arrival Date</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {arrivalRecords.filter(r => r.selected).length === 0 ? (
                            <tr>
                               <td colSpan={9} className="py-12 text-center text-slate-400 text-sm font-medium">No records selected.</td>
                            </tr>
                         ) : (
                            arrivalRecords.filter(r => r.selected).map((row, i) => (
                               <tr key={i} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-4 py-3 text-center"><Check className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                                  <td className="px-4 py-3">
                                     <div className="h-9 px-3 rounded-md bg-slate-50 border border-slate-200 flex items-center text-xs font-bold text-slate-600">{row.refNo}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                     <div className="h-9 px-3 rounded-md bg-slate-50 border border-slate-200 flex items-center text-xs font-bold text-slate-600">{row.lotId}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                     <select className="h-9 w-full px-2 rounded-md border border-slate-200 bg-white text-xs font-bold text-slate-600 outline-none">
                                        <option>{row.packType}</option>
                                     </select>
                                  </td>
                                  <td className="px-4 py-3">
                                     <input type="text" defaultValue={row.bags} className="h-9 w-full px-3 rounded-md border border-blue-200 bg-blue-50/50 text-xs font-bold text-blue-900 outline-none focus:bg-white focus:border-blue-500" />
                                  </td>
                                  <td className="px-4 py-3">
                                     <div className="h-9 px-3 rounded-md bg-slate-50 border border-slate-200 flex items-center text-xs font-bold text-slate-600">{row.uom}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                     <input type="text" defaultValue={row.qty} className="h-9 w-full px-3 rounded-md border border-blue-200 bg-blue-50/50 text-xs font-bold text-blue-900 outline-none focus:bg-white focus:border-blue-500" />
                                  </td>
                                  <td className="px-4 py-3">
                                     <div className="h-9 px-3 rounded-md bg-slate-50 border border-slate-200 flex items-center text-xs font-bold text-slate-600">{row.vehicleNo}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                     <div className="h-9 px-3 rounded-md bg-slate-50 border border-slate-200 flex items-center text-xs font-bold text-slate-600">{row.date}</div>
                                  </td>
                               </tr>
                            ))
                         )}
                      </tbody>
                   </table>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                   <div className="text-xs font-bold text-slate-500">Total Items: {arrivalRecords.filter(r => r.selected).length}</div>
                   <div className="flex gap-2">
                      <button className="px-6 h-10 rounded-lg bg-red-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-red-600 transition-all">
                        Remove
                      </button>
                      <button 
                        onClick={handleSave}
                        className="px-8 h-10 rounded-lg bg-blue-600 text-white font-bold text-xs uppercase shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
                      >
                         {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save'}
                      </button>
                      <button className="px-6 h-10 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs uppercase hover:bg-slate-200 transition-all">
                         Reset
                      </button>
                      <button className="px-6 h-10 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs uppercase hover:bg-slate-200 transition-all">
                         Back
                      </button>
                      <button className="px-6 h-10 rounded-lg bg-red-500 text-white font-bold text-xs uppercase shadow-sm hover:bg-red-600 transition-all">
                         Cancel
                      </button>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Arrival Record Modal */}
      {showArrivalModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-[#003A5D]">Arrival Record</h3>
                 <button onClick={() => setShowArrivalModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 overflow-x-auto">
                 <table className="w-full text-left text-sm border-collapse border border-slate-200 text-nowrap">
                    <thead className="bg-slate-100 font-bold text-slate-600 text-xs uppercase">
                       <tr>
                          <th className="p-3 border border-slate-200 w-10"></th>
                          <th className="p-3 border border-slate-200">Transaction Number</th>
                          <th className="p-3 border border-slate-200">Center</th>
                          <th className="p-3 border border-slate-200">Arrival Date</th>
                          <th className="p-3 border border-slate-200">Actual Accepted Quantity</th>
                          <th className="p-3 border border-slate-200">Accepted Quantity</th>
                       </tr>
                    </thead>
                    <tbody>
                       {arrivalRecords.map(row => (
                         <tr key={row.id} className="hover:bg-blue-50/50 cursor-pointer" onClick={() => handleSelectRecord(row.id)}>
                            <td className="p-3 border border-slate-200 text-center">
                               <input type="checkbox" checked={row.selected} readOnly className="w-4 h-4 cursor-pointer" />
                            </td>
                            <td className="p-3 border border-slate-200">{row.refNo}</td>
                            <td className="p-3 border border-slate-200">9111</td>
                            <td className="p-3 border border-slate-200">{row.date}</td>
                            <td className="p-3 border border-slate-200 text-blue-600 font-bold">{row.qty}</td>
                            <td className="p-3 border border-slate-200">{row.qty}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
                 <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                    <span>Total Items: 1 (Selected Items: {arrivalRecords.filter(r => r.selected).length})</span>
                    <button 
                      onClick={() => setShowArrivalModal(false)}
                      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                    >
                       OK
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
