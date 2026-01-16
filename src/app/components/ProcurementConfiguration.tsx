import { useState, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import {
  X, Edit2, Trash2, Search, Settings, Plus,
  User, CheckCircle2, FileText, Filter, MoreVertical,
  Home, ChevronRight, Mic, Building2, Warehouse, MapPin
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface FarmerLimit {
  id: string;
  state: string;
  district: string;
  scheme: string;
  season: string;
  commodity: string;
  perAcreLimit: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

interface CenterLimit {
  id: string;
  centerName: string;
  scheme: string;
  season: string;
  commodity: string;
  dailyLimit: string;
  totalLimit: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

interface StateLimit {
  id: string;
  state: string;
  agency: string;
  scheme: string;
  season: string;
  commodity: string;
  totalLimit: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

export default function ProcurementConfiguration() {
  // Active Tab
  const [activeTab, setActiveTab] = useState<'farmer' | 'center' | 'state'>('farmer');

  // Farmer Limit Form State
  const [farmerLimitFormData, setFarmerLimitFormData] = useState({
    state: '',
    district: '',
    scheme: '',
    season: '',
    commodity: '',
    perAcreLimit: ''
  });

  // Center Limit Form State
  const [centerLimitFormData, setCenterLimitFormData] = useState({
    centerName: '',
    scheme: '',
    season: '',
    commodity: '',
    dailyLimit: '',
    totalLimit: ''
  });

  // State Limit Form State
  const [stateLimitFormData, setStateLimitFormData] = useState({
    state: '',
    agency: '',
    scheme: '',
    season: '',
    commodity: '',
    totalLimit: ''
  });

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState({
    status: 'All',
    state: 'All',
    scheme: 'All'
  });

  // Dropdown States
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);
  const [centerNameDropdownOpen, setCenterNameDropdownOpen] = useState(false);
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterStateDropdownOpen, setFilterStateDropdownOpen] = useState(false);
  const [filterSchemeDropdownOpen, setFilterSchemeDropdownOpen] = useState(false);

  const stateRef = useRef<HTMLDivElement | null>(null);
  const districtRef = useRef<HTMLDivElement | null>(null);
  const schemeRef = useRef<HTMLDivElement | null>(null);
  const seasonRef = useRef<HTMLDivElement | null>(null);
  const commodityRef = useRef<HTMLDivElement | null>(null);
  const centerNameRef = useRef<HTMLDivElement | null>(null);
  const agencyRef = useRef<HTMLDivElement | null>(null);
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterStateRef = useRef<HTMLDivElement | null>(null);
  const filterSchemeRef = useRef<HTMLDivElement | null>(null);

  // Mock Data
  const [farmerLimits, setFarmerLimits] = useState<FarmerLimit[]>([
    {
      id: '1',
      state: 'Karnataka',
      district: 'Bangalore',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      season: 'Kharif',
      commodity: 'Wheat',
      perAcreLimit: '50 QTL',
      createdDate: '2025-01-10',
      status: 'Active'
    }
  ]);

  const [centerLimits, setCenterLimits] = useState<CenterLimit[]>([
    {
      id: '1',
      centerName: 'Bangalore North Center',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      season: 'Kharif',
      commodity: 'Wheat',
      dailyLimit: '1000 QTL',
      totalLimit: '50000 QTL',
      createdDate: '2025-01-10',
      status: 'Active'
    }
  ]);

  const [stateLimits, setStateLimits] = useState<StateLimit[]>([
    {
      id: '1',
      state: 'Karnataka',
      agency: 'AGENCY ONE',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      season: 'Kharif',
      commodity: 'Wheat',
      totalLimit: '100000 QTL',
      createdDate: '2025-01-10',
      status: 'Active'
    }
  ]);

  // NLP Search Logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      if (query.includes('active') || query.includes('inactive')) {
        setNlpSuggestion('Filtering by status');
      } else if (query.includes('karnataka') || query.includes('maharashtra') || query.includes('tamil')) {
        setNlpSuggestion('Searching by state');
      } else if (query.includes('kharif') || query.includes('rabi')) {
        setNlpSuggestion('Searching by season');
      } else if (query.includes('wheat') || query.includes('rice') || query.includes('pulses')) {
        setNlpSuggestion('Searching by commodity');
      } else if (query.match(/\d+/)) {
        setNlpSuggestion('Searching by limit value');
      } else {
        setNlpSuggestion('Searching by scheme or location');
      }
    } else {
      setNlpSuggestion('');
    }
  }, [searchQuery]);

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setIsProcessingVoice(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      setIsProcessingVoice(true);

      setTimeout(() => {
        setIsProcessingVoice(false);
      }, 1000);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessingVoice(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictDropdownOpen(false);
      }
      if (schemeRef.current && !schemeRef.current.contains(event.target as Node)) {
        setSchemeDropdownOpen(false);
      }
      if (seasonRef.current && !seasonRef.current.contains(event.target as Node)) {
        setSeasonDropdownOpen(false);
      }
      if (commodityRef.current && !commodityRef.current.contains(event.target as Node)) {
        setCommodityDropdownOpen(false);
      }
      if (centerNameRef.current && !centerNameRef.current.contains(event.target as Node)) {
        setCenterNameDropdownOpen(false);
      }
      if (agencyRef.current && !agencyRef.current.contains(event.target as Node)) {
        setAgencyDropdownOpen(false);
      }
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusDropdownOpen(false);
      }
      if (filterStateRef.current && !filterStateRef.current.contains(event.target as Node)) {
        setFilterStateDropdownOpen(false);
      }
      if (filterSchemeRef.current && !filterSchemeRef.current.contains(event.target as Node)) {
        setFilterSchemeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Apply Filters
  const getFilteredData = () => {
    if (activeTab === 'farmer') {
      return farmerLimits.filter(item => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            item.state.toLowerCase().includes(query) ||
            item.district.toLowerCase().includes(query) ||
            item.scheme.toLowerCase().includes(query) ||
            item.season.toLowerCase().includes(query) ||
            item.commodity.toLowerCase().includes(query) ||
            item.perAcreLimit.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query);
          
          if (!matchesSearch) return false;
        }

        if (filters.status !== 'All' && item.status !== filters.status) return false;
        if (filters.state !== 'All' && item.state !== filters.state) return false;
        if (filters.scheme !== 'All' && item.scheme !== filters.scheme) return false;

        return true;
      });
    } else if (activeTab === 'center') {
      return centerLimits.filter(item => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            item.centerName.toLowerCase().includes(query) ||
            item.scheme.toLowerCase().includes(query) ||
            item.season.toLowerCase().includes(query) ||
            item.commodity.toLowerCase().includes(query) ||
            item.dailyLimit.toLowerCase().includes(query) ||
            item.totalLimit.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query);
          
          if (!matchesSearch) return false;
        }

        if (filters.status !== 'All' && item.status !== filters.status) return false;
        if (filters.scheme !== 'All' && item.scheme !== filters.scheme) return false;

        return true;
      });
    } else {
      return stateLimits.filter(item => {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesSearch = 
            item.state.toLowerCase().includes(query) ||
            item.agency.toLowerCase().includes(query) ||
            item.scheme.toLowerCase().includes(query) ||
            item.season.toLowerCase().includes(query) ||
            item.commodity.toLowerCase().includes(query) ||
            item.totalLimit.toLowerCase().includes(query) ||
            item.status.toLowerCase().includes(query);
          
          if (!matchesSearch) return false;
        }

        if (filters.status !== 'All' && item.status !== filters.status) return false;
        if (filters.state !== 'All' && item.state !== filters.state) return false;
        if (filters.scheme !== 'All' && item.scheme !== filters.scheme) return false;

        return true;
      });
    }
  };

  const filteredData = getFilteredData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'farmer') {
      const newItem: FarmerLimit = {
        id: editingId || (farmerLimits.length + 1).toString(),
        ...farmerLimitFormData,
        createdDate: editingId 
          ? farmerLimits.find(f => f.id === editingId)?.createdDate || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      if (editingId) {
        setFarmerLimits(farmerLimits.map(item => 
          item.id === editingId ? newItem : item
        ));
      } else {
        setFarmerLimits([newItem, ...farmerLimits]);
      }
    } else if (activeTab === 'center') {
      const newItem: CenterLimit = {
        id: editingId || (centerLimits.length + 1).toString(),
        ...centerLimitFormData,
        createdDate: editingId 
          ? centerLimits.find(c => c.id === editingId)?.createdDate || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      if (editingId) {
        setCenterLimits(centerLimits.map(item => 
          item.id === editingId ? newItem : item
        ));
      } else {
        setCenterLimits([newItem, ...centerLimits]);
      }
    } else {
      const newItem: StateLimit = {
        id: editingId || (stateLimits.length + 1).toString(),
        ...stateLimitFormData,
        createdDate: editingId 
          ? stateLimits.find(s => s.id === editingId)?.createdDate || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      if (editingId) {
        setStateLimits(stateLimits.map(item => 
          item.id === editingId ? newItem : item
        ));
      } else {
        setStateLimits([newItem, ...stateLimits]);
      }
    }

    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFarmerLimitFormData({
      state: '',
      district: '',
      scheme: '',
      season: '',
      commodity: '',
      perAcreLimit: ''
    });
    setCenterLimitFormData({
      centerName: '',
      scheme: '',
      season: '',
      commodity: '',
      dailyLimit: '',
      totalLimit: ''
    });
    setStateLimitFormData({
      state: '',
      agency: '',
      scheme: '',
      season: '',
      commodity: '',
      totalLimit: ''
    });
  };

  const handleEdit = (item: any) => {
    if (activeTab === 'farmer') {
      setFarmerLimitFormData({
        state: item.state,
        district: item.district,
        scheme: item.scheme,
        season: item.season,
        commodity: item.commodity,
        perAcreLimit: item.perAcreLimit
      });
    } else if (activeTab === 'center') {
      setCenterLimitFormData({
        centerName: item.centerName,
        scheme: item.scheme,
        season: item.season,
        commodity: item.commodity,
        dailyLimit: item.dailyLimit,
        totalLimit: item.totalLimit
      });
    } else {
      setStateLimitFormData({
        state: item.state,
        agency: item.agency,
        scheme: item.scheme,
        season: item.season,
        commodity: item.commodity,
        totalLimit: item.totalLimit
      });
    }
    setEditingId(item.id);
    setDrawerOpen(true);
    setActiveActionMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this configuration?')) {
      if (activeTab === 'farmer') {
        setFarmerLimits(farmerLimits.filter(item => item.id !== id));
      } else if (activeTab === 'center') {
        setCenterLimits(centerLimits.filter(item => item.id !== id));
      } else {
        setStateLimits(stateLimits.filter(item => item.id !== id));
      }
      setActiveActionMenu(null);
    }
  };

  const handleAddNew = () => {
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      state: 'All',
      scheme: 'All'
    });
  };

  const activeFilterCount = [
    filters.status !== 'All',
    filters.state !== 'All',
    filters.scheme !== 'All'
  ].filter(Boolean).length;

  const getTotalCount = () => {
    if (activeTab === 'farmer') return farmerLimits.length;
    if (activeTab === 'center') return centerLimits.length;
    return stateLimits.length;
  };

  return (
    <div className="p-8" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <button 
          onClick={() => console.log('Navigate to home')}
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Procurement Configuration</span>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
              <Settings className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                Procurement Configuration
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredData.length} of {getTotalCount()} configurations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* NLP Search */}
            <div className="relative">
              <div 
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: '#F2FCFB' }}
              >
                <Search className="w-4 h-4" style={{ color: '#027F83' }} />
              </div>
              <input
                type="text"
                placeholder="Try: 'active configurations', 'Karnataka wheat'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-14 pr-12 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                  minWidth: '400px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#027F83';
                  e.target.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CCD8DF';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleVoiceSearch}
                disabled={isListening || isProcessingVoice}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-md transition-all disabled:opacity-50"
                style={{
                  backgroundColor: isListening ? '#FF6B6B' : isProcessingVoice ? '#FFA500' : 'transparent'
                }}
                title={isListening ? 'Listening...' : isProcessingVoice ? 'Processing...' : 'Voice search'}
              >
                <Mic
                  className={`w-4 h-4 transition-colors ${
                    isListening ? 'text-white' : isProcessingVoice ? 'text-white' : ''
                  }`}
                  style={{
                    color: isListening ? '#FFFFFF' : isProcessingVoice ? '#FFFFFF' : '#666666'
                  }}
                />
              </button>
              {nlpSuggestion && (
                <div className="absolute top-full left-0 mt-1 px-3 py-1.5 rounded-md" style={{ backgroundColor: '#E6F7F7', fontSize: '12px', fontWeight: '600', color: '#027F83' }}>
                  💡 {nlpSuggestion}
                </div>
              )}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="relative h-12 px-4 rounded-lg border transition-all flex items-center gap-2"
              style={{
                borderColor: '#CCD8DF',
                backgroundColor: '#FFFFFF',
                color: '#027F83'
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#027F83', color: '#FFFFFF' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Add Button */}
            <button
              onClick={handleAddNew}
              className="h-12 px-6 rounded-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #027F83',
                color: '#027F83',
                fontSize: '14px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E6F7F7';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Plus className="w-5 h-5" />
              Add Configuration
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b flex gap-1" style={{ borderColor: '#E5EBEF' }}>
          <button
            onClick={() => setActiveTab('farmer')}
            className="px-4 py-3 border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === 'farmer' ? '#027F83' : 'transparent',
              color: activeTab === 'farmer' ? '#027F83' : '#666',
              fontWeight: activeTab === 'farmer' ? '600' : '500',
              fontSize: '14px'
            }}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Farmer Limit
            </div>
          </button>
          <button
            onClick={() => setActiveTab('center')}
            className="px-4 py-3 border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === 'center' ? '#027F83' : 'transparent',
              color: activeTab === 'center' ? '#027F83' : '#666',
              fontWeight: activeTab === 'center' ? '600' : '500',
              fontSize: '14px'
            }}
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Center Limit
            </div>
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className="px-4 py-3 border-b-2 transition-all"
            style={{
              borderBottomColor: activeTab === 'state' ? '#027F83' : 'transparent',
              color: activeTab === 'state' ? '#027F83' : '#666',
              fontWeight: activeTab === 'state' ? '600' : '500',
              fontSize: '14px'
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              State Limit
            </div>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                {activeTab === 'farmer' && (
                  <>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      State / District
                    </th>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Scheme / Season
                    </th>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Commodity / Limit
                    </th>
                  </>
                )}
                {activeTab === 'center' && (
                  <>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Center Name
                    </th>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Scheme / Season
                    </th>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Commodity / Limits
                    </th>
                  </>
                )}
                {activeTab === 'state' && (
                  <>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      State / Agency
                    </th>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Scheme / Season
                    </th>
                    <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Commodity / Limit
                    </th>
                  </>
                )}
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Created Date
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status
                </th>
                <th className="px-6 py-4 text-center" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item: any) => (
                  <tr 
                    key={item.id}
                    className="border-t transition-colors hover:bg-gray-50" 
                    style={{ borderColor: '#E5EBEF' }}
                  >
                    {activeTab === 'farmer' && (
                      <>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.state}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.district}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.scheme}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.season}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.commodity}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.perAcreLimit}
                            </p>
                          </div>
                        </td>
                      </>
                    )}
                    {activeTab === 'center' && (
                      <>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {item.centerName}
                          </p>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.scheme}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.season}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.commodity}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              Daily: {item.dailyLimit} | Total: {item.totalLimit}
                            </p>
                          </div>
                        </td>
                      </>
                    )}
                    {activeTab === 'state' && (
                      <>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.state}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.agency}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.scheme}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.season}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4" style={{ color: '#315B78' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {item.commodity}
                            </p>
                            <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                              {item.totalLimit}
                            </p>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: '#315B78' }} />
                        <p style={{ fontSize: '14px', color: '#315B78' }}>
                          {item.createdDate}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <span
                        className="px-3 py-1.5 inline-flex items-center gap-2 border"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#666666',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '0'
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: item.status === 'Active' ? '#00A040' : '#E94545'
                          }}
                        ></div>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                            }}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                          </button>

                          {activeActionMenu === item.id && (
                            <div 
                              className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-50 border"
                              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEdit(item)}
                                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                style={{ fontSize: '14px', color: '#222', fontWeight: '500' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#E6F7F7';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Edit2 className="w-4 h-4" style={{ color: '#315B78' }} />
                                Edit
                              </button>
                              <div style={{ height: '1px', backgroundColor: '#E5EBEF' }} />
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                style={{ fontSize: '14px', color: '#E94545', fontWeight: '500' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#FFF5F5';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                      <FileText className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      No Configurations Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Click "Add Configuration" to create a new configuration'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Drawer */}
      {drawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={handleCloseDrawer}
          />

          <div 
            className="fixed top-0 right-0 h-full w-full md:w-[700px] bg-white shadow-2xl z-50 overflow-y-auto"
            style={{ 
              animation: 'slideInRight 0.3s ease-out',
              borderLeft: '1px solid #E5EBEF'
            }}
          >
            <div className="sticky top-0 z-10 px-8 py-6 border-b flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  {editingId ? 'Edit Configuration' : 'Add Configuration'}
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {activeTab === 'farmer' && 'Configure farmer procurement limits'}
                  {activeTab === 'center' && 'Configure center procurement limits'}
                  {activeTab === 'state' && 'Configure state procurement limits'}
                </p>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
              >
                <X className="w-6 h-6" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'farmer' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          State <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={farmerLimitFormData.state}
                          onChange={(value) => setFarmerLimitFormData({ ...farmerLimitFormData, state: value })}
                          options={[
                            { value: '', label: 'Select State' },
                            { value: 'Karnataka', label: 'Karnataka' },
                            { value: 'Maharashtra', label: 'Maharashtra' },
                            { value: 'Tamil Nadu', label: 'Tamil Nadu' }
                          ]}
                          placeholder="Select State"
                          isOpen={stateDropdownOpen}
                          onToggle={() => setStateDropdownOpen(!stateDropdownOpen)}
                          dropdownRef={stateRef}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          District <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={farmerLimitFormData.district}
                          onChange={(value) => setFarmerLimitFormData({ ...farmerLimitFormData, district: value })}
                          options={[
                            { value: '', label: 'Select District' },
                            { value: 'Bangalore', label: 'Bangalore' },
                            { value: 'Mysore', label: 'Mysore' }
                          ]}
                          placeholder="Select District"
                          isOpen={districtDropdownOpen}
                          onToggle={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                          dropdownRef={districtRef}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Scheme <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={farmerLimitFormData.scheme}
                        onChange={(value) => setFarmerLimitFormData({ ...farmerLimitFormData, scheme: value })}
                        options={[
                          { value: '', label: 'Select Scheme' },
                          { value: 'MMFT FOR ETHANGK KHARIF 2025', label: 'MMFT FOR ETHANGK KHARIF 2025' },
                          { value: 'PMFBY 2024', label: 'PMFBY 2024' }
                        ]}
                        placeholder="Select Scheme"
                        isOpen={schemeDropdownOpen}
                        onToggle={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
                        dropdownRef={schemeRef}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Season <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={farmerLimitFormData.season}
                          onChange={(value) => setFarmerLimitFormData({ ...farmerLimitFormData, season: value })}
                          options={[
                            { value: '', label: 'Select Season' },
                            { value: 'Kharif', label: 'Kharif' },
                            { value: 'Rabi', label: 'Rabi' }
                          ]}
                          placeholder="Select Season"
                          isOpen={seasonDropdownOpen}
                          onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                          dropdownRef={seasonRef}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Commodity <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={farmerLimitFormData.commodity}
                          onChange={(value) => setFarmerLimitFormData({ ...farmerLimitFormData, commodity: value })}
                          options={[
                            { value: '', label: 'Select Commodity' },
                            { value: 'Wheat', label: 'Wheat' },
                            { value: 'Rice', label: 'Rice' },
                            { value: 'Pulses', label: 'Pulses' }
                          ]}
                          placeholder="Select Commodity"
                          isOpen={commodityDropdownOpen}
                          onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                          dropdownRef={commodityRef}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Per Acre Limit <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={farmerLimitFormData.perAcreLimit}
                        onChange={(e) => setFarmerLimitFormData({ ...farmerLimitFormData, perAcreLimit: e.target.value })}
                        placeholder="e.g., 50 QTL"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'center' && (
                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Center Name <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={centerLimitFormData.centerName}
                        onChange={(value) => setCenterLimitFormData({ ...centerLimitFormData, centerName: value })}
                        options={[
                          { value: '', label: 'Select Center' },
                          { value: 'Bangalore North Center', label: 'Bangalore North Center' },
                          { value: 'Mysore Central Center', label: 'Mysore Central Center' }
                        ]}
                        placeholder="Select Center"
                        isOpen={centerNameDropdownOpen}
                        onToggle={() => setCenterNameDropdownOpen(!centerNameDropdownOpen)}
                        dropdownRef={centerNameRef}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Scheme <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={centerLimitFormData.scheme}
                        onChange={(value) => setCenterLimitFormData({ ...centerLimitFormData, scheme: value })}
                        options={[
                          { value: '', label: 'Select Scheme' },
                          { value: 'MMFT FOR ETHANGK KHARIF 2025', label: 'MMFT FOR ETHANGK KHARIF 2025' },
                          { value: 'PMFBY 2024', label: 'PMFBY 2024' }
                        ]}
                        placeholder="Select Scheme"
                        isOpen={schemeDropdownOpen}
                        onToggle={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
                        dropdownRef={schemeRef}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Season <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={centerLimitFormData.season}
                          onChange={(value) => setCenterLimitFormData({ ...centerLimitFormData, season: value })}
                          options={[
                            { value: '', label: 'Select Season' },
                            { value: 'Kharif', label: 'Kharif' },
                            { value: 'Rabi', label: 'Rabi' }
                          ]}
                          placeholder="Select Season"
                          isOpen={seasonDropdownOpen}
                          onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                          dropdownRef={seasonRef}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Commodity <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={centerLimitFormData.commodity}
                          onChange={(value) => setCenterLimitFormData({ ...centerLimitFormData, commodity: value })}
                          options={[
                            { value: '', label: 'Select Commodity' },
                            { value: 'Wheat', label: 'Wheat' },
                            { value: 'Rice', label: 'Rice' },
                            { value: 'Pulses', label: 'Pulses' }
                          ]}
                          placeholder="Select Commodity"
                          isOpen={commodityDropdownOpen}
                          onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                          dropdownRef={commodityRef}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Daily Limit <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={centerLimitFormData.dailyLimit}
                          onChange={(e) => setCenterLimitFormData({ ...centerLimitFormData, dailyLimit: e.target.value })}
                          placeholder="e.g., 1000 QTL"
                          className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                          style={{
                            borderColor: '#CCD8DF',
                            color: '#222222',
                            fontSize: '14px',
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Total Limit <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={centerLimitFormData.totalLimit}
                          onChange={(e) => setCenterLimitFormData({ ...centerLimitFormData, totalLimit: e.target.value })}
                          placeholder="e.g., 50000 QTL"
                          className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                          style={{
                            borderColor: '#CCD8DF',
                            color: '#222222',
                            fontSize: '14px',
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'state' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          State <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={stateLimitFormData.state}
                          onChange={(value) => setStateLimitFormData({ ...stateLimitFormData, state: value })}
                          options={[
                            { value: '', label: 'Select State' },
                            { value: 'Karnataka', label: 'Karnataka' },
                            { value: 'Maharashtra', label: 'Maharashtra' },
                            { value: 'Tamil Nadu', label: 'Tamil Nadu' }
                          ]}
                          placeholder="Select State"
                          isOpen={stateDropdownOpen}
                          onToggle={() => setStateDropdownOpen(!stateDropdownOpen)}
                          dropdownRef={stateRef}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Agency <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={stateLimitFormData.agency}
                          onChange={(value) => setStateLimitFormData({ ...stateLimitFormData, agency: value })}
                          options={[
                            { value: '', label: 'Select Agency' },
                            { value: 'AGENCY ONE', label: 'AGENCY ONE' },
                            { value: 'AGENCY TWO', label: 'AGENCY TWO' },
                            { value: 'AGENCY THREE', label: 'AGENCY THREE' }
                          ]}
                          placeholder="Select Agency"
                          isOpen={agencyDropdownOpen}
                          onToggle={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
                          dropdownRef={agencyRef}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Scheme <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={stateLimitFormData.scheme}
                        onChange={(value) => setStateLimitFormData({ ...stateLimitFormData, scheme: value })}
                        options={[
                          { value: '', label: 'Select Scheme' },
                          { value: 'MMFT FOR ETHANGK KHARIF 2025', label: 'MMFT FOR ETHANGK KHARIF 2025' },
                          { value: 'PMFBY 2024', label: 'PMFBY 2024' }
                        ]}
                        placeholder="Select Scheme"
                        isOpen={schemeDropdownOpen}
                        onToggle={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
                        dropdownRef={schemeRef}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Season <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={stateLimitFormData.season}
                          onChange={(value) => setStateLimitFormData({ ...stateLimitFormData, season: value })}
                          options={[
                            { value: '', label: 'Select Season' },
                            { value: 'Kharif', label: 'Kharif' },
                            { value: 'Rabi', label: 'Rabi' }
                          ]}
                          placeholder="Select Season"
                          isOpen={seasonDropdownOpen}
                          onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                          dropdownRef={seasonRef}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Commodity <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={stateLimitFormData.commodity}
                          onChange={(value) => setStateLimitFormData({ ...stateLimitFormData, commodity: value })}
                          options={[
                            { value: '', label: 'Select Commodity' },
                            { value: 'Wheat', label: 'Wheat' },
                            { value: 'Rice', label: 'Rice' },
                            { value: 'Pulses', label: 'Pulses' }
                          ]}
                          placeholder="Select Commodity"
                          isOpen={commodityDropdownOpen}
                          onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                          dropdownRef={commodityRef}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Total Limit <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={stateLimitFormData.totalLimit}
                        onChange={(e) => setStateLimitFormData({ ...stateLimitFormData, totalLimit: e.target.value })}
                        placeholder="e.g., 100000 QTL"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t sticky bottom-0 bg-white pb-6" style={{ borderColor: '#E5EBEF' }}>
                  <button
                    type="submit"
                    className="flex-1 h-12 rounded-lg transition-all flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#027F83',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: '1px solid #027F83'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E6F7F7';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#027F83' }} />
                    {editingId ? 'Update Configuration' : 'Create Configuration'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCloseDrawer}
                    className="px-6 h-12 rounded-lg transition-all"
                    style={{
                      backgroundColor: '#F7F9FA',
                      border: '1px solid #CCD8DF',
                      color: '#666',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Filter Drawer */}
      {filterDrawerOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />

          <div 
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-y-auto"
            style={{ 
              animation: 'slideInRight 0.3s ease-out',
              borderLeft: '1px solid #E5EBEF'
            }}
          >
            <div className="sticky top-0 z-10 px-8 py-6 border-b flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  Filter Configurations
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Apply filters to refine your search
                </p>
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
              >
                <X className="w-6 h-6" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="px-8 py-6">
              <div className="space-y-6">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Status
                  </label>
                  <CustomDropdown
                    value={filters.status}
                    onChange={(value) => setFilters({ ...filters, status: value })}
                    options={[
                      { value: 'All', label: 'All Status' },
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                    isOpen={filterStatusDropdownOpen}
                    onToggle={() => setFilterStatusDropdownOpen(!filterStatusDropdownOpen)}
                    dropdownRef={filterStatusRef}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    State
                  </label>
                  <CustomDropdown
                    value={filters.state}
                    onChange={(value) => setFilters({ ...filters, state: value })}
                    options={[
                      { value: 'All', label: 'All States' },
                      { value: 'Karnataka', label: 'Karnataka' },
                      { value: 'Maharashtra', label: 'Maharashtra' },
                      { value: 'Tamil Nadu', label: 'Tamil Nadu' }
                    ]}
                    isOpen={filterStateDropdownOpen}
                    onToggle={() => setFilterStateDropdownOpen(!filterStateDropdownOpen)}
                    dropdownRef={filterStateRef}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Scheme
                  </label>
                  <CustomDropdown
                    value={filters.scheme}
                    onChange={(value) => setFilters({ ...filters, scheme: value })}
                    options={[
                      { value: 'All', label: 'All Schemes' },
                      { value: 'MMFT FOR ETHANGK KHARIF 2025', label: 'MMFT FOR ETHANGK KHARIF 2025' },
                      { value: 'PMFBY 2024', label: 'PMFBY 2024' }
                    ]}
                    isOpen={filterSchemeDropdownOpen}
                    onToggle={() => setFilterSchemeDropdownOpen(!filterSchemeDropdownOpen)}
                    dropdownRef={filterSchemeRef}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t sticky bottom-0 bg-white pb-6" style={{ borderColor: '#E5EBEF' }}>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="flex-1 h-12 rounded-lg transition-all"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#027F83',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '1px solid #027F83'
                  }}
                >
                  Apply Filters
                </button>
                
                <button
                  onClick={clearFilters}
                  className="px-6 h-12 rounded-lg transition-all"
                  style={{
                    backgroundColor: '#F7F9FA',
                    border: '1px solid #CCD8DF',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
