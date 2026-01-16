import { useState, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import {
  X, Edit2, Trash2, Search, Building2, MapPin,
  Plus, User, CheckCircle2, FileText, Filter, MoreVertical,
  Home, ChevronRight, Navigation, Loader2, Mic
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface Center {
  id: string;
  centerCode: string;
  centerName: string;
  state: string;
  district: string;
  location: string;
  geocode: string;
  latitude: string;
  longitude: string;
  society: string;
  pincode: string;
  authorizedPersonName: string;
  authorizedPersonContact: string;
  authorizedPersonEmail: string;
  address: string;
  registeredDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export default function CreateCenter() {
  // Form State
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    centerName: '',
    centerCode: '',
    location: '',
    geocode: '',
    latitude: '',
    longitude: '',
    society: '',
    pincode: '',
    authorizedPersonName: '',
    authorizedPersonContact: '',
    authorizedPersonEmail: '',
    address: ''
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
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    status: 'All',
    state: 'All',
    district: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Dropdown States
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterStateDropdownOpen, setFilterStateDropdownOpen] = useState(false);
  const [filterDistrictDropdownOpen, setFilterDistrictDropdownOpen] = useState(false);

  const stateRef = useRef<HTMLDivElement | null>(null);
  const districtRef = useRef<HTMLDivElement | null>(null);
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterStateRef = useRef<HTMLDivElement | null>(null);
  const filterDistrictRef = useRef<HTMLDivElement | null>(null);

  // Mock data
  const [centers, setCenters] = useState<Center[]>([
    {
      id: '1',
      centerCode: 'CNT001',
      centerName: 'Bangalore North Center',
      state: 'Karnataka',
      district: 'Bangalore',
      location: 'Industrial Area',
      geocode: '12.9716,77.5946',
      latitude: '12.9716',
      longitude: '77.5946',
      society: 'Sample Farmers Society One',
      pincode: '560001',
      authorizedPersonName: 'Person One',
      authorizedPersonContact: '9000000001',
      authorizedPersonEmail: 'person1@dummy.com',
      address: 'Plot No. 45, Industrial Area, Bangalore',
      registeredDate: '2025-01-10',
      status: 'Active'
    }
  ]);

  // Auto-fill State/District from Pincode
  const fetchLocationFromPincode = async (pincode: string) => {
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setIsFetchingPincode(true);
      // Simulate API call - In real app, use pincode API
      setTimeout(() => {
        // Mock data based on pincode
        const mockData: Record<string, { state: string; district: string }> = {
          '560001': { state: 'Karnataka', district: 'Bangalore' },
          '560002': { state: 'Karnataka', district: 'Bangalore' },
          '411001': { state: 'Maharashtra', district: 'Pune' },
          '600001': { state: 'Tamil Nadu', district: 'Chennai' }
        };
        
        const locationData = mockData[pincode] || { state: '', district: '' };
        setFormData(prev => ({
          ...prev,
          state: locationData.state,
          district: locationData.district
        }));
        setIsFetchingPincode(false);
      }, 800);
    }
  };

  // Get Current Location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toString();
        const lng = position.coords.longitude.toString();
        const geocode = `${lat},${lng}`;
        
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          geocode: geocode
        }));
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter manually.');
        setIsFetchingLocation(false);
      }
    );
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
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusDropdownOpen(false);
      }
      if (filterStateRef.current && !filterStateRef.current.contains(event.target as Node)) {
        setFilterStateDropdownOpen(false);
      }
      if (filterDistrictRef.current && !filterDistrictRef.current.contains(event.target as Node)) {
        setFilterDistrictDropdownOpen(false);
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

  // NLP Search Logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      if (query.includes('active') || query.includes('pending') || query.includes('inactive')) {
        setNlpSuggestion('Filtering by status');
      } else if (query.includes('karnataka') || query.includes('maharashtra') || query.includes('tamil')) {
        setNlpSuggestion('Searching by state');
      } else if (query.includes('bangalore') || query.includes('mysore')) {
        setNlpSuggestion('Searching by district');
      } else if (query.match(/\d{6}/)) {
        setNlpSuggestion('Searching by pincode');
      } else {
        setNlpSuggestion('Searching by center name or code');
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
  const filteredCenters = centers.filter(center => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        center.centerCode.toLowerCase().includes(query) ||
        center.centerName.toLowerCase().includes(query) ||
        center.state.toLowerCase().includes(query) ||
        center.district.toLowerCase().includes(query) ||
        center.pincode.includes(query);
      
      if (!matchesSearch) return false;
    }

    if (filters.status !== 'All' && center.status !== filters.status) return false;
    if (filters.state !== 'All' && center.state !== filters.state) return false;
    if (filters.district !== 'All' && center.district !== filters.district) return false;

    if (filters.dateFrom && center.registeredDate < filters.dateFrom) return false;
    if (filters.dateTo && center.registeredDate > filters.dateTo) return false;

    return true;
  });

  const generateCenterCode = () => {
    const code = 'CNT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setFormData({ ...formData, centerCode: code });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCenter: Center = {
      id: editingId || (centers.length + 1).toString(),
      ...formData,
      registeredDate: editingId 
        ? centers.find(c => c.id === editingId)?.registeredDate || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    if (editingId) {
      setCenters(centers.map(center => 
        center.id === editingId ? newCenter : center
      ));
    } else {
      setCenters([newCenter, ...centers]);
    }

    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFormData({
      state: '',
      district: '',
      centerName: '',
      centerCode: '',
      location: '',
      geocode: '',
      latitude: '',
      longitude: '',
      society: '',
      pincode: '',
      authorizedPersonName: '',
      authorizedPersonContact: '',
      authorizedPersonEmail: '',
      address: ''
    });
  };

  const handleEdit = (center: Center) => {
    setFormData({
      state: center.state,
      district: center.district,
      centerName: center.centerName,
      centerCode: center.centerCode,
      location: center.location,
      geocode: center.geocode,
      latitude: center.latitude,
      longitude: center.longitude,
      society: center.society,
      pincode: center.pincode,
      authorizedPersonName: center.authorizedPersonName,
      authorizedPersonContact: center.authorizedPersonContact,
      authorizedPersonEmail: center.authorizedPersonEmail,
      address: center.address
    });
    setEditingId(center.id);
    setDrawerOpen(true);
    setActiveActionMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this center?')) {
      setCenters(centers.filter(center => center.id !== id));
      setActiveActionMenu(null);
    }
  };

  const handleAddNew = () => {
    generateCenterCode();
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      state: 'All',
      district: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };

  const activeFilterCount = [
    filters.status !== 'All',
    filters.state !== 'All',
    filters.district !== 'All',
    filters.dateFrom !== '',
    filters.dateTo !== ''
  ].filter(Boolean).length;

  return (
    <div className="p-8 pb-20" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
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
        <span style={{ fontWeight: '600', color: '#222' }}>Create Center</span>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
              <Building2 className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                Centers
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredCenters.length} of {centers.length} centers
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
                placeholder="Try: 'active centers', 'Karnataka Bangalore'..."
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
              Add Center
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Center Code / Name
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  State / District
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Location / Pincode
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Authorized Person
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
              {filteredCenters.length > 0 ? (
                filteredCenters.map((center) => (
                  <tr 
                    key={center.id}
                    className="border-t transition-colors hover:bg-gray-50" 
                    style={{ borderColor: '#E5EBEF' }}
                  >
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#315B78', marginBottom: '2px' }}>
                          {center.centerCode}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {center.centerName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {center.state}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {center.district}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {center.location}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {center.pincode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {center.authorizedPersonName}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {center.authorizedPersonContact}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" style={{ color: '#315B78' }} />
                        <p style={{ fontSize: '14px', color: '#315B78' }}>
                          {center.registeredDate}
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
                            backgroundColor: center.status === 'Active' ? '#00A040' : center.status === 'Pending' ? '#FFA200' : '#E94545'
                          }}
                        ></div>
                        {center.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === center.id ? null : center.id);
                            }}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                          </button>

                          {activeActionMenu === center.id && (
                            <div 
                              className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-50 border"
                              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEdit(center)}
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
                                onClick={() => handleDelete(center.id)}
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
                  <td colSpan={7} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                      <FileText className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      No Centers Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Click "Add Center" to create a new center'}
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
                  {editingId ? 'Edit Center' : 'Create Center'}
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {editingId ? 'Update center details' : 'Fill in the details to create a new center'}
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
                {/* Smart Location Section */}
                <div className="mb-6 p-4 rounded-xl border" style={{ backgroundColor: '#F7F9FA', borderColor: '#E5EBEF' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Navigation className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D' }}>
                      Smart Location Fill
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isFetchingLocation}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all"
                      style={{
                        borderColor: '#027F83',
                        backgroundColor: isFetchingLocation ? '#E6F7F7' : '#FFFFFF',
                        color: '#027F83',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      {isFetchingLocation ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          Get Current Location
                        </>
                      )}
                    </button>
                    <div className="text-xs" style={{ color: '#666', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                      Auto-fills: Latitude, Longitude, Geocode
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Pincode <span style={{ color: '#E94545' }}>*</span>
                        {isFetchingPincode && (
                          <span className="ml-2" style={{ fontSize: '11px', color: '#027F83' }}>
                            <Loader2 className="w-3 h-3 inline animate-spin" /> Auto-filling...
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => {
                          const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setFormData({ ...formData, pincode });
                          if (pincode.length === 6) {
                            fetchLocationFromPincode(pincode);
                          }
                        }}
                        placeholder="Enter 6-digit Pincode"
                        maxLength={6}
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                      <p style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                        💡 Auto-fills State & District
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          State <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <CustomDropdown
                          value={formData.state}
                          onChange={(value) => setFormData({ ...formData, state: value })}
                          options={[
                            { value: '', label: 'Select State' },
                            { value: 'Karnataka', label: 'Karnataka' },
                            { value: 'Maharashtra', label: 'Maharashtra' },
                            { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                            { value: 'Gujarat', label: 'Gujarat' }
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
                          value={formData.district}
                          onChange={(value) => setFormData({ ...formData, district: value })}
                          options={[
                            { value: '', label: 'Select District' },
                            { value: 'Bangalore', label: 'Bangalore' },
                            { value: 'Mysore', label: 'Mysore' },
                            { value: 'Hubli', label: 'Hubli' },
                            { value: 'Mangalore', label: 'Mangalore' }
                          ]}
                          placeholder="Select District"
                          isOpen={districtDropdownOpen}
                          onToggle={() => setDistrictDropdownOpen(!districtDropdownOpen)}
                          dropdownRef={districtRef}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Center Name <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.centerName}
                          onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                          placeholder="Enter Center Name"
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
                          Center Code <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.centerCode}
                          onChange={(e) => setFormData({ ...formData, centerCode: e.target.value })}
                          placeholder="Auto Generated"
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

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Location <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Enter Location"
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
                        Society
                      </label>
                      <input
                        type="text"
                        value={formData.society}
                        onChange={(e) => setFormData({ ...formData, society: e.target.value })}
                        placeholder="Enter Society Name"
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

                {/* Location Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Location Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Latitude
                        </label>
                        <input
                          type="text"
                          value={formData.latitude}
                          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                          placeholder="Auto-filled from location"
                          className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                          style={{
                            borderColor: '#CCD8DF',
                            color: formData.latitude ? '#222222' : '#999',
                            fontSize: '14px',
                            backgroundColor: formData.latitude ? '#FFFFFF' : '#F7F9FA'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Longitude
                        </label>
                        <input
                          type="text"
                          value={formData.longitude}
                          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                          placeholder="Auto-filled from location"
                          className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                          style={{
                            borderColor: '#CCD8DF',
                            color: formData.longitude ? '#222222' : '#999',
                            fontSize: '14px',
                            backgroundColor: formData.longitude ? '#FFFFFF' : '#F7F9FA'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Geocode
                      </label>
                      <input
                        type="text"
                        value={formData.geocode}
                        onChange={(e) => setFormData({ ...formData, geocode: e.target.value })}
                        placeholder="Auto-filled from location (lat,lng)"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: formData.geocode ? '#222222' : '#999',
                          fontSize: '14px',
                          backgroundColor: formData.geocode ? '#FFFFFF' : '#F7F9FA'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Address <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Complete address"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none"
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

                {/* Authorized Person */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Authorized Person
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Authorized Person Name <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.authorizedPersonName}
                        onChange={(e) => setFormData({ ...formData, authorizedPersonName: e.target.value })}
                        placeholder="Enter Name"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                          Authorized Person Contact <span style={{ color: '#E94545' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.authorizedPersonContact}
                          onChange={(e) => setFormData({ ...formData, authorizedPersonContact: e.target.value })}
                          placeholder="10-digit Mobile"
                          maxLength={10}
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
                          Authorized Person Email
                        </label>
                        <input
                          type="email"
                          value={formData.authorizedPersonEmail}
                          onChange={(e) => setFormData({ ...formData, authorizedPersonEmail: e.target.value })}
                          placeholder="Enter Email"
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
                    {editingId ? 'Update Center' : 'Create Center'}
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
                  Filter Centers
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
                      { value: 'Pending', label: 'Pending' },
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
                    District
                  </label>
                  <CustomDropdown
                    value={filters.district}
                    onChange={(value) => setFilters({ ...filters, district: value })}
                    options={[
                      { value: 'All', label: 'All Districts' },
                      { value: 'Bangalore', label: 'Bangalore' },
                      { value: 'Mysore', label: 'Mysore' },
                      { value: 'Hubli', label: 'Hubli' }
                    ]}
                    isOpen={filterDistrictDropdownOpen}
                    onToggle={() => setFilterDistrictDropdownOpen(!filterDistrictDropdownOpen)}
                    dropdownRef={filterDistrictRef}
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
