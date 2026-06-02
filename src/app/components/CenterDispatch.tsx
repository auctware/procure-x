import React, { useState, useRef, useEffect } from 'react';
import { Home, ChevronRight, RotateCcw, Search, Calendar, Menu, Plus, Filter, X, Edit2, Trash2, MoreVertical, Mic, Truck, FileText, Check, Download, Eye, Printer, FileCheck } from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Dispatch {
  id: string;
  dispatchId: string;
  state: string;
  sourceName: string;
  destinationName: string;
  sourceType: string;
  destinationType: string;
  commodity: string;
  season: string;
  dispatchQuantity: number;
  dispatchBags: number;
  replacedQuantity: number;
  replacedBags: number;
  status: 'Pending' | 'In Transit' | 'Delivered';
  packageType: string;
  vehicleNumber: string;
  referenceNumber: string;
  arrivalTransactionNumber: string;
  totalValue: number;
  dispatchDate: string;
  praveshParchi9R: string;
  praveshParchi2nd: string;
}

export default function CenterDispatch() {
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  // Create Dispatch Form Data
  const [createFormData, setCreateFormData] = useState({
    yearSeason: '2025 - Kharif',
    scheme: 'MAIZE FOR ETHA...',
    state: 'Maharashtra',
    commodity: 'MAIZE',
    center: '',
    warehouse: '',
    vehicleNumber: '',
    deliveryChallanNumber: '',
    actualQuantity: '',
    actualBags: '',
    replaceQuantity: '',
    replaceBags: ''
  });

  // View Dispatch State
  const [searchQuery, setSearchQuery] = useState('');
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState({
    status: 'All',
    state: 'All',
    yearSeason: 'All',
    scheme: 'All',
    commodity: 'All',
    center: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Dropdown states for Create Dispatch
  const [yearSeasonDropdownOpen, setYearSeasonDropdownOpen] = useState(false);
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [warehouseDropdownOpen, setWarehouseDropdownOpen] = useState(false);

  // Dropdown states for Filters
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterStateDropdownOpen, setFilterStateDropdownOpen] = useState(false);
  const [filterYearSeasonDropdownOpen, setFilterYearSeasonDropdownOpen] = useState(false);
  const [filterSchemeDropdownOpen, setFilterSchemeDropdownOpen] = useState(false);
  const [filterCommodityDropdownOpen, setFilterCommodityDropdownOpen] = useState(false);
  const [filterCenterDropdownOpen, setFilterCenterDropdownOpen] = useState(false);

  // Refs for dropdowns
  const yearSeasonRef = useRef<HTMLDivElement | null>(null);
  const schemeRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<HTMLDivElement | null>(null);
  const commodityRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const warehouseRef = useRef<HTMLDivElement | null>(null);
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterStateRef = useRef<HTMLDivElement | null>(null);
  const filterYearSeasonRef = useRef<HTMLDivElement | null>(null);
  const filterSchemeRef = useRef<HTMLDivElement | null>(null);
  const filterCommodityRef = useRef<HTMLDivElement | null>(null);
  const filterCenterRef = useRef<HTMLDivElement | null>(null);

  // Options
  const yearSeasonOptions = [
    { value: '2025 - Kharif', label: '2025 - Kharif' },
    { value: '2024 - Rabi', label: '2024 - Rabi' },
    { value: '2024 - Kharif', label: '2024 - Kharif' }
  ];

  const schemeOptions = [
    { value: 'MAIZE FOR ETHA...', label: 'MAIZE FOR ETHANOL KHARIF 2025' },
    { value: 'PSS GREEN GRAM', label: 'PSS GREEN GRAM MOONG PROCUREMENT KHARIF 2025' }
  ];

  const stateOptions = [
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Gujarat', label: 'Gujarat' }
  ];

  const commodityOptions = [
    { value: 'MAIZE', label: 'MAIZE' },
    { value: 'Wheat', label: 'Wheat' },
    { value: 'Rice', label: 'Rice' }
  ];

  const centerOptions = [
    { value: '', label: 'Select Center' },
    { value: 'center1', label: 'Main Procurement Center' },
    { value: 'center2', label: 'North Zone Center' },
    { value: 'center3', label: 'South Zone Center' }
  ];

  const warehouseOptions = [
    { value: '', label: 'Select Warehouse' },
    { value: 'wh1', label: 'Warehouse 1' },
    { value: 'wh2', label: 'Warehouse 2' },
    { value: 'wh3', label: 'Warehouse 3' }
  ];

  // Mock dispatch data
  const [dispatches, setDispatches] = useState<Dispatch[]>([
    {
      id: '1',
      dispatchId: 'DISP001',
      state: 'Maharashtra',
      sourceName: 'Main Procurement Center',
      destinationName: 'Warehouse 1',
      sourceType: 'Center',
      destinationType: 'Warehouse',
      commodity: 'MAIZE',
      season: '2025 - Kharif',
      dispatchQuantity: 100,
      dispatchBags: 200,
      replacedQuantity: 100,
      replacedBags: 200,
      status: 'In Transit',
      packageType: '50 KG',
      vehicleNumber: 'KA-01-AB-1234',
      referenceNumber: 'REF001',
      arrivalTransactionNumber: 'ATN001',
      totalValue: 225000,
      dispatchDate: '2025-01-10',
      praveshParchi9R: 'PP9R001',
      praveshParchi2nd: 'PP2ND001'
    },
    {
      id: '2',
      dispatchId: 'DISP002',
      state: 'Maharashtra',
      sourceName: 'North Zone Center',
      destinationName: 'Warehouse 2',
      sourceType: 'Center',
      destinationType: 'Warehouse',
      commodity: 'MAIZE',
      season: '2025 - Kharif',
      dispatchQuantity: 150,
      dispatchBags: 300,
      replacedQuantity: 150,
      replacedBags: 300,
      status: 'Delivered',
      packageType: '50 KG',
      vehicleNumber: 'MH-12-CD-5678',
      referenceNumber: 'REF002',
      arrivalTransactionNumber: 'ATN002',
      totalValue: 337500,
      dispatchDate: '2025-01-08',
      praveshParchi9R: 'PP9R002',
      praveshParchi2nd: 'PP2ND002'
    },
    {
      id: '3',
      dispatchId: 'DISP003',
      state: 'Gujarat',
      sourceName: 'South Zone Center',
      destinationName: 'Warehouse 3',
      sourceType: 'Center',
      destinationType: 'Warehouse',
      commodity: 'Wheat',
      season: '2025 - Kharif',
      dispatchQuantity: 200,
      dispatchBags: 400,
      replacedQuantity: 200,
      replacedBags: 400,
      status: 'Pending',
      packageType: '50 KG',
      vehicleNumber: 'GJ-05-EF-9012',
      referenceNumber: 'REF003',
      arrivalTransactionNumber: 'ATN003',
      totalValue: 450000,
      dispatchDate: '2025-01-12',
      praveshParchi9R: 'PP9R003',
      praveshParchi2nd: 'PP2ND003'
    }
  ]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveActionMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const refs = [
        yearSeasonRef, schemeRef, stateRef, commodityRef, centerRef, warehouseRef,
        filterStatusRef, filterStateRef, filterYearSeasonRef, filterSchemeRef,
        filterCommodityRef, filterCenterRef
      ];

      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === yearSeasonRef) setYearSeasonDropdownOpen(false);
          if (ref === schemeRef) setSchemeDropdownOpen(false);
          if (ref === stateRef) setStateDropdownOpen(false);
          if (ref === commodityRef) setCommodityDropdownOpen(false);
          if (ref === centerRef) setCenterDropdownOpen(false);
          if (ref === warehouseRef) setWarehouseDropdownOpen(false);
          if (ref === filterStatusRef) setFilterStatusDropdownOpen(false);
          if (ref === filterStateRef) setFilterStateDropdownOpen(false);
          if (ref === filterYearSeasonRef) setFilterYearSeasonDropdownOpen(false);
          if (ref === filterSchemeRef) setFilterSchemeDropdownOpen(false);
          if (ref === filterCommodityRef) setFilterCommodityDropdownOpen(false);
          if (ref === filterCenterRef) setFilterCenterDropdownOpen(false);
        }
      });
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NLP Search Logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      if (query.includes('pending') || query.includes('transit') || query.includes('delivered')) {
        setNlpSuggestion('Filtering by status');
      } else if (query.includes('Maharashtra') || query.includes('maharashtra') || query.includes('gujarat')) {
        setNlpSuggestion('Searching by state');
      } else if (query.match(/disp\d+/i) || query.includes('dispatch')) {
        setNlpSuggestion('Searching by dispatch ID');
      } else {
        setNlpSuggestion('Searching dispatches');
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

  // Apply Filters
  const filteredDispatches = dispatches.filter(dispatch => {
    // NLP Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        dispatch.dispatchId.toLowerCase().includes(query) ||
        dispatch.state.toLowerCase().includes(query) ||
        dispatch.sourceName.toLowerCase().includes(query) ||
        dispatch.destinationName.toLowerCase().includes(query) ||
        dispatch.vehicleNumber.toLowerCase().includes(query) ||
        dispatch.referenceNumber.toLowerCase().includes(query) ||
        dispatch.status.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Status Filter
    if (filters.status !== 'All' && dispatch.status !== filters.status) return false;

    // State Filter
    if (filters.state !== 'All' && dispatch.state !== filters.state) return false;

    // Year Season Filter
    if (filters.yearSeason !== 'All' && dispatch.season !== filters.yearSeason) return false;


    // Commodity Filter
    if (filters.commodity !== 'All' && dispatch.commodity !== filters.commodity) return false;

    // Center Filter
    if (filters.center !== 'All' && dispatch.sourceName !== filters.center) return false;

    // Date Range Filter
    if (filters.dateFrom && dispatch.dispatchDate < filters.dateFrom) return false;
    if (filters.dateTo && dispatch.dispatchDate > filters.dateTo) return false;

    return true;
  });

  const activeFilterCount = [
    filters.status !== 'All',
    filters.state !== 'All',
    filters.yearSeason !== 'All',
    filters.scheme !== 'All',
    filters.commodity !== 'All',
    filters.center !== 'All',
    filters.dateFrom !== '',
    filters.dateTo !== ''
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      status: 'All',
      state: 'All',
      yearSeason: 'All',
      scheme: 'All',
      commodity: 'All',
      center: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleCreateReset = () => {
    setCreateFormData({
      yearSeason: '2025 - Kharif',
      scheme: 'MAIZE FOR ETHA...',
      state: 'Maharashtra',
      commodity: 'MAIZE',
      center: '',
      warehouse: '',
      vehicleNumber: '',
      deliveryChallanNumber: '',
      actualQuantity: '',
      actualBags: '',
      replaceQuantity: '',
      replaceBags: ''
    });
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Create Dispatch:', createFormData);
    // Handle submission
  };

  const handleEdit = (dispatch: Dispatch) => {
    setActiveActionMenu(null);
    setCreateDrawerOpen(true);
    // Populate form with dispatch data
    setCreateFormData({
      yearSeason: dispatch.season,
      scheme: 'MAIZE FOR ETHA...',
      state: dispatch.state,
      commodity: dispatch.commodity,
      center: dispatch.sourceName,
      warehouse: dispatch.destinationName,
      vehicleNumber: dispatch.vehicleNumber,
      deliveryChallanNumber: dispatch.referenceNumber,
      actualQuantity: dispatch.dispatchQuantity.toString(),
      actualBags: dispatch.dispatchBags.toString(),
      replaceQuantity: dispatch.replacedQuantity.toString(),
      replaceBags: dispatch.replacedBags.toString()
    });
  };

  const handleDelete = (id: string) => {
    setActiveActionMenu(null);
    if (window.confirm('Are you sure you want to delete this dispatch?')) {
      setDispatches(dispatches.filter(d => d.id !== id));
    }
  };

  return (
    <div className="p-8 pb-20" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <button
          onClick={() => {
            console.log('Navigate to home');
          }}
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          Procurement
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#315B78' }}>Center Dispatch</span>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
              <Truck className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                Dispatch Records
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredDispatches.length} of {dispatches.length} dispatches
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
                placeholder="Try: 'pending dispatches', 'Maharashtra', 'DISP001'..."
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
                  className={`w-4 h-4 transition-colors ${isListening ? 'text-white' : isProcessingVoice ? 'text-white' : ''
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
              className="relative h-12 px-4 rounded-lg border transition-all"
              style={{
                borderColor: '#CCD8DF',
                backgroundColor: '#FFFFFF',
                color: '#027F83'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#027F83';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#CCD8DF';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {activeFilterCount > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#027F83',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>
            </button>

            {/* Create Dispatch Button */}
            <button
              onClick={() => {
                handleCreateReset();
                setCreateDrawerOpen(true);
              }}
              className="flex items-center gap-2 h-12 px-5 rounded-lg transition-all"
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
              <Plus className="w-5 h-5" style={{ color: '#027F83' }} />
              Create Dispatch
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Dispatch ID
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  State
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Source Name
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Destination Name
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Source Type
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Destination Type
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Commodity
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Season
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Dispatch Quantity
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Dispatch Bags
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Replaced Quantity
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Replaced Bags
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Status
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Package Type
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Vehicle Number
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Reference Number
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Arrival Transaction Number
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Value
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Dispatch Date
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  9R Pravesh Parchi
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  2nd Pravesh Parchi
                </th>
                <th className="px-4 py-3 text-center whitespace-nowrap" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDispatches.length > 0 ? (
                filteredDispatches.map((dispatch) => (
                  <tr
                    key={dispatch.id}
                    className="border-t transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E5EBEF' }}
                  >
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78', fontWeight: '600' }}>
                      {dispatch.dispatchId}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.state}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.sourceName}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.destinationName}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.sourceType}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.destinationType}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.commodity}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.season}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.dispatchQuantity}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.dispatchBags}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.replacedQuantity}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.replacedBags}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#315B78' }}>
                      <span
                        className="inline-flex items-center gap-2 px-2 py-1"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CCD8DF',
                          borderRadius: '0',
                          color: '#666666',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: dispatch.status === 'Delivered' ? '#00A040' : dispatch.status === 'In Transit' ? '#FFA200' : '#E94545'
                          }}
                        ></div>
                        {dispatch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.packageType}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.vehicleNumber}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.referenceNumber}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.arrivalTransactionNumber}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      ₹{dispatch.totalValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {new Date(dispatch.dispatchDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.praveshParchi9R}
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: '13px', color: '#315B78' }}>
                      {dispatch.praveshParchi2nd}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#315B78' }}>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <button
                          onClick={() => console.log('Download 9R Pravesh Parchi:', dispatch.id)}
                          className="p-1.5 rounded transition-all hover:bg-gray-100"
                          title="Download 9R Pravesh Parchi Document"
                        >
                          <Download className="w-4 h-4" style={{ color: '#027F83' }} />
                        </button>
                        <button
                          onClick={() => console.log('View Dispatched Lot:', dispatch.id)}
                          className="p-1.5 rounded transition-all hover:bg-gray-100"
                          title="View Dispatched Lot"
                        >
                          <Eye className="w-4 h-4" style={{ color: '#027F83' }} />
                        </button>
                        <button
                          onClick={() => console.log('Cancel Dispatch:', dispatch.id)}
                          className="p-1.5 rounded transition-all hover:bg-gray-100"
                          title="Cancel Dispatch"
                        >
                          <X className="w-4 h-4" style={{ color: '#E94545' }} />
                        </button>
                        <button
                          onClick={() => console.log('Print Truck Sheet:', dispatch.id)}
                          className="p-1.5 rounded transition-all hover:bg-gray-100"
                          title="Print Truck Sheet"
                        >
                          <Printer className="w-4 h-4" style={{ color: '#027F83' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={25} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                      <FileText className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      No Dispatches Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Click "Create Dispatch" to add a new dispatch'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dispatch Drawer */}
      {createDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={() => setCreateDrawerOpen(false)}
          />

          <div
            className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
            style={{
              animation: 'slideInRight 0.3s ease-out',
              borderLeft: '1px solid #E5EBEF'
            }}
          >
            <div className="sticky top-0 z-10 px-8 py-6 border-b flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  Create Dispatch
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Fill in the details to create a new dispatch
                </p>
              </div>
              <button
                onClick={() => setCreateDrawerOpen(false)}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
              >
                <X className="w-6 h-6" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="px-8 py-6">
              <form onSubmit={(e) => {
                handleCreateSubmit(e);
                setCreateDrawerOpen(false);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Year Season <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={createFormData.yearSeason}
                      onChange={(value) => setCreateFormData({ ...createFormData, yearSeason: value })}
                      options={yearSeasonOptions}
                      placeholder="Select Year Season"
                      isOpen={yearSeasonDropdownOpen}
                      onToggle={() => setYearSeasonDropdownOpen(!yearSeasonDropdownOpen)}
                      dropdownRef={yearSeasonRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Scheme <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={createFormData.scheme}
                      onChange={(value) => setCreateFormData({ ...createFormData, scheme: value })}
                      options={schemeOptions}
                      placeholder="Select Scheme"
                      isOpen={schemeDropdownOpen}
                      onToggle={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
                      dropdownRef={schemeRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      State <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={createFormData.state}
                      onChange={(value) => setCreateFormData({ ...createFormData, state: value })}
                      options={stateOptions}
                      placeholder="Select State"
                      isOpen={stateDropdownOpen}
                      onToggle={() => setStateDropdownOpen(!stateDropdownOpen)}
                      dropdownRef={stateRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Commodity <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={createFormData.commodity}
                      onChange={(value) => setCreateFormData({ ...createFormData, commodity: value })}
                      options={commodityOptions}
                      placeholder="Select Commodity"
                      isOpen={commodityDropdownOpen}
                      onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                      dropdownRef={commodityRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Center <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={createFormData.center}
                      onChange={(value) => setCreateFormData({ ...createFormData, center: value })}
                      options={centerOptions}
                      placeholder="Select Center"
                      isOpen={centerDropdownOpen}
                      onToggle={() => setCenterDropdownOpen(!centerDropdownOpen)}
                      dropdownRef={centerRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Warehouse <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={createFormData.warehouse}
                      onChange={(value) => setCreateFormData({ ...createFormData, warehouse: value })}
                      options={warehouseOptions}
                      placeholder="Select Warehouse"
                      isOpen={warehouseDropdownOpen}
                      onToggle={() => setWarehouseDropdownOpen(!warehouseDropdownOpen)}
                      dropdownRef={warehouseRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Vehicle Number <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={createFormData.vehicleNumber}
                      onChange={(e) => setCreateFormData({ ...createFormData, vehicleNumber: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Enter vehicle number"
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Delivery Challan Number <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={createFormData.deliveryChallanNumber}
                      onChange={(e) => setCreateFormData({ ...createFormData, deliveryChallanNumber: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Enter challan number"
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Actual Quantity <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={createFormData.actualQuantity}
                      onChange={(e) => setCreateFormData({ ...createFormData, actualQuantity: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Actual Bags <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={createFormData.actualBags}
                      onChange={(e) => setCreateFormData({ ...createFormData, actualBags: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Enter bags"
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Replace Quantity <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={createFormData.replaceQuantity}
                      onChange={(e) => setCreateFormData({ ...createFormData, replaceQuantity: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Replace Bags <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={createFormData.replaceBags}
                      onChange={(e) => setCreateFormData({ ...createFormData, replaceBags: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                      placeholder="Enter bags"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCreateReset}
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#E94545',
                      border: '1px solid #E94545',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF5F5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg transition-all"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#027F83',
                      border: '1px solid #027F83',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E6F7F7';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Check className="w-5 h-5" />
                    Submit
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
                  Filter Dispatches
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
                {/* Status Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Status
                  </label>
                  <CustomDropdown
                    value={filters.status}
                    onChange={(value) => setFilters({ ...filters, status: value })}
                    options={[
                      { value: 'All', label: 'All Status' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'In Transit', label: 'In Transit' },
                      { value: 'Delivered', label: 'Delivered' }
                    ]}
                    isOpen={filterStatusDropdownOpen}
                    onToggle={() => setFilterStatusDropdownOpen(!filterStatusDropdownOpen)}
                    dropdownRef={filterStatusRef}
                  />
                </div>

                {/* State Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    State
                  </label>
                  <CustomDropdown
                    value={filters.state}
                    onChange={(value) => setFilters({ ...filters, state: value })}
                    options={[
                      { value: 'All', label: 'All States' },
                      { value: 'Maharashtra', label: 'Maharashtra' },
                      { value: 'Maharashtra', label: 'Maharashtra' },
                      { value: 'Gujarat', label: 'Gujarat' }
                    ]}
                    isOpen={filterStateDropdownOpen}
                    onToggle={() => setFilterStateDropdownOpen(!filterStateDropdownOpen)}
                    dropdownRef={filterStateRef}
                  />
                </div>

                {/* Year Season Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Year Season
                  </label>
                  <CustomDropdown
                    value={filters.yearSeason}
                    onChange={(value) => setFilters({ ...filters, yearSeason: value })}
                    options={[
                      { value: 'All', label: 'All Seasons' },
                      ...yearSeasonOptions
                    ]}
                    isOpen={filterYearSeasonDropdownOpen}
                    onToggle={() => setFilterYearSeasonDropdownOpen(!filterYearSeasonDropdownOpen)}
                    dropdownRef={filterYearSeasonRef}
                  />
                </div>

                {/* Scheme Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Scheme
                  </label>
                  <CustomDropdown
                    value={filters.scheme}
                    onChange={(value) => setFilters({ ...filters, scheme: value })}
                    options={[
                      { value: 'All', label: 'All Schemes' },
                      ...schemeOptions
                    ]}
                    isOpen={filterSchemeDropdownOpen}
                    onToggle={() => setFilterSchemeDropdownOpen(!filterSchemeDropdownOpen)}
                    dropdownRef={filterSchemeRef}
                  />
                </div>

                {/* Commodity Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Commodity
                  </label>
                  <CustomDropdown
                    value={filters.commodity}
                    onChange={(value) => setFilters({ ...filters, commodity: value })}
                    options={[
                      { value: 'All', label: 'All Commodities' },
                      ...commodityOptions
                    ]}
                    isOpen={filterCommodityDropdownOpen}
                    onToggle={() => setFilterCommodityDropdownOpen(!filterCommodityDropdownOpen)}
                    dropdownRef={filterCommodityRef}
                  />
                </div>

                {/* Center Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Center
                  </label>
                  <CustomDropdown
                    value={filters.center}
                    onChange={(value) => setFilters({ ...filters, center: value })}
                    options={[
                      { value: 'All', label: 'All Centers' },
                      ...centerOptions.filter(opt => opt.value !== '')
                    ]}
                    isOpen={filterCenterDropdownOpen}
                    onToggle={() => setFilterCenterDropdownOpen(!filterCenterDropdownOpen)}
                    dropdownRef={filterCenterRef}
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#777777', marginBottom: '8px', display: 'block' }}>
                    Dispatch Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        placeholder="From Date"
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
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        placeholder="To Date"
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
              </div>

              {/* Filter Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 h-12 rounded-lg transition-all"
                  style={{
                    backgroundColor: '#F7F9FA',
                    border: '1px solid #CCD8DF',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5EBEF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                  }}
                >
                  Clear All
                </button>

                <button
                  onClick={() => {
                    setFilterDrawerOpen(false);
                  }}
                  className="flex-1 h-12 rounded-lg transition-all"
                  style={{
                    backgroundColor: '#027F83',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#026A6E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#027F83';
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
