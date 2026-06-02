import { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Package, Save, RotateCcw, 
  Calendar, Layers, MapPin, Building2, Truck, 
  PlusCircle, Info, Calculator, FileText, CheckCircle2
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

export default function GunnyBagDeposit() {
  const [formData, setFormData] = useState({
    state: 'MAHARASHTRA',
    district: '',
    stateAgency: '',
    districtAgency: '',
    season: '',
    godown: '',
    packType: '',
    depositDate: new Date().toISOString().split('T')[0],
    noOfOldBags: '0',
    noOfNewBags: '0',
    noOfOneTimeUsedBags: '0',
    totalBags: '0',
    remark: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dropdown states
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [stateAgencyDropdownOpen, setStateAgencyDropdownOpen] = useState(false);
  const [districtAgencyDropdownOpen, setDistrictAgencyDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [godownDropdownOpen, setGodownDropdownOpen] = useState(false);
  const [packTypeDropdownOpen, setPackTypeDropdownOpen] = useState(false);

  const districtRef = useRef<HTMLDivElement>(null);
  const stateAgencyRef = useRef<HTMLDivElement>(null);
  const districtAgencyRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const godownRef = useRef<HTMLDivElement>(null);
  const packTypeRef = useRef<HTMLDivElement>(null);

  // Auto-calculate total
  useEffect(() => {
    const total = (parseInt(formData.noOfOldBags) || 0) + 
                  (parseInt(formData.noOfNewBags) || 0) + 
                  (parseInt(formData.noOfOneTimeUsedBags) || 0);
    setFormData(prev => ({ ...prev, totalBags: total.toString() }));
  }, [formData.noOfOldBags, formData.noOfNewBags, formData.noOfOneTimeUsedBags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      state: 'MAHARASHTRA',
      district: '',
      stateAgency: '',
      districtAgency: '',
      season: '',
      godown: '',
      packType: '',
      depositDate: new Date().toISOString().split('T')[0],
      noOfOldBags: '0',
      noOfNewBags: '0',
      noOfOneTimeUsedBags: '0',
      totalBags: '0',
      remark: ''
    });
  };

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', height: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <span style={{ color: '#027F83', fontWeight: '500' }}>Procurement</span>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Gunny Bag Deposit</span>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300" style={{ backgroundColor: '#ECFDF5', border: '1px solid #10B981', color: '#065F46' }}>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span style={{ fontWeight: '600' }}>Deposit successfully recorded and inventory updated.</span>
        </div>
      )}

      {/* Main Single Card Container */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#E6F7F7' }}>
              <Package className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Gunny Bag Deposit
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Register and manage gunny bag deposits for warehouses
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl border flex items-center gap-2" style={{ backgroundColor: '#F8FAFC', borderColor: '#E5E7EB' }}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Inventory System</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Row 1 */}
            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>State <span className="text-red-500">*</span></label>
              <div className="h-12 px-4 rounded-lg border bg-slate-50 flex items-center text-slate-700 font-semibold text-sm border-slate-200">
                {formData.state}
              </div>
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>District <span className="text-red-500">*</span></label>
              <CustomDropdown
                value={formData.district}
                onChange={(val) => setFormData(prev => ({ ...prev, district: val }))}
                options={[
                  { value: 'NANDED', label: 'NANDED' },
                  { value: 'PUNE', label: 'PUNE' },
                  { value: 'MUMBAI', label: 'MUMBAI' }
                ]}
                placeholder="Select District"
                isOpen={districtDropdownOpen}
                onToggle={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                dropdownRef={districtRef}
              />
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>State Agency <span className="text-red-500">*</span></label>
              <CustomDropdown
                value={formData.stateAgency}
                onChange={(val) => setFormData(prev => ({ ...prev, stateAgency: val }))}
                options={[
                  { value: 'MAHAFED', label: 'MAHAFED' },
                  { value: 'MSWC', label: 'MSWC' }
                ]}
                placeholder="Select State Agency"
                isOpen={stateAgencyDropdownOpen}
                onToggle={() => setStateAgencyDropdownOpen(!stateAgencyDropdownOpen)}
                dropdownRef={stateAgencyRef}
              />
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>District Agency <span className="text-red-500">*</span></label>
              <CustomDropdown
                value={formData.districtAgency}
                onChange={(val) => setFormData(prev => ({ ...prev, districtAgency: val }))}
                options={[
                  { value: 'NANDED_DCC', label: 'NANDED DCC' },
                  { value: 'PUNE_DCC', label: 'PUNE DCC' }
                ]}
                placeholder="Select District Agency"
                isOpen={districtAgencyDropdownOpen}
                onToggle={() => setDistrictAgencyDropdownOpen(!districtAgencyDropdownOpen)}
                dropdownRef={districtAgencyRef}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Row 2 */}
            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Season <span className="text-red-500">*</span></label>
              <CustomDropdown
                value={formData.season}
                onChange={(val) => setFormData(prev => ({ ...prev, season: val }))}
                options={[
                  { value: 'Kharif_2023', label: 'KHARIF 2023-24' },
                  { value: 'Rabi_2023', label: 'RABI 2023-24' }
                ]}
                placeholder="Select Season"
                isOpen={seasonDropdownOpen}
                onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                dropdownRef={seasonRef}
              />
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Godown <span className="text-red-500">*</span></label>
              <CustomDropdown
                value={formData.godown}
                onChange={(val) => setFormData(prev => ({ ...prev, godown: val }))}
                options={[
                  { value: 'W_1', label: 'Warehouse Block 1' },
                  { value: 'W_2', label: 'Warehouse Block 2' }
                ]}
                placeholder="Select Godown"
                isOpen={godownDropdownOpen}
                onToggle={() => setGodownDropdownOpen(!godownDropdownOpen)}
                dropdownRef={godownRef}
              />
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Pack Type <span className="text-red-500">*</span></label>
              <CustomDropdown
                value={formData.packType}
                onChange={(val) => setFormData(prev => ({ ...prev, packType: val }))}
                options={[
                  { value: 'JUTE', label: 'Jute Bags' },
                  { value: 'HDPE', label: 'HDPE Bags' }
                ]}
                placeholder="Select Pack Type"
                isOpen={packTypeDropdownOpen}
                onToggle={() => setPackTypeDropdownOpen(!packTypeDropdownOpen)}
                dropdownRef={packTypeRef}
              />
            </div>

            <div className="space-y-2">
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Deposit Date <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.depositDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, depositDate: e.target.value }))}
                  className="w-full h-12 px-4 rounded-lg border outline-none transition-all text-sm font-semibold text-[#315B78]"
                  style={{ borderColor: '#CCD8DF' }}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-xl bg-slate-50 border mb-8" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-3 mb-6">
              <Layers className="w-5 h-5 text-[#027F83]" />
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#315B78', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bag Quantity Details</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>New Bags</label>
                <input
                  type="number"
                  value={formData.noOfNewBags}
                  onChange={(e) => setFormData(prev => ({ ...prev, noOfNewBags: e.target.value }))}
                  className="w-full h-12 px-4 rounded-lg border outline-none font-bold text-[#027F83]"
                  style={{ borderColor: '#CCD8DF' }}
                />
              </div>

              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Old Bags</label>
                <input
                  type="number"
                  value={formData.noOfOldBags}
                  onChange={(e) => setFormData(prev => ({ ...prev, noOfOldBags: e.target.value }))}
                  className="w-full h-12 px-4 rounded-lg border outline-none font-bold text-[#027F83]"
                  style={{ borderColor: '#CCD8DF' }}
                />
              </div>

              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>1-Time Used</label>
                <input
                  type="number"
                  value={formData.noOfOneTimeUsedBags}
                  onChange={(e) => setFormData(prev => ({ ...prev, noOfOneTimeUsedBags: e.target.value }))}
                  className="w-full h-12 px-4 rounded-lg border outline-none font-bold text-[#027F83]"
                  style={{ borderColor: '#CCD8DF' }}
                />
              </div>

              <div className="space-y-2">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>Total Bags</label>
                <div className="h-12 px-4 rounded-lg border flex items-center bg-white font-black text-lg text-[#003A5D]" style={{ borderColor: '#CCD8DF' }}>
                  {formData.totalBags}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>Remarks</label>
            <textarea
              value={formData.remark}
              onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
              placeholder="Enter any additional information..."
              className="w-full p-4 rounded-lg border min-h-[100px] outline-none transition-all text-sm"
              style={{ borderColor: '#CCD8DF' }}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5EBEF' }}>
            <button
              onClick={handleReset}
              type="button"
              className="px-8 h-12 rounded-lg border text-slate-600 font-bold text-sm transition-all hover:bg-slate-50 flex items-center gap-2"
              style={{ borderColor: '#E5EBEF' }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 h-12 rounded-lg bg-[#027F83] text-white font-bold text-sm shadow-md transition-all hover:opacity-90 active:scale-95 flex items-center gap-2"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
              Register Deposit
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 flex items-center gap-6">
        <div className="flex-1 p-6 rounded-xl bg-slate-50 border flex items-start gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="p-2 rounded-lg bg-[#027F83]/10">
            <Info className="w-5 h-5 text-[#027F83]" />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>Inventory Update</h4>
            <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-wider">Deposited bags are immediately reflected in the Godown stock position.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
