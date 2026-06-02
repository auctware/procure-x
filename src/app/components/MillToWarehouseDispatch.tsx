import { useState, useRef } from 'react';
import { 
  Home, ChevronRight, Truck, Search, Download, 
  RotateCcw, Filter, Eye, List, CheckCircle2,
  Clock, AlertCircle, ArrowUpRight, ArrowDownRight,
  TrendingUp, Building2, Package, Layers, Info,
  RefreshCcw, Upload, FileText, LayoutGrid, Save,
  Plus, Smartphone, ShieldCheck, X
} from 'lucide-react';

export default function MillToWarehouseDispatch() {
  const [activeTab, setActiveTab] = useState('Create Dispatch');
  const [dispatchType, setDispatchType] = useState('against_ro');

  const [formData, setFormData] = useState({
    state: 'MAHARASHTRA',
    mill: '9111 - SHRI DATTA RICE MILL KUNGHADA',
    commodity: 'PADDY COMMON',
    seasonId: '21R',
    center: '9110-AB MSP CENTER',
    stateAgency: 'G3062 - AB State Agency',
    districtAgency: 'G3059 - AB District Agency',
    roNumber: 'ROW100803220402532',
    milledCommodity: 'RICE',
    warehouse: '9111-AB WAREHOUSE',
    grossQuantity: '180.000',
    packType: '50 KG',
    quantity: '180.000',
    bags: '360',
    vehicleNo: 'MH45TR5678',
    deliveryChallanNo: 'ACD12',
    transporterName: 'Akshay',
    distanceMillWH: '10',
    distanceCenterMill: '7'
  });

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Mill Operations</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Mill to Warehouse Dispatch</span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Truck className="w-5 h-5 text-[#027F83]" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Mill to Warehouse Dispatch
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Initiate grain transfer from processing unit to storage warehouse
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg border" style={{ borderColor: '#E5EBEF' }}>
            {['Create Dispatch', 'View Dispatch', 'Dispatch With CMRO'].map((tab) => (
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
           {/* Dispatch Type Selection */}
           <div className="flex items-center gap-12 mb-10 pb-8 border-b border-slate-50">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dispatch Type:</span>
              <div className="flex items-center gap-8">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="type" 
                      className="w-4 h-4 accent-[#027F83]"
                      checked={dispatchType === 'advanced'}
                      onChange={() => setDispatchType('advanced')}
                    />
                    <span className={`text-sm font-bold transition-colors ${dispatchType === 'advanced' ? 'text-[#027F83]' : 'text-slate-500'}`}>Advanced CMR Dispatch</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="type" 
                      className="w-4 h-4 accent-[#027F83]"
                      checked={dispatchType === 'against_ro'}
                      onChange={() => setDispatchType('against_ro')}
                    />
                    <span className={`text-sm font-bold transition-colors ${dispatchType === 'against_ro' ? 'text-[#027F83]' : 'text-slate-500'}`}>Dispatch of CMR Against RO</span>
                 </label>
              </div>
           </div>

           {/* Form Layout */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
              {[
                { label: 'State', value: formData.state, req: true },
                { label: 'Mill', value: formData.mill, req: true },
                { label: 'Commodity', value: formData.commodity, req: true },
                { label: 'Season Id', value: formData.seasonId, req: true },
                { label: 'Center', value: formData.center, req: true },
                { label: 'State Agency', value: formData.stateAgency, req: true },
                { label: 'District Agency', value: formData.districtAgency, req: true },
                { label: 'RO Number', value: formData.roNumber },
                { label: 'Milled Commodity', value: formData.milledCommodity, req: true },
                { label: 'WareHouse', value: formData.warehouse, req: true },
                { label: 'Gross Quantity', value: formData.grossQuantity, req: true },
                { label: 'Pack Type', value: formData.packType, req: true },
                { label: 'Quantity', value: formData.quantity, req: true },
                { label: 'Bags', value: formData.bags, req: true },
                { label: 'Vehicle No', value: formData.vehicleNo, req: true, edit: true },
                { label: 'Delivery Challan No', value: formData.deliveryChallanNo, edit: true },
                { label: 'Transporter Name', value: formData.transporterName, edit: true },
                { label: 'Distance (Mill to WH)', value: formData.distanceMillWH, req: true, edit: true },
                { label: 'Distance (Center to Mill)', value: formData.distanceCenterMill, edit: true },
              ].map((field, i) => (
                <div key={i} className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      {field.label} {field.req && <span className="text-red-500">*</span>}
                   </label>
                   {field.edit ? (
                     <input 
                      type="text" 
                      defaultValue={field.value} 
                      className="w-full h-11 px-4 rounded-xl border bg-white text-sm font-bold text-[#315B78] outline-none focus:border-[#027F83]" 
                      style={{ borderColor: '#E2E8F0' }} 
                     />
                   ) : (
                     <div className="h-11 w-full px-4 rounded-xl border bg-slate-50 flex items-center text-sm font-bold text-[#315B78] overflow-hidden truncate" style={{ borderColor: '#E2E8F0' }}>
                        {field.value}
                     </div>
                   )}
                </div>
              ))}
           </div>

           {/* Actions Area */}
           <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderColor: '#E5EBEF' }}>
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex-1">
                 <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Smartphone className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-blue-900">Digital Dispatch Tracking</h4>
                    <p className="text-xs text-blue-600 mt-0.5">Vehicle movement will be tracked via GPS once the dispatch is submitted.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <button className="px-8 h-12 rounded-xl bg-slate-50 text-red-500 font-bold hover:bg-red-50 transition-all border border-transparent">RESET</button>
                 <button className="px-16 h-12 rounded-xl bg-[#315B78] text-white font-black shadow-lg shadow-[#315B78]/20 flex items-center gap-3 hover:translate-y-[-2px] transition-all">
                    <Save className="w-5 h-5" />
                    SUBMIT DISPATCH
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
