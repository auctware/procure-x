import { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, Info, TrendingUp, Users, Package, Truck, 
  FileText, Target, Wheat, Factory, CheckCircle2, MapPin,
  Activity, AlertCircle, Home, ChevronRight, Settings
} from 'lucide-react';
import IndiaMap from '@/app/components/IndiaMap';

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  hasInfo?: boolean;
}

function StatCard({ icon: Icon, label, value, bgColor, iconBgColor, iconColor, hasInfo }: StatCardProps) {
  return (
    <div 
      className="relative rounded-xl p-4 sm:p-5 lg:p-6 transition-all hover:shadow-md cursor-pointer border"
      style={{ backgroundColor: bgColor, borderColor: '#E5EBEF' }}
    >
      {hasInfo && (
        <button 
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
        >
          <Info className="w-3 h-3" style={{ color: '#666' }} />
        </button>
      )}
      
      <div className="flex items-start gap-3 sm:gap-4">
        <div 
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: iconColor }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: '500', lineHeight: '1.4' }}>
            {label}
          </p>
          <p style={{ fontSize: '20px', fontWeight: '700', color: '#315B78', lineHeight: '1' }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  label: string;
  color: string;
  size?: number;
}

function CircularProgress({ value, label, color, size = 140 }: CircularProgressProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5EBEF"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: size <= 120 ? '24px' : '28px', fontWeight: '700', color: '#315B78', lineHeight: '1' }}>
            {value}
          </span>
          <span style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
            Cr
          </span>
        </div>
      </div>
      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', lineHeight: '1.5', maxWidth: size <= 120 ? '120px' : '140px', fontWeight: '500' }}>
        {label}
      </p>
    </div>
  );
}

export default function DashboardHome() {
  const [selectedYear, setSelectedYear] = useState('2025 - 26');
  const [selectedScheme, setSelectedScheme] = useState('MMFT FOR ETHANGK KHARIF 2025');
  const [selectedState, setSelectedState] = useState('All');
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [performanceView, setPerformanceView] = useState<'farmers' | 'procurement'>('procurement');
  const [mapView, setMapView] = useState<'farmers' | 'procurement'>('procurement');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    stats: true,
    pendingTasks: true,
    paymentTracker: true,
    topPerforming: true,
    mapView: true
  });

  const yearRef = useRef<HTMLDivElement>(null);
  const schemeRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const customizeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
      if (schemeRef.current && !schemeRef.current.contains(event.target as Node)) {
        setSchemeDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (customizeRef.current && !customizeRef.current.contains(event.target as Node)) {
        setCustomizeOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const statCards = [
    // { 
    //   icon: CheckCircle2, 
    //   label: 'SLA Registered', 
    //   value: '8', 
    //   bgColor: '#FFFFFF', 
    //   iconBgColor: '#E6F7F7',
    //   iconColor: '#027F83'
    // },
    { 
      icon: Users, 
      label: 'Farmers Registered', 
      value: '89', 
      bgColor: '#FFFFFF',
      iconBgColor: '#F3EDFF',
      iconColor: '#6B46C1'
    },
    { 
      icon: Package, 
      label: 'Procurement (MT)', 
      value: '285.8', 
      bgColor: '#FFFFFF',
      iconBgColor: '#FFE5E5',
      iconColor: '#E94545'
    },
    // { 
    //   icon: Users, 
    //   label: 'Total pre-registered farmers', 
    //   value: '12,87,320', 
    //   bgColor: '#FFFFFF',
    //   iconBgColor: '#E6F7F7',
    //   iconColor: '#027F83'
    // },
    { 
      icon: Users, 
      label: 'Commodity wise pre-registered farmers', 
      value: '12,87,320', 
      bgColor: '#FFFFFF',
      iconBgColor: '#F3EDFF',
      iconColor: '#6B46C1'
    },
    { 
      icon: Truck, 
      label: 'Dispatch To Warehouse', 
      value: '0', 
      bgColor: '#FFFFFF',
      iconBgColor: '#FFF3E0',
      iconColor: '#FFA200'
    },
    // { 
    //   icon: FileText, 
    //   label: 'Registrations', 
    //   value: '1', 
    //   bgColor: '#FFFFFF',
    //   iconBgColor: '#E3F2FD',
    //   iconColor: '#003a5d',
    //   hasInfo: true 
    // },
    { 
      icon: Factory, 
      label: 'FPO Registered', 
      value: '1', 
      bgColor: '#FFFFFF',
      iconBgColor: '#E3F2FD',
      iconColor: '#2196F3'
    },
    { 
      icon: Target, 
      label: 'Registration Target', 
      value: '0', 
      bgColor: '#FFFFFF',
      iconBgColor: '#FFF3E0',
      iconColor: '#FF8F00'
    },
    { 
      icon: Target, 
      label: 'Procurement Target (MT)', 
      value: '500', 
      bgColor: '#FFFFFF',
      iconBgColor: '#E6F7F7',
      iconColor: '#00897B'
    },
    // { 
    //   icon: Wheat, 
    //   label: 'Grill (MT)', 
    //   value: '0', 
    //   bgColor: '#FFFFFF',
    //   iconBgColor: '#F3EDFF',
    //   iconColor: '#7E57C2'
    // },
    { 
      icon: Activity, 
      label: 'Procurement (MT)', 
      value: '71.03', 
      bgColor: '#FFFFFF',
      iconBgColor: '#FFEBEE',
      iconColor: '#EF5350',
      hasInfo: true 
    },
  ];

  const pendingTasks = [
    { estate: 'Karnataka', count: 12, processName: 'SLA Registration Pending', datePending: '2024-01-10' },
    { estate: 'Tamil Nadu', count: 8, processName: 'Farmer Verification', datePending: '2024-01-12' },
    { estate: 'Maharashtra', count: 5, processName: 'Payment Processing', datePending: '2024-01-13' },
    { estate: 'Gujarat', count: 15, processName: 'Document Verification', datePending: '2024-01-09' },
  ];

  const topStates = [
    {
      state: 'Karnataka',
      procurement: '255.4',
      branchManager: 'MANAGER ONE',
      sla: 'SAMPLE SLA BANGALORE',
      slaAdmin: 'ADMIN ONE',
      pacs: 'SAMPLE FARMERS PRODUCER COMPANY LIMITED',
      pacsAdmin: 'Admin One'
    },
  ];

  // Map data
  const mapStateData = {
    KA: { name: 'Karnataka', value: 255.4, farmers: 350 },
    MH: { name: 'Maharashtra', value: 180, farmers: 280 },
    TN: { name: 'Tamil Nadu', value: 150, farmers: 220 },
    GJ: { name: 'Gujarat', value: 120, farmers: 180 },
    UP: { name: 'Uttar Pradesh', value: 90, farmers: 140 },
    MP: { name: 'Madhya Pradesh', value: 75, farmers: 110 },
    RJ: { name: 'Rajasthan', value: 60, farmers: 95 },
    AP: { name: 'Andhra Pradesh', value: 110, farmers: 160 },
    WB: { name: 'West Bengal', value: 85, farmers: 125 },
    TS: { name: 'Telangana', value: 95, farmers: 135 },
  };

  const handleStateClick = (stateName: string) => {
    console.log('Clicked state:', stateName);
    // You can add navigation or modal display here
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6 flex items-center gap-2 flex-wrap" style={{ fontSize: '13px', color: '#666' }}>
        <Home className="w-4 h-4 flex-shrink-0" style={{ color: '#027F83' }} />
        <button
          onClick={() => {
            // Navigate to home - you can add navigation logic here
            console.log('Navigate to home');
          }}
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          Home
        </button>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span style={{ fontWeight: '600', color: '#222' }}>Dashboard Overview</span>
      </div>

      {/* Filters Row */}
      <div className="mb-6 sm:mb-8">
        <div 
          className="rounded-xl p-4 sm:p-6 border shadow-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6">
            {/* Left Side - Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 flex-1">
              {/* Year Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                  Year
                </label>
                <div className="relative flex-1 sm:flex-initial" ref={yearRef}>
                  <button
                    onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                    className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-lg border-2 transition-all hover:border-[#027F83] hover:shadow-md w-full sm:w-auto"
                    style={{
                      borderColor: yearDropdownOpen ? '#027F83' : '#E5EBEF',
                      backgroundColor: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#222',
                      minWidth: '160px',
                      height: '44px'
                    }}
                  >
                    <span className="flex-1 text-left">{selectedYear}</span>
                    <ChevronDown 
                      className="w-4 h-4 transition-transform" 
                      style={{ 
                        color: yearDropdownOpen ? '#027F83' : '#999',
                        transform: yearDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} 
                    />
                  </button>
                  {yearDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl overflow-hidden z-50 border-2"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#027F83' }}
                    >
                      {['2025 - 26', '2024 - 25', '2023 - 24'].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setYearDropdownOpen(false);
                          }}
                          className="w-full px-5 py-3 text-left transition-all"
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: selectedYear === year ? '#027F83' : '#222',
                            backgroundColor: selectedYear === year ? '#E6F7F7' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedYear !== year) {
                              e.currentTarget.style.backgroundColor = '#F7F9FA';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedYear !== year) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Scheme Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                  Scheme
                </label>
                <div className="relative flex-1 sm:flex-initial" ref={schemeRef}>
                  <button
                    onClick={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
                    className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-lg border-2 transition-all hover:border-[#027F83] hover:shadow-md w-full sm:w-auto"
                    style={{
                      borderColor: schemeDropdownOpen ? '#027F83' : '#E5EBEF',
                      backgroundColor: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#222',
                      minWidth: '280px',
                      height: '44px'
                    }}
                  >
                    <span className="flex-1 text-left truncate">{selectedScheme}</span>
                    <ChevronDown 
                      className="w-4 h-4 transition-transform" 
                      style={{ 
                        color: schemeDropdownOpen ? '#027F83' : '#999',
                        transform: schemeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} 
                    />
                  </button>
                  {schemeDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl overflow-hidden z-50 border-2"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#027F83' }}
                    >
                      {['MMFT FOR ETHANGK KHARIF 2025', 'PMFBY 2024', 'KISAN CREDIT 2025'].map((scheme) => (
                        <button
                          key={scheme}
                          onClick={() => {
                            setSelectedScheme(scheme);
                            setSchemeDropdownOpen(false);
                          }}
                          className="w-full px-5 py-3 text-left transition-all"
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: selectedScheme === scheme ? '#027F83' : '#222',
                            backgroundColor: selectedScheme === scheme ? '#E6F7F7' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedScheme !== scheme) {
                              e.currentTarget.style.backgroundColor = '#F7F9FA';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedScheme !== scheme) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {scheme}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* State Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                  State
                </label>
                <div className="relative flex-1 sm:flex-initial" ref={stateRef}>
                  <button
                    onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                    className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-lg border-2 transition-all hover:border-[#027F83] hover:shadow-md w-full sm:w-auto"
                    style={{
                      borderColor: stateDropdownOpen ? '#027F83' : '#E5EBEF',
                      backgroundColor: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#222',
                      minWidth: '120px',
                      height: '44px'
                    }}
                  >
                    <span className="flex-1 text-left">{selectedState}</span>
                    <ChevronDown 
                      className="w-4 h-4 transition-transform" 
                      style={{ 
                        color: stateDropdownOpen ? '#027F83' : '#999',
                        transform: stateDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} 
                    />
                  </button>
                  {stateDropdownOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl overflow-hidden z-50 border-2"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#027F83' }}
                    >
                      {['All', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Gujarat'].map((state) => (
                        <button
                          key={state}
                          onClick={() => {
                            setSelectedState(state);
                            setStateDropdownOpen(false);
                          }}
                          className="w-full px-5 py-3 text-left transition-all"
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: selectedState === state ? '#027F83' : '#222',
                            backgroundColor: selectedState === state ? '#E6F7F7' : 'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedState !== state) {
                              e.currentTarget.style.backgroundColor = '#F7F9FA';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedState !== state) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Customize Button */}
            <div className="relative w-full sm:w-auto" ref={customizeRef}>
              <button
                onClick={() => setCustomizeOpen(!customizeOpen)}
                className="flex items-center justify-center gap-3 px-5 py-2.5 rounded-lg transition-all hover:shadow-md h-11 w-full sm:w-auto"
                style={{
                  backgroundColor: customizeOpen ? '#027F83' : '#FFFFFF',
                  color: customizeOpen ? '#FFFFFF' : '#027F83',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid #027F83',
                  minWidth: '140px'
                }}
                onMouseEnter={(e) => {
                  if (!customizeOpen) {
                    e.currentTarget.style.backgroundColor = '#E6F7F7';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!customizeOpen) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Settings className="w-5 h-5" />
                <span>Customize</span>
              </button>
              {customizeOpen && (
                <div
                  className="absolute top-full right-0 mt-2 rounded-lg shadow-xl overflow-hidden z-50 border-2"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#027F83', minWidth: '280px' }}
                >
                  <div className="p-5">
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#222', marginBottom: '16px' }}>
                      Customize Dashboard
                    </h4>
                    <div className="space-y-4">
                      {[
                        { key: 'stats', label: 'Stats Grid' },
                        { key: 'pendingTasks', label: 'Pending Task Tracker' },
                        { key: 'paymentTracker', label: 'Payment Tracker' },
                        { key: 'topPerforming', label: 'Top Performing States' },
                        { key: 'mapView', label: 'State-Wise Map View' }
                      ].map((section) => (
                        <label 
                          key={section.key}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={visibleSections[section.key as keyof typeof visibleSections]}
                              onChange={(e) => setVisibleSections({ ...visibleSections, [section.key]: e.target.checked })}
                              className="w-5 h-5 cursor-pointer"
                              style={{
                                accentColor: '#027F83'
                              }}
                            />
                          </div>
                          <span 
                            className="group-hover:text-[#027F83] transition-colors"
                            style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}
                          >
                            {section.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {visibleSections.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      )}

      {/* Pending Tasks & Payment Tracker */}
      {visibleSections.pendingTasks && visibleSections.paymentTracker && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Pending Task Tracker */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
          >
            <div className="px-6 py-5 border-b flex items-center gap-3" style={{ borderColor: '#E5EBEF' }}>
              <AlertCircle className="w-5 h-5" style={{ color: '#027F83' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Pending Task Tracker
              </h3>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead style={{ backgroundColor: '#F7F9FA' }}>
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Estate
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-center" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Count
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Process Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        Date of Pending
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingTasks.map((task, index) => (
                      <tr 
                        key={index} 
                        className="border-t transition-colors hover:bg-gray-50" 
                        style={{ borderColor: '#E5EBEF' }}
                      >
                        <td className="px-4 sm:px-6 py-3 sm:py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {task.estate}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center" style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>
                          {task.count}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                          {task.processName}
                        </td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                          {task.datePending}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Tracker */}
          <div
            className="rounded-xl p-4 sm:p-6 lg:p-8 border"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
          >
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Activity className="w-5 h-5" style={{ color: '#027F83' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Payment Tracker
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-4">
              <CircularProgress value={62} label="Total Trade Value" color="#027F83" size={120} />
              <CircularProgress value={0} label="Total Payment Generated" color="#6B46C1" size={120} />
              <CircularProgress value={0} label="Payment Credited to Farmers" color="#00A040" size={120} />
            </div>
          </div>
        </div>
      )}

      {/* Top Performing States */}
      {visibleSections.topPerforming && (
        <div
          className="rounded-xl overflow-hidden mb-6 sm:mb-8 border"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5" style={{ color: '#027F83' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                Top Performing States
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setPerformanceView('farmers')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all h-10 w-full sm:w-auto"
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: performanceView === 'farmers' ? '#FFFFFF' : '#027F83',
                  backgroundColor: performanceView === 'farmers' ? '#027F83' : '#FFFFFF',
                  border: '1px solid #027F83'
                }}
                onMouseEnter={(e) => {
                  if (performanceView !== 'farmers') {
                    e.currentTarget.style.backgroundColor = '#E6F7F7';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (performanceView !== 'farmers') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Users className="w-4 h-4" />
                Farmers Registered
              </button>
              <button
                onClick={() => setPerformanceView('procurement')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all h-10 w-full sm:w-auto"
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: performanceView === 'procurement' ? '#FFFFFF' : '#027F83',
                  backgroundColor: performanceView === 'procurement' ? '#027F83' : '#FFFFFF',
                  border: '1px solid #027F83'
                }}
                onMouseEnter={(e) => {
                  if (performanceView !== 'procurement') {
                    e.currentTarget.style.backgroundColor = '#E6F7F7';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (performanceView !== 'procurement') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Package className="w-4 h-4" />
                Procurement
              </button>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead style={{ backgroundColor: '#F7F9FA' }}>
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      State
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      Procurement (MT)
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden md:table-cell" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      Branch Manager
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden lg:table-cell" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      SLA
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden lg:table-cell" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      SLA Admin
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden xl:table-cell" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      PACS
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left hidden xl:table-cell" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                      PACS Admin
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topStates.map((state, index) => (
                    <tr key={index} className="border-t transition-colors hover:bg-gray-50" style={{ borderColor: '#E5EBEF' }}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4" style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>
                        {state.state}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4" style={{ fontSize: '16px', fontWeight: '700', color: '#315B78' }}>
                        {state.procurement}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell" style={{ fontSize: '14px', color: '#315B78' }}>
                        {state.branchManager}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell" style={{ fontSize: '14px', color: '#315B78' }}>
                        {state.sla}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell" style={{ fontSize: '14px', color: '#315B78' }}>
                        {state.slaAdmin}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden xl:table-cell" style={{ fontSize: '14px', color: '#315B78', maxWidth: '250px' }}>
                        {state.pacs}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden xl:table-cell" style={{ fontSize: '14px', color: '#315B78' }}>
                        {state.pacsAdmin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* State-Wise Map View */}
      {visibleSections.mapView && (
        <div
          className="rounded-xl overflow-hidden border"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
        >
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" style={{ color: '#027F83' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                State-Wise Details in Map View
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => setMapView('farmers')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all h-10 w-full sm:w-auto"
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: mapView === 'farmers' ? '#FFFFFF' : '#027F83',
                  backgroundColor: mapView === 'farmers' ? '#027F83' : '#FFFFFF',
                  border: '1px solid #027F83'
                }}
                onMouseEnter={(e) => {
                  if (mapView !== 'farmers') {
                    e.currentTarget.style.backgroundColor = '#E6F7F7';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (mapView !== 'farmers') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Users className="w-4 h-4" />
                Farmers Registered
              </button>
              <button
                onClick={() => setMapView('procurement')}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all h-10 w-full sm:w-auto"
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: mapView === 'procurement' ? '#FFFFFF' : '#027F83',
                  backgroundColor: mapView === 'procurement' ? '#027F83' : '#FFFFFF',
                  border: '1px solid #027F83'
                }}
                onMouseEnter={(e) => {
                  if (mapView !== 'procurement') {
                    e.currentTarget.style.backgroundColor = '#E6F7F7';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (mapView !== 'procurement') {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <Package className="w-4 h-4" />
                Procurement
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Map Placeholder */}
            <div className="flex-1 flex items-center justify-center rounded-xl" style={{ minHeight: '300px', maxHeight: '450px' }}>
              <IndiaMap stateData={mapStateData} viewType={mapView} onStateClick={handleStateClick} />
            </div>

            {/* Legend & Top States */}
            <div className="w-full lg:w-72 flex flex-col gap-4 sm:gap-6">
              <div className="p-6 rounded-xl border" style={{ backgroundColor: '#F7F9FA', borderColor: '#E5EBEF' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#222', marginBottom: '16px' }}>
                  Map Legend
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#027F83' }} />
                    <div className="flex-1">
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>High Performance</p>
                      <p style={{ fontSize: '11px', color: '#666' }}>&gt; 200 MT</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#6B46C1' }} />
                    <div className="flex-1">
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>Medium Performance</p>
                      <p style={{ fontSize: '11px', color: '#666' }}>100-200 MT</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#E5EBEF' }} />
                    <div className="flex-1">
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#222' }}>Low Performance</p>
                      <p style={{ fontSize: '11px', color: '#666' }}>&lt; 100 MT</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border" style={{ backgroundColor: '#F7F9FA', borderColor: '#E5EBEF' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#222', marginBottom: '16px' }}>
                  Top Performers
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#027F83' }} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>Maharashtra</span>
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: '#027F83' }}>1555.4 MT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}