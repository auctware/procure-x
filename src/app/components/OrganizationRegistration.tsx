import { useState, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import {
  X, Edit2, Trash2, Search, Building2, Phone, Mail, MapPin,
  Camera, Shield, Smartphone, Clock, Plus,
  User, CheckCircle2, FileText, Filter, MoreVertical,
  Home, ChevronRight, Mic
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface Organization {
  id: string;
  userId: string;
  category: string;
  orgName: string;
  nameAsPerAadhaar: string;
  aadhaarNo: string;
  mobileNo: string;
  emailId: string;
  state: string;
  scheme: string;
  address: string;
  registeredDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export default function OrganizationRegistration() {
  // Form State
  const [userIdMode, setUserIdMode] = useState<'mobile' | 'auto'>('mobile');
  const [formData, setFormData] = useState({
    userId: '',
    category: '',
    orgName: '',
    nameAsPerAadhaar: '',
    aadhaarNo: '',
    mobileNo: '',
    emailId: '',
    state: '',
    scheme: '',
    address: ''
  });

  // UI State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [searchQuery, setSearchQuery] = useState('');
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    state: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Dropdown States
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterCategoryDropdownOpen, setFilterCategoryDropdownOpen] = useState(false);
  const [filterStateDropdownOpen, setFilterStateDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef<HTMLDivElement | null>(null);
  const schemeRef = useRef<HTMLDivElement | null>(null);
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterCategoryRef = useRef<HTMLDivElement | null>(null);
  const filterStateRef = useRef<HTMLDivElement | null>(null);

  // Mock data
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      userId: 'ORG001',
      category: 'Farmers Producer Organization',
      orgName: 'Sample Farmers Co-op One',
      nameAsPerAadhaar: 'Person One',
      aadhaarNo: '9000 0000 0001',
      mobileNo: '9000000001',
      emailId: 'person1@dummy.com',
      state: 'Maharashtra',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      address: 'Plot No. 45, Industrial Area, Bangalore, Maharashtra - 560001',
      registeredDate: '2025-01-10',
      status: 'Active'
    },
    {
      id: '2',
      userId: 'ORG002',
      category: 'Self Help Group',
      orgName: 'Sample Women SHG One',
      nameAsPerAadhaar: 'Person Two',
      aadhaarNo: '9000 0000 0002',
      mobileNo: '9000000002',
      emailId: 'person2@dummy.com',
      state: 'Maharashtra',
      scheme: 'PMFBY 2024',
      address: 'House No. 12, Village Road, Pune, Maharashtra - 411001',
      registeredDate: '2025-01-12',
      status: 'Pending'
    },
    {
      id: '3',
      userId: 'ORG003',
      category: 'Cooperative Society',
      orgName: 'Sample Cooperative Ltd One',
      nameAsPerAadhaar: 'Person Three',
      aadhaarNo: '9000 0000 0003',
      mobileNo: '9000000003',
      emailId: 'person3@dummy.com',
      state: 'Tamil Nadu',
      scheme: 'KISAN CREDIT 2025',
      address: 'Street No. 8, Industrial Estate, Chennai, Tamil Nadu - 600001',
      registeredDate: '2025-01-08',
      status: 'Active'
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
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (schemeRef.current && !schemeRef.current.contains(event.target as Node)) {
        setSchemeDropdownOpen(false);
      }
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
      } else if (query.includes('Maharashtra') || query.includes('maharashtra') || query.includes('tamil')) {
        setNlpSuggestion('Searching by state');
      } else if (query.includes('farmer') || query.includes('shg') || query.includes('cooperative')) {
        setNlpSuggestion('Searching by category');
      } else if (query.match(/\d{10}/) || query.match(/\d{4}\s\d{4}/)) {
        setNlpSuggestion('Searching by phone/aadhaar');
      } else if (query.includes('@')) {
        setNlpSuggestion('Searching by email');
      } else {
        setNlpSuggestion('Searching by name or organization');
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

      // Clear processing state after a short delay
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
  const filteredOrgs = organizations.filter(org => {
    // NLP Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        org.orgName.toLowerCase().includes(query) ||
        org.userId.toLowerCase().includes(query) ||
        org.nameAsPerAadhaar.toLowerCase().includes(query) ||
        org.category.toLowerCase().includes(query) ||
        org.state.toLowerCase().includes(query) ||
        org.mobileNo.includes(query) ||
        org.emailId.toLowerCase().includes(query) ||
        org.aadhaarNo.includes(query) ||
        org.status.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Status Filter
    if (filters.status !== 'All' && org.status !== filters.status) return false;

    // Category Filter
    if (filters.category !== 'All' && org.category !== filters.category) return false;

    // State Filter
    if (filters.state !== 'All' && org.state !== filters.state) return false;

    // Date Range Filter
    if (filters.dateFrom && org.registeredDate < filters.dateFrom) return false;
    if (filters.dateTo && org.registeredDate > filters.dateTo) return false;

    return true;
  });

  // OCR Simulation
  const handleAadhaarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    setTimeout(() => {
      setFormData({
        ...formData,
        nameAsPerAadhaar: 'Person Four',
        aadhaarNo: '9000 0000 0002',
        address: 'House No. 23, Village Road, Hubli, Maharashtra - 580020'
      });
      setIsScanning(false);
      setAadhaarVerified(true);
    }, 2000);
  };

  const handleVerifyAadhaar = () => {
    if (formData.aadhaarNo.length >= 12) {
      setIsScanning(true);
      setTimeout(() => {
        setAadhaarVerified(true);
        setIsScanning(false);
      }, 1500);
    }
  };

  const handleVerifyMobile = () => {
    if (formData.mobileNo.length === 10) {
      setShowOtpModal(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const verifyOtp = () => {
    if (otp.join('').length === 6) {
      setMobileVerified(true);
      setShowOtpModal(false);
      setOtp(['', '', '', '', '', '']);
    }
  };

  const generateUserId = () => {
    const id = 'ORG' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setFormData({ ...formData, userId: id });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrg: Organization = {
      id: editingId || (organizations.length + 1).toString(),
      ...formData,
      registeredDate: editingId
        ? organizations.find(o => o.id === editingId)?.registeredDate || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    if (editingId) {
      setOrganizations(organizations.map(org =>
        org.id === editingId ? newOrg : org
      ));
    } else {
      setOrganizations([newOrg, ...organizations]);
    }

    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFormData({
      userId: '',
      category: '',
      orgName: '',
      nameAsPerAadhaar: '',
      aadhaarNo: '',
      mobileNo: '',
      emailId: '',
      state: '',
      scheme: '',
      address: ''
    });
    setAadhaarVerified(false);
    setMobileVerified(false);
  };

  const handleEdit = (org: Organization) => {
    setFormData({
      userId: org.userId,
      category: org.category,
      orgName: org.orgName,
      nameAsPerAadhaar: org.nameAsPerAadhaar,
      aadhaarNo: org.aadhaarNo,
      mobileNo: org.mobileNo,
      emailId: org.emailId,
      state: org.state,
      scheme: org.scheme,
      address: org.address
    });
    setEditingId(org.id);
    setAadhaarVerified(true);
    setMobileVerified(true);
    setDrawerOpen(true);
    setActiveActionMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      setOrganizations(organizations.filter(org => org.id !== id));
      setActiveActionMenu(null);
    }
  };

  const handleAddNew = () => {
    if (userIdMode === 'auto') {
      generateUserId();
    }
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      category: 'All',
      state: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };

  const activeFilterCount = [
    filters.status !== 'All',
    filters.category !== 'All',
    filters.state !== 'All',
    filters.dateFrom !== '',
    filters.dateTo !== ''
  ].filter(Boolean).length;

  return (
    <div className="p-8 pb-20" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
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
        <ChevronRight className="w-4 h-4" />
        <button
          onClick={() => {
            // Navigate to User Registration
            console.log('Navigate to User Registration');
          }}
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          User Registration
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Organization Registration</span>
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
                Registered Organizations
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredOrgs.length} of {organizations.length} organizations
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
                placeholder="Try: 'active organizations', 'Sample farmers'..."
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

            {/* Add Button */}
            <button
              onClick={handleAddNew}
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
              Add Organization
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mobile / Email
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  State
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
              {filteredOrgs.length > 0 ? (
                filteredOrgs.map((org) => (
                  <tr
                    key={org.id}
                    className="border-t transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#E5EBEF' }}
                  >
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#315B78', marginBottom: '2px' }}>
                          {org.orgName}
                        </p>
                        <p style={{ fontSize: '13px', fontWeight: '600', color: '#315B78' }}>
                          {org.userId}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {org.category}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {org.nameAsPerAadhaar}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          Aadhaar: {org.aadhaarNo}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {org.mobileNo}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                          <p style={{ fontSize: '12px', color: '#315B78' }}>
                            {org.emailId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#315B78' }} />
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {org.state}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#315B78' }} />
                        <p style={{ fontSize: '14px', color: '#315B78' }}>
                          {org.registeredDate}
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
                            backgroundColor: org.status === 'Active' ? '#00A040' : org.status === 'Pending' ? '#FFA200' : '#E94545'
                          }}
                        ></div>
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === org.id ? null : org.id);
                            }}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                          </button>

                          {/* Dropdown Menu */}
                          {activeActionMenu === org.id && (
                            <div
                              className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-50 border"
                              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEdit(org)}
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
                                onClick={() => handleDelete(org.id)}
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
                      No Organizations Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Click "Add Organization" to register a new organization'}
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
                  Filter Organizations
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
                    Category
                  </label>
                  <CustomDropdown
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Farmers Producer Organization', label: 'Farmers Producer Organization' },
                      { value: 'Self Help Group', label: 'Self Help Group' },
                      { value: 'Cooperative Society', label: 'Cooperative Society' },
                      { value: 'Private Limited', label: 'Private Limited' }
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
                      { value: 'Tamil Nadu', label: 'Tamil Nadu' },
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
                        onFocus={(e) => {
                          e.target.style.borderColor = '#027F83';
                          e.target.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#CCD8DF';
                          e.target.style.boxShadow = 'none';
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
                        onFocus={(e) => {
                          e.target.style.borderColor = '#027F83';
                          e.target.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#CCD8DF';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t sticky bottom-0 bg-white pb-6" style={{ borderColor: '#E5EBEF' }}>
                <button
                  onClick={() => {
                    setFilterDrawerOpen(false);
                  }}
                  className="flex-1 h-12 rounded-lg transition-all"
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

      {/* Form Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={handleCloseDrawer}
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
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#777777', marginBottom: '4px' }}>
                  {editingId ? 'Edit Organization' : 'Add Organization'}
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {editingId ? 'Update organization details' : 'Fill in the details to register a new organization'}
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
              {/* OCR Upload Section */}
              <div className="mb-8 p-5 rounded-xl border-2 border-dashed" style={{ borderColor: '#027F83', backgroundColor: '#E6F7F7' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleAadhaarUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#027F83' }}>
                    <Camera className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                  </div>
                  <div className="flex-1">
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                      Quick Fill with Aadhaar OCR
                    </h3>
                    <p style={{ fontSize: '13px', color: '#666' }}>
                      Upload Aadhaar card to auto-fill name, number & address
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="h-12 px-5 rounded-lg transition-all flex items-center gap-2"
                    style={{
                      backgroundColor: isScanning ? '#E5EBEF' : '#FFFFFF',
                      color: isScanning ? '#666' : '#027F83',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: isScanning ? 'none' : '1px solid #027F83'
                    }}
                    onMouseEnter={(e) => {
                      if (!isScanning) {
                        e.currentTarget.style.backgroundColor = '#E6F7F7';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isScanning) {
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {isScanning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" style={{ color: '#027F83' }} />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* User ID Mode */}
              <div className="mb-6 flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F7F9FA', border: '2px solid #E5EBEF' }}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={userIdMode === 'mobile'}
                    onChange={() => setUserIdMode('mobile')}
                    style={{ accentColor: '#027F83', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                    Use Mobile as User ID
                  </span>
                </label>
                <div style={{ width: '1px', height: '24px', backgroundColor: '#E5EBEF' }} />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={userIdMode === 'auto'}
                    onChange={() => {
                      setUserIdMode('auto');
                      generateUserId();
                    }}
                    style={{ accentColor: '#027F83', width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                    Auto-Generate User ID
                  </span>
                </label>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Organization Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Organization Details
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Category <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.category}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        options={[
                          { value: '', label: 'Select Category' },
                          { value: 'Farmers Producer Organization', label: 'Farmers Producer Organization' },
                          { value: 'Self Help Group', label: 'Self Help Group' },
                          { value: 'Cooperative Society', label: 'Cooperative Society' },
                          { value: 'Private Limited', label: 'Private Limited' }
                        ]}
                        placeholder="Select Category"
                        isOpen={categoryDropdownOpen}
                        onToggle={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        dropdownRef={categoryRef}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Organization Name <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.orgName}
                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                        placeholder="Enter Organization Name"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
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
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User ID
                      </label>
                      <input
                        type="text"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        readOnly={userIdMode === 'auto'}
                        placeholder={userIdMode === 'auto' ? 'Auto Generated' : 'Enter User ID'}
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          fontSize: '14px',
                          color: userIdMode === 'auto' ? '#027F83' : '#222',
                          fontWeight: '600',
                          backgroundColor: userIdMode === 'auto' ? '#F7F9FA' : '#FFFFFF'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Contact Person
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Name As Per Aadhaar <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nameAsPerAadhaar}
                        onChange={(e) => setFormData({ ...formData, nameAsPerAadhaar: e.target.value })}
                        placeholder="Enter Name"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
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
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Aadhaar Number <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          required
                          value={formData.aadhaarNo}
                          onChange={(e) => setFormData({ ...formData, aadhaarNo: e.target.value })}
                          placeholder="XXXX XXXX XXXX"
                          maxLength={14}
                          className="flex-1 h-12 px-4 rounded-lg border transition-all outline-none"
                          style={{
                            borderColor: '#CCD8DF',
                            color: '#222222',
                            fontSize: '14px',
                            backgroundColor: '#FFFFFF'
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
                          type="button"
                          onClick={handleVerifyAadhaar}
                          disabled={aadhaarVerified || formData.aadhaarNo.length < 12}
                          className="h-12 px-4 rounded-lg transition-all flex items-center gap-2"
                          style={{
                            backgroundColor: aadhaarVerified ? '#00A040' : '#FFFFFF',
                            color: aadhaarVerified ? '#FFFFFF' : '#027F83',
                            fontSize: '13px',
                            fontWeight: '600',
                            minWidth: '100px',
                            border: aadhaarVerified ? 'none' : '1px solid #027F83',
                            opacity: (aadhaarVerified || formData.aadhaarNo.length < 12) ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!aadhaarVerified && !e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#E6F7F7';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!aadhaarVerified && !e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          {aadhaarVerified ? (
                            <>
                              <Shield className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                              Verified
                            </>
                          ) : (
                            <>
                              <Shield className="w-4 h-4" style={{ color: '#027F83' }} />
                              Verify
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Mobile Number <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="tel"
                          required
                          value={formData.mobileNo}
                          onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                          placeholder="10-digit Mobile"
                          maxLength={10}
                          className="flex-1 h-12 px-4 rounded-lg border transition-all outline-none"
                          style={{
                            borderColor: '#CCD8DF',
                            color: '#222222',
                            fontSize: '14px',
                            backgroundColor: '#FFFFFF'
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
                          type="button"
                          onClick={handleVerifyMobile}
                          disabled={mobileVerified || formData.mobileNo.length !== 10}
                          className="h-12 px-4 rounded-lg transition-all flex items-center gap-2"
                          style={{
                            backgroundColor: mobileVerified ? '#00A040' : '#FFFFFF',
                            color: mobileVerified ? '#FFFFFF' : '#027F83',
                            fontSize: '13px',
                            fontWeight: '600',
                            minWidth: '100px',
                            border: mobileVerified ? 'none' : '1px solid #027F83',
                            opacity: (mobileVerified || formData.mobileNo.length !== 10) ? 0.7 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (!mobileVerified && !e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#E6F7F7';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!mobileVerified && !e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.boxShadow = 'none';
                            }
                          }}
                        >
                          {mobileVerified ? (
                            <>
                              <Smartphone className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                              Verified
                            </>
                          ) : (
                            <>
                              <Smartphone className="w-4 h-4" style={{ color: '#027F83' }} />
                              Verify
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Email Address <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.emailId}
                        onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
                        placeholder="Enter Email"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
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
                    </div>
                  </div>
                </div>

                {/* Location & Scheme */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Location & Scheme
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        State <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.state}
                        onChange={(value) => setFormData({ ...formData, state: value })}
                        options={[
                          { value: '', label: 'Select State' },
                          { value: 'Maharashtra', label: 'Maharashtra' },
                          { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                          { value: 'Maharashtra', label: 'Maharashtra' },
                          { value: 'Gujarat', label: 'Gujarat' },
                          { value: 'Rajasthan', label: 'Rajasthan' }
                        ]}
                        placeholder="Select State"
                        isOpen={stateDropdownOpen}
                        onToggle={() => setStateDropdownOpen(!stateDropdownOpen)}
                        dropdownRef={stateRef}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Scheme <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.scheme}
                        onChange={(value) => setFormData({ ...formData, scheme: value })}
                        options={[
                          { value: '', label: 'Select Scheme' },
                          { value: 'MMFT FOR ETHANGK KHARIF 2025', label: 'MMFT FOR ETHANGK KHARIF 2025' },
                          { value: 'PMFBY 2024', label: 'PMFBY 2024' },
                          { value: 'KISAN CREDIT 2025', label: 'KISAN CREDIT 2025' }
                        ]}
                        placeholder="Select Scheme"
                        isOpen={schemeDropdownOpen}
                        onToggle={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
                        dropdownRef={schemeRef}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Full Address <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <textarea
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Complete address with pincode"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#222222',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
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
                    {editingId ? 'Update Organization' : 'Save Organization'}
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

      {/* OTP Modal */}
      {showOtpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 58, 93, 0.7)' }}
          onClick={() => {
            setShowOtpModal(false);
            setOtp(['', '', '', '', '', '']);
          }}
        >
          <div
            className="rounded-2xl p-8 max-w-md w-full"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
                  <Smartphone className="w-6 h-6" style={{ color: '#027F83' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D' }}>
                    Verify Mobile
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                    OTP Verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp(['', '', '', '', '', '']);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#E6F7F7' }}>
              <p style={{ fontSize: '14px', color: '#003A5D', fontWeight: '600', textAlign: 'center' }}>
                Enter 6-digit OTP sent to
              </p>
              <p style={{ fontSize: '18px', color: '#027F83', fontWeight: '700', textAlign: 'center', marginTop: '4px' }}>
                +91 {formData.mobileNo}
              </p>
            </div>

            <div className="flex gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !digit && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                  className="w-full h-14 text-center rounded-xl border-2 transition-all focus:border-[#027F83] focus:outline-none"
                  style={{
                    borderColor: digit ? '#027F83' : '#E5EBEF',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#003A5D',
                    backgroundColor: digit ? '#E6F7F7' : '#FFFFFF'
                  }}
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              disabled={otp.join('').length !== 6}
              className="w-full py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#027F83',
                fontSize: '15px',
                fontWeight: '700',
                border: '1px solid #027F83',
                opacity: otp.join('').length !== 6 ? 0.5 : 1,
                cursor: otp.join('').length !== 6 ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#E6F7F7';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: '#027F83' }} />
              Verify OTP
            </button>

            <button
              className="w-full mt-4 py-2 text-center transition-all hover:underline"
              style={{ color: '#027F83', fontSize: '14px', fontWeight: '600' }}
            >
              Resend OTP
            </button>
          </div>
        </div>
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
