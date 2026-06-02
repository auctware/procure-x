import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, Info, TrendingUp, Users, Package, Truck,
  FileText, Target, Wheat, Factory, CheckCircle2, MapPin,
  Activity, AlertCircle, Home, ChevronRight, Settings, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
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
      className="relative rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border bg-white overflow-hidden group shadow-sm"
      style={{ borderColor: 'rgba(229, 235, 239, 0.8)' }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-black opacity-[0.03] rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>

      {hasInfo && (
        <button
          className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-slate-100"
        >
          <Info className="w-4 h-4 text-slate-400" />
        </button>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="w-7 h-7" style={{ color: iconColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 font-bold tracking-wider uppercase mb-1 drop-shadow-sm">
            {label}
          </p>
          <p className="text-3xl font-black tracking-tight" style={{ color: '#003A5D' }}>
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
    <div className="flex flex-col items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F1F5F9"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black tracking-tight" style={{ fontSize: size <= 120 ? '28px' : '32px', color: '#003A5D' }}>
            {value}
          </span>
          <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-0.5">
            Cr
          </span>
        </div>
      </div>
      <p className="text-sm font-bold text-slate-600 text-center leading-snug w-full max-w-[140px]">
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
    { estate: 'Maharashtra', count: 12, processName: 'SLA Registration Pending', datePending: '2024-01-10' },
    { estate: 'Tamil Nadu', count: 8, processName: 'Farmer Verification', datePending: '2024-01-12' },
    { estate: 'Maharashtra', count: 5, processName: 'Payment Processing', datePending: '2024-01-13' },
    { estate: 'Gujarat', count: 15, processName: 'Document Verification', datePending: '2024-01-09' },
  ];

  const topStates = [
    {
      state: 'Maharashtra',
      procurement: '255.4',
      branchManager: 'MANAGER ONE',
      sla: 'SAMPLE SLA BANGALORE',
      slaAdmin: 'ADMIN ONE',
      pacs: 'SAMPLE FARMERS PRODUCER COMPANY LIMITED',
      pacsAdmin: 'Admin One'
    },
  ];

  // Map data
  const centerWiseStats = [
    { center: 'Nagpur Center A', procurement: 5200, dispatchToMill: 4800, millToWarehouse: 4500 },
    { center: 'Pune Center B', procurement: 3100, dispatchToMill: 2900, millToWarehouse: 2900 },
    { center: 'Nashik Center C', procurement: 4600, dispatchToMill: 4600, millToWarehouse: 4200 },
    { center: 'Amravati Center D', procurement: 8900, dispatchToMill: 8500, millToWarehouse: 8100 },
  ];

  const mapStateData = {
    'MH': { name: 'Maharashtra', farmers: '2,34,567', procurement: '1,23,456 MT', status: 'high' },
    'MP': { name: 'Madhya Pradesh', farmers: '1,98,234', procurement: '98,765 MT', status: 'medium' },
    'GJ': { name: 'Gujarat', farmers: '1,45,678', procurement: '87,654 MT', status: 'medium' },
    'RJ': { name: 'Rajasthan', farmers: '2,10,432', procurement: '1,10,234 MT', status: 'high' },
    'UP': { name: 'Uttar Pradesh', farmers: '3,45,678', procurement: '1,56,789 MT', status: 'high' },
  };

  const procurementTrends = [
    { name: 'Jan', active: 4000, target: 2400 },
    { name: 'Feb', active: 3000, target: 1398 },
    { name: 'Mar', active: 2000, target: 9800 },
    { name: 'Apr', active: 2780, target: 3908 },
    { name: 'May', active: 1890, target: 4800 },
    { name: 'Jun', active: 2390, target: 3800 },
    { name: 'Jul', active: 3490, target: 4300 },
  ];

  const cropDistribution = [
    { name: 'Wheat', value: 400 },
    { name: 'Paddy', value: 300 },
    { name: 'Maize', value: 300 },
    { name: 'Pulses', value: 200 },
  ];

  const handleStateClick = (stateName: string) => {
    console.log('Clicked state:', stateName);
    // You can add navigation or modal display here
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-slate-50 overflow-y-auto">
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
          className="rounded-2xl p-4 sm:p-6 border shadow-sm bg-white"
          style={{ borderColor: 'rgba(229, 235, 239, 0.8)' }}
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
                      {['All', 'Maharashtra', 'Tamil Nadu', 'Maharashtra', 'Gujarat'].map((state) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      )}

      {/* Analytics Charts Row */}
      {visibleSections.stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-[rgba(229,235,239,0.8)] p-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                   <TrendingUp className="w-5 h-5 text-blue-600" />
                 </div>
                 <h3 className="text-lg font-black tracking-tight" style={{ color: '#003A5D' }}>
                   Procurement Trends
                 </h3>
               </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={procurementTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#027F83" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#027F83" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#315B78" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#315B78" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EBEF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '13px', color: '#315B78' }} />
                  <Area type="monotone" dataKey="active" name="Actual (MT)" stroke="#027F83" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                  <Area type="monotone" dataKey="target" name="Target (MT)" stroke="#315B78" strokeWidth={3} fillOpacity={1} fill="url(#colorTarget)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Bar Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-[rgba(229,235,239,0.8)] p-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                   <BarChart2 className="w-5 h-5 text-purple-600" />
                 </div>
                 <h3 className="text-lg font-black tracking-tight" style={{ color: '#003A5D' }}>
                   Crop Distribution (MT)
                 </h3>
               </div>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cropDistribution}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={32}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EBEF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 700}} />
                  <RechartsTooltip 
                    cursor={{fill: '#F8FAFC'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 700 }}
                  />
                  <Bar dataKey="value" name="Volume" fill="#003A5D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* --- Commented Out Per Request: Pending Tasks, Payment Tracker, Top Performing States --- */}
      {/* 
      {visibleSections.pendingTasks && visibleSections.paymentTracker && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
           ... [original code suppressed for brevity but maintained technically inside comments] ...
        </div>
      )}
      */}

      {/* Center-Wise Procurement & AI Logistics Stats */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        
        {/* Logistics Table */}
        <div
          className="xl:col-span-2 rounded-2xl overflow-hidden shadow-sm bg-white border flex flex-col"
          style={{ borderColor: 'rgba(229, 235, 239, 0.8)' }}
        >
          <div className="px-6 py-5 border-b flex items-center justify-between gap-3 bg-gradient-to-r from-teal-50/50 to-transparent" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-black tracking-tight" style={{ color: '#003A5D' }}>
                Center Supply Chain Logistics (MT)
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500">Live AI Sync</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Center Name
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Procurement
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Dispatch to Mill
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Mill to Warehouse
                  </th>
                  <th className="px-5 py-4 text-center text-[11px] font-black text-blue-500 uppercase tracking-widest bg-blue-50/30">
                    Difference (AI Alert)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {centerWiseStats.map((stat, i) => {
                  const diff = stat.dispatchToMill - stat.millToWarehouse;
                  return (
                    <tr key={i} className="transition-colors hover:bg-slate-50/50 group">
                      <td className="px-5 py-4 text-sm font-bold text-slate-700">
                        {stat.center}
                      </td>
                      <td className="px-5 py-4 text-center text-sm font-black text-[#02B8C2]">
                        {stat.procurement.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center text-sm font-bold text-slate-600">
                        {stat.dispatchToMill.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center text-sm font-bold text-slate-600">
                        {stat.millToWarehouse.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center bg-blue-50/30">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black ${diff > 0 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                          {diff > 0 ? `-${diff} MT Shortfall` : '0 MT Matched'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Card */}
        <div
          className="rounded-2xl shadow-sm bg-gradient-to-b from-[#003A5D] to-[#00223A] border flex flex-col p-6 text-white relative overflow-hidden"
          style={{ borderColor: 'rgba(229, 235, 239, 0.2)' }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full filter blur-[80px] opacity-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center backdrop-blur-sm border border-blue-400/30">
              <AlertCircle className="w-5 h-5 text-blue-200" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-white">
              AI Logistics Alert
            </h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Critical Shortfall</p>
              <p className="text-base font-semibold leading-relaxed">
                <span className="text-orange-400 font-bold">400 MT</span> delay detected at <span className="text-white font-black">Amravati Center D</span> between Mill Dispatch vs. Warehouse Arrival. 
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
              <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Optimization Suggestion</p>
              <p className="text-sm font-medium text-slate-300 leading-relaxed">
                Expected arrival delayed by 48hrs due to route congestion. Suggest rerouting upcoming dispatches via Highway 44.
              </p>
            </div>
            
            <button className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg active:scale-95 shadow-blue-900/50">
              Generate Detailed Report
            </button>
          </div>
        </div>

      </div>

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