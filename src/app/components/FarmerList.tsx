import { useState, useRef, useEffect } from 'react';
import {
  Search, User, Phone, Mail, MapPin, Calendar, Eye,
  MoreVertical, Filter, Download,
  Home, ChevronRight, Mic, X
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Farmer {
  id: string;
  farmerId: string;
  farmerName: string;
  mobileNumber: string;
  emailId: string;
  aadhaarNumber: string;
  state: string;
  district: string;
  village: string;
  farmerCategory: string;
  landArea: string;
  registeredDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

interface FarmerListProps {
  onViewDetails: (farmerId: string) => void;
}

export default function FarmerList({ onViewDetails }: FarmerListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    state: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Dropdown States
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterCategoryDropdownOpen, setFilterCategoryDropdownOpen] = useState(false);
  const [filterStateDropdownOpen, setFilterStateDropdownOpen] = useState(false);

  // Refs
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterCategoryRef = useRef<HTMLDivElement | null>(null);
  const filterStateRef = useRef<HTMLDivElement | null>(null);

  // Mock farmer data
  const farmers: Farmer[] = [
    {
      id: '1',
      farmerId: 'FARM001',
      farmerName: 'Farmer One',
      mobileNumber: '9000000001',
      emailId: 'farmer1@dummy.com',
      aadhaarNumber: '9000 0000 0001',
      state: 'Maharashtra',
      district: 'Buldhana',
      village: 'Sangrampur',
      farmerCategory: 'Small Farmer',
      landArea: '1.0 Ha',
      registeredDate: '15 Jan 2025',
      status: 'Active'
    },
    {
      id: '2',
      farmerId: 'FARM002',
      farmerName: 'Farmer Two',
      mobileNumber: '9000000002',
      emailId: 'farmer2@dummy.com',
      aadhaarNumber: '9000 0000 0002',
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Pune City',
      farmerCategory: 'Marginal Farmer',
      landArea: '0.5 Ha',
      registeredDate: '14 Jan 2025',
      status: 'Active'
    },
    {
      id: '3',
      farmerId: 'FARM003',
      farmerName: 'Farmer Three',
      mobileNumber: '9000000003',
      emailId: 'farmer3@dummy.com',
      aadhaarNumber: '9000 0000 0003',
      state: 'Maharashtra',
      district: 'Bangalore',
      village: 'Bangalore South',
      farmerCategory: 'Large Farmer',
      landArea: '2.5 Ha',
      registeredDate: '13 Jan 2025',
      status: 'Pending'
    },
    {
      id: '4',
      farmerId: 'FARM004',
      farmerName: 'Farmer Four',
      mobileNumber: '9000000004',
      emailId: 'farmer4@dummy.com',
      aadhaarNumber: '9000 0000 0004',
      state: 'Gujarat',
      district: 'Ahmedabad',
      village: 'Ahmedabad City',
      farmerCategory: 'Small Farmer',
      landArea: '1.2 Ha',
      registeredDate: '12 Jan 2025',
      status: 'Active'
    },
    {
      id: '5',
      farmerId: 'FARM005',
      farmerName: 'Farmer Five',
      mobileNumber: '9000000005',
      emailId: 'farmer5@dummy.com',
      aadhaarNumber: '9000 0000 0005',
      state: 'Maharashtra',
      district: 'Mysore',
      village: 'Mysore City',
      farmerCategory: 'Marginal Farmer',
      landArea: '0.8 Ha',
      registeredDate: '11 Jan 2025',
      status: 'Active'
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusDropdownOpen(false);
      }
      if (filterCategoryRef.current && !filterCategoryRef.current.contains(event.target as Node)) {
        setFilterCategoryDropdownOpen(false);
      }
      if (filterStateRef.current && !filterStateRef.current.contains(event.target as Node)) {
        setFilterStateDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NLP Search Logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (query.includes('active') || query.includes('pending') || query.includes('inactive')) {
        setNlpSuggestion('Filtering by status');
      } else if (query.includes('maharashtra') || query.includes('Maharashtra') || query.includes('gujarat')) {
        setNlpSuggestion('Searching by state');
      } else if (query.includes('small') || query.includes('marginal') || query.includes('large')) {
        setNlpSuggestion('Searching by farmer category');
      } else if (query.match(/\d{10}/) || query.match(/\d{4}\s\d{4}/)) {
        setNlpSuggestion('Searching by phone/aadhaar');
      } else if (query.includes('@')) {
        setNlpSuggestion('Searching by email');
      } else {
        setNlpSuggestion('Searching by name or farmer ID');
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
  const filteredFarmers = farmers.filter(farmer => {
    // NLP Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        farmer.farmerName.toLowerCase().includes(query) ||
        farmer.farmerId.toLowerCase().includes(query) ||
        farmer.mobileNumber.includes(query) ||
        farmer.aadhaarNumber.replace(/\s/g, '').includes(query.replace(/\s/g, '')) ||
        farmer.state.toLowerCase().includes(query) ||
        farmer.district.toLowerCase().includes(query) ||
        farmer.village.toLowerCase().includes(query) ||
        farmer.farmerCategory.toLowerCase().includes(query) ||
        farmer.status.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Status Filter
    if (filters.status !== 'All' && farmer.status !== filters.status) return false;

    // Category Filter
    if (filters.category !== 'All' && farmer.farmerCategory !== filters.category) return false;

    // State Filter
    if (filters.state !== 'All' && farmer.state !== filters.state) return false;

    // Date Range Filter - Skip date comparison for now as format differs
    // if (filters.dateFrom && farmer.registeredDate < filters.dateFrom) return false;
    // if (filters.dateTo && farmer.registeredDate > filters.dateTo) return false;

    return true;
  });

  const activeFilterCount = [
    filters.status !== 'All',
    filters.category !== 'All',
    filters.state !== 'All',
    filters.dateFrom !== '',
    filters.dateTo !== ''
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setFilters({
      status: 'All',
      category: 'All',
      state: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };


  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
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
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => {
            console.log('Navigate to User Registration');
          }}
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          User Registration
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>View Farmer Details</span>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
              <User className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                Registered Farmers
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredFarmers.length} of {farmers.length} farmers
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
                placeholder="Try: 'active farmers', 'Maharashtra farmers'..."
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

            {/* Export Button */}
            <button
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
              <Download className="w-5 h-5" style={{ color: '#027F83' }} />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Farmer ID / Name
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Contact
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Location
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Category / Land
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Registered Date
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
              {filteredFarmers.length > 0 ? (
                filteredFarmers.map((farmer) => {
                  return (
                    <tr
                      key={farmer.id}
                      onClick={() => onViewDetails(farmer.id)}
                      className="border-t transition-colors cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: '#E5EBEF' }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D', marginBottom: '2px' }}>
                            {farmer.farmerId}
                          </p>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {farmer.farmerName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {farmer.mobileNumber}
                            </p>
                          </div>
                          {farmer.emailId && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                              <p style={{ fontSize: '12px', color: '#315B78' }}>
                                {farmer.emailId}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {farmer.district}
                            </p>
                          </div>
                          <p style={{ fontSize: '12px', color: '#315B78' }}>
                            {farmer.village}, {farmer.state}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {farmer.farmerCategory}
                          </p>
                          <p style={{ fontSize: '12px', color: '#315B78' }}>
                            {farmer.landArea}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" style={{ color: '#315B78' }} />
                          <p style={{ fontSize: '14px', color: '#315B78' }}>
                            {farmer.registeredDate}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
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
                              backgroundColor: farmer.status === 'Active' ? '#00A040' : farmer.status === 'Pending' ? '#FFA200' : '#E94545'
                            }}
                          ></div>
                          {farmer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionMenu(activeActionMenu === farmer.id ? null : farmer.id);
                              }}
                              className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            >
                              <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                            </button>

                            {/* Dropdown Menu */}
                            {activeActionMenu === farmer.id && (
                              <div
                                className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-50 border"
                                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onViewDetails(farmer.id);
                                    setActiveActionMenu(null);
                                  }}
                                  className="w-full px-4 py-3 text-left transition-all flex items-center gap-2"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#222',
                                    backgroundColor: '#FFFFFF'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                <button
                                  className="w-full px-4 py-3 text-left transition-all flex items-center gap-2"
                                  style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#222',
                                    backgroundColor: '#FFFFFF'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                      <User className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      No Farmers Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'No farmers registered yet'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  Filter Farmers
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
                      { value: 'Active', label: 'Active' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Inactive', label: 'Inactive' }
                    ]}
                    isOpen={filterStatusDropdownOpen}
                    onToggle={() => setFilterStatusDropdownOpen(!filterStatusDropdownOpen)}
                    dropdownRef={filterStatusRef}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Farmer Category
                  </label>
                  <CustomDropdown
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Small Farmer', label: 'Small Farmer' },
                      { value: 'Marginal Farmer', label: 'Marginal Farmer' },
                      { value: 'Large Farmer', label: 'Large Farmer' }
                    ]}
                    isOpen={filterCategoryDropdownOpen}
                    onToggle={() => setFilterCategoryDropdownOpen(!filterCategoryDropdownOpen)}
                    dropdownRef={filterCategoryRef}
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
                      { value: 'Gujarat', label: 'Gujarat' },
                      { value: 'Rajasthan', label: 'Rajasthan' }
                    ]}
                    isOpen={filterStateDropdownOpen}
                    onToggle={() => setFilterStateDropdownOpen(!filterStateDropdownOpen)}
                    dropdownRef={filterStateRef}
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#777777', marginBottom: '8px', display: 'block' }}>
                    Registration Date Range
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

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#E5EBEF' }}>
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 h-12 rounded-lg transition-all border"
                    style={{
                      borderColor: '#CCD8DF',
                      backgroundColor: '#FFFFFF',
                      color: '#666',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F7F9FA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
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
          </div>
        </>
      )}
    </div>
  );
}
