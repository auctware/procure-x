import { useState, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
import {
  X, Edit2, Trash2, Search, User, Phone, Mail, MapPin,
  Camera, Shield, Smartphone, Clock, Plus,
  CheckCircle2, FileText, Filter, MoreVertical,
  Home, ChevronRight, Mic
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface User {
  id: string;
  userId: string;
  userCategory: string;
  orgName: string;
  nameAsPerAadhaar: string;
  aadhaarNo: string;
  mobileNo: string;
  emailId: string;
  scheme: string;
  address: string;
  registeredDate: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

export default function UserRegistration() {
  // Form State
  const [formData, setFormData] = useState({
    userIdMode: 'mobile' as 'mobile' | 'auto',
    category: '',
    organizationName: '',
    userRole: '',
    userId: '',
    userName: '',
    mobileNo: '',
    state: '',
    district: '',
    taluka: '',
    emailId: '',
    address: '',
    maker: false,
    checker: false
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
    scheme: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Dropdown States
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [organizationDropdownOpen, setOrganizationDropdownOpen] = useState(false);
  const [userRoleDropdownOpen, setUserRoleDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [talukaDropdownOpen, setTalukaDropdownOpen] = useState(false);
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterCategoryDropdownOpen, setFilterCategoryDropdownOpen] = useState(false);
  const [filterSchemeDropdownOpen, setFilterSchemeDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const categoryRef = useRef<HTMLDivElement>(null);
  const organizationRef = useRef<HTMLDivElement>(null);
  const userRoleRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);
  const talukaRef = useRef<HTMLDivElement>(null);
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterCategoryRef = useRef<HTMLDivElement | null>(null);
  const filterSchemeRef = useRef<HTMLDivElement | null>(null);

  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      userId: 'USR001',
      userCategory: 'SLA Admin',
      orgName: 'Sample Farmers Co-op One',
      nameAsPerAadhaar: 'User One',
      aadhaarNo: '9000 0000 0001',
      mobileNo: '9000000001',
      emailId: 'user1@dummy.com',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      address: 'Plot No. 45, Industrial Area, Bangalore, Karnataka - 560001',
      registeredDate: '2025-01-10',
      status: 'Active'
    },
    {
      id: '2',
      userId: 'USR002',
      userCategory: 'PACS Admin',
      orgName: 'Sample Women SHG One',
      nameAsPerAadhaar: 'User Two',
      aadhaarNo: '9000 0000 0002',
      mobileNo: '9000000002',
      emailId: 'user2@dummy.com',
      scheme: 'PMFBY 2024',
      address: 'House No. 12, Village Road, Pune, Maharashtra - 411001',
      registeredDate: '2025-01-12',
      status: 'Pending'
    },
    {
      id: '3',
      userId: 'USR003',
      userCategory: 'Branch Manager',
      orgName: 'Sample Cooperative Ltd One',
      nameAsPerAadhaar: 'User Three',
      aadhaarNo: '9000 0000 0003',
      mobileNo: '9000000003',
      emailId: 'user3@dummy.com',
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
      if (organizationRef.current && !organizationRef.current.contains(event.target as Node)) {
        setOrganizationDropdownOpen(false);
      }
      if (userRoleRef.current && !userRoleRef.current.contains(event.target as Node)) {
        setUserRoleDropdownOpen(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateDropdownOpen(false);
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictDropdownOpen(false);
      }
      if (talukaRef.current && !talukaRef.current.contains(event.target as Node)) {
        setTalukaDropdownOpen(false);
      }
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusDropdownOpen(false);
      }
      if (filterCategoryRef.current && !filterCategoryRef.current.contains(event.target as Node)) {
        setFilterCategoryDropdownOpen(false);
      }
      if (filterSchemeRef.current && !filterSchemeRef.current.contains(event.target as Node)) {
        setFilterSchemeDropdownOpen(false);
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
      } else if (query.includes('sla') || query.includes('pacs') || query.includes('branch')) {
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
  const filteredUsers = users.filter(user => {
    // NLP Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.userId.toLowerCase().includes(query) ||
        user.nameAsPerAadhaar.toLowerCase().includes(query) ||
        user.orgName.toLowerCase().includes(query) ||
        user.userCategory.toLowerCase().includes(query) ||
        user.mobileNo.includes(query) ||
        user.emailId.toLowerCase().includes(query) ||
        user.aadhaarNo.includes(query) ||
        user.status.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Status Filter
    if (filters.status !== 'All' && user.status !== filters.status) return false;

    // Category Filter
    if (filters.category !== 'All' && user.userCategory !== filters.category) return false;

    // Scheme Filter
    if (filters.scheme !== 'All' && user.scheme !== filters.scheme) return false;

    // Date Range Filter
    if (filters.dateFrom && user.registeredDate < filters.dateFrom) return false;
    if (filters.dateTo && user.registeredDate > filters.dateTo) return false;

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
        userName: 'User Four',
        address: 'House No. 23, Village Road, Hubli, Karnataka - 580020'
      });
      setIsScanning(false);
      setAadhaarVerified(true);
    }, 2000);
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
    const id = 'USR' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setFormData({ ...formData, userId: id });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map new form structure to old User interface for backward compatibility
    const newUser: User = {
      id: editingId || (users.length + 1).toString(),
      userId: formData.userId,
      userCategory: formData.category,
      orgName: formData.organizationName,
      nameAsPerAadhaar: formData.userName,
      aadhaarNo: '',
      mobileNo: formData.mobileNo,
      emailId: formData.emailId,
      scheme: '',
      address: formData.address,
      registeredDate: editingId 
        ? users.find(u => u.id === editingId)?.registeredDate || new Date().toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    if (editingId) {
      setUsers(users.map(user => 
        user.id === editingId ? newUser : user
      ));
    } else {
      setUsers([newUser, ...users]);
    }

    handleCloseDrawer();
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    setFormData({
      userIdMode: 'mobile',
      category: '',
      organizationName: '',
      userRole: '',
      userId: '',
      userName: '',
      mobileNo: '',
      state: '',
      district: '',
      taluka: '',
      emailId: '',
      address: '',
      maker: false,
      checker: false
    });
    setAadhaarVerified(false);
    setMobileVerified(false);
  };

  const handleEdit = (user: User) => {
    setFormData({
      userIdMode: 'mobile',
      category: user.userCategory || '',
      organizationName: user.orgName || '',
      userRole: '',
      userId: user.userId || '',
      userName: user.nameAsPerAadhaar || '',
      mobileNo: user.mobileNo || '',
      state: '',
      district: '',
      taluka: '',
      emailId: user.emailId || '',
      address: user.address || '',
      maker: false,
      checker: false
    });
    setEditingId(user.id);
    setAadhaarVerified(true);
    setMobileVerified(true);
    setDrawerOpen(true);
    setActiveActionMenu(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== id));
      setActiveActionMenu(null);
    }
  };

  const handleAddNew = () => {
    generateUserId();
    setDrawerOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      category: 'All',
      scheme: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };

  const activeFilterCount = [
    filters.status !== 'All',
    filters.category !== 'All',
    filters.scheme !== 'All',
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
        <span style={{ fontWeight: '600', color: '#222' }}>User Registration</span>
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
                Registered Users
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredUsers.length} of {users.length} users
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
                placeholder="Try: 'active users', 'SLA admin'..."
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
              Add User
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  User Id / Category
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  User Name / Organization
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mobile No / Email Id
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  State / District
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id}
                    className="border-t transition-colors hover:bg-gray-50" 
                    style={{ borderColor: '#E5EBEF' }}
                  >
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#315B78', marginBottom: '2px' }}>
                          {user.userId}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {user.userCategory}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                          {user.nameAsPerAadhaar}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {user.orgName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Phone className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {user.mobileNo}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                          <p style={{ fontSize: '12px', color: '#315B78' }}>
                            {user.emailId || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78', marginBottom: '2px' }}>
                          {'—'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#315B78', marginTop: '2px' }}>
                          {'—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: '#315B78' }} />
                        <p style={{ fontSize: '14px', color: '#315B78' }}>
                          {user.registeredDate}
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
                            backgroundColor: user.status === 'Active' ? '#00A040' : user.status === 'Pending' ? '#FFA200' : '#E94545'
                          }}
                        ></div>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" style={{ color: '#315B78' }}>
                      <div className="flex items-center justify-center">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === user.id ? null : user.id);
                            }}
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                          >
                            <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                          </button>

                          {/* Dropdown Menu */}
                          {activeActionMenu === user.id && (
                            <div 
                              className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl overflow-hidden z-50 border"
                              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEdit(user)}
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
                                onClick={() => handleDelete(user.id)}
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
                      No Users Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Click "Add User" to register a new user'}
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
                  Filter Users
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
                    User Category
                  </label>
                  <CustomDropdown
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'SLA Admin', label: 'SLA Admin' },
                      { value: 'PACS Admin', label: 'PACS Admin' },
                      { value: 'Branch Manager', label: 'Branch Manager' }
                    ]}
                    isOpen={filterCategoryDropdownOpen}
                    onToggle={() => setFilterCategoryDropdownOpen(!filterCategoryDropdownOpen)}
                    dropdownRef={filterCategoryRef}
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
                      { value: 'MMFT FOR ETHANGK KHARIF 2025', label: 'MMFT FOR ETHANGK KHARIF 2025' },
                      { value: 'PMFBY 2024', label: 'PMFBY 2024' },
                      { value: 'KISAN CREDIT 2025', label: 'KISAN CREDIT 2025' }
                    ]}
                    isOpen={filterSchemeDropdownOpen}
                    onToggle={() => setFilterSchemeDropdownOpen(!filterSchemeDropdownOpen)}
                    dropdownRef={filterSchemeRef}
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
                  {editingId ? 'Edit User' : 'Add User'}
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {editingId ? 'Update user details' : 'Fill in the details to register a new user'}
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

              <form onSubmit={handleSubmit}>
                {/* User ID Generation Options */}
                <div className="mb-8 flex items-center gap-6 pb-4 border-b" style={{ borderColor: '#E5EBEF' }}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userIdMode"
                      value="mobile"
                      checked={formData.userIdMode === 'mobile'}
                      onChange={(e) => setFormData({ ...formData, userIdMode: e.target.value as 'mobile' | 'auto' })}
                      className="w-4 h-4"
                      style={{ accentColor: '#027F83' }}
                    />
                    <span style={{ fontSize: '14px', color: '#222222', fontWeight: '500' }}>
                      User Id As Mobile No
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userIdMode"
                      value="auto"
                      checked={formData.userIdMode === 'auto'}
                      onChange={(e) => {
                        setFormData({ ...formData, userIdMode: e.target.value as 'mobile' | 'auto' });
                        if (e.target.value === 'auto') {
                          generateUserId();
                        }
                      }}
                      className="w-4 h-4"
                      style={{ accentColor: '#027F83' }}
                    />
                    <span style={{ fontSize: '14px', color: '#222222', fontWeight: '500' }}>
                      Auto Generate User Id
                    </span>
                  </label>
                </div>

                {/* User Details */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      User Details
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
                          { value: 'Admin', label: 'Admin' },
                          { value: 'Operator', label: 'Operator' },
                          { value: 'Viewer', label: 'Viewer' }
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
                      <CustomDropdown
                        value={formData.organizationName}
                        onChange={(value) => setFormData({ ...formData, organizationName: value })}
                        options={[
                          { value: '', label: 'Select Organization' },
                          { value: 'Org1', label: 'Organization 1' },
                          { value: 'Org2', label: 'Organization 2' },
                          { value: 'Org3', label: 'Organization 3' }
                        ]}
                        placeholder="Select Organization"
                        isOpen={organizationDropdownOpen}
                        onToggle={() => setOrganizationDropdownOpen(!organizationDropdownOpen)}
                        dropdownRef={organizationRef}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User Role <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.userRole}
                        onChange={(value) => setFormData({ ...formData, userRole: value })}
                        options={[
                          { value: '', label: 'Select Role' },
                          { value: 'Admin', label: 'Admin' },
                          { value: 'Manager', label: 'Manager' },
                          { value: 'Operator', label: 'Operator' },
                          { value: 'Viewer', label: 'Viewer' }
                        ]}
                        placeholder="Select Role"
                        isOpen={userRoleDropdownOpen}
                        onToggle={() => setUserRoleDropdownOpen(!userRoleDropdownOpen)}
                        dropdownRef={userRoleRef}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User Id <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        placeholder={formData.userIdMode === 'mobile' ? 'Enter Mobile No' : 'Auto Generated'}
                        disabled={formData.userIdMode === 'auto'}
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{ 
                          borderColor: '#CCD8DF', 
                          fontSize: '14px', 
                          color: formData.userIdMode === 'auto' ? '#999' : '#222222',
                          backgroundColor: formData.userIdMode === 'auto' ? '#F7F9FA' : '#FFFFFF'
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
                        User Name <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        placeholder="Enter User Name"
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
                        Mobile No <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobileNo}
                        onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                        placeholder="10-digit Mobile"
                        maxLength={10}
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
                        Email Id
                      </label>
                      <input
                        type="email"
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

                {/* Location */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Location
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

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Taluka <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.taluka}
                        onChange={(value) => setFormData({ ...formData, taluka: value })}
                        options={[
                          { value: '', label: 'Select Taluka' },
                          { value: 'Taluka1', label: 'Taluka 1' },
                          { value: 'Taluka2', label: 'Taluka 2' },
                          { value: 'Taluka3', label: 'Taluka 3' }
                        ]}
                        placeholder="Select Taluka"
                        isOpen={talukaDropdownOpen}
                        onToggle={() => setTalukaDropdownOpen(!talukaDropdownOpen)}
                        dropdownRef={talukaRef}
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

                {/* User Type Checkboxes */}
                <div className="mb-8">
                  <div className="flex items-center gap-6 pt-4 border-t" style={{ borderColor: '#E5EBEF' }}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.maker}
                        onChange={(e) => setFormData({ ...formData, maker: e.target.checked })}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#027F83' }}
                      />
                      <span style={{ fontSize: '14px', color: '#222222', fontWeight: '500' }}>
                        Maker
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.checker}
                        onChange={(e) => setFormData({ ...formData, checker: e.target.checked })}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: '#027F83' }}
                      />
                      <span style={{ fontSize: '14px', color: '#222222', fontWeight: '500' }}>
                        Checker
                      </span>
                    </label>
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
                    {editingId ? 'Update User' : 'Save User'}
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

