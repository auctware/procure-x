import { useState, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import {
  X, Search, CheckCircle2, XCircle, Filter, MoreVertical,
  Home, ChevronRight, Mic, User, Phone, Mail, MapPin,
  FileText, Eye
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface ApprovalUser {
  id: string;
  userId: string;
  userName: string;
  mobileNo: string;
  userRole: string;
  userType: string;
  orgName: string;
  aadhaarNo: string;
  address: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  emailId: string;
  designation: string;
  employeeCode: string;
  requestedOn: string;
}

export default function UserRegistrationApproval() {
  // UI State
  const [users, setUsers] = useState<ApprovalUser[]>([
    {
      id: '1',
      userId: 'USR010',
      userName: 'User One',
      mobileNo: '9000000001',
      userRole: 'Admin',
      userType: 'Maker',
      orgName: 'Sample Farmers Co-op One',
      aadhaarNo: '9000 0000 0001',
      address: 'Plot No. 45, Industrial Area, Bangalore, Karnataka - 560001',
      status: 'Pending',
      emailId: 'user1@dummy.com',
      designation: 'Manager',
      employeeCode: 'EMP001',
      requestedOn: '2025-01-12'
    },
    {
      id: '2',
      userId: 'USR011',
      userName: 'User Two',
      mobileNo: '9000000002',
      userRole: 'Operator',
      userType: 'Checker',
      orgName: 'Sample Women SHG One',
      aadhaarNo: '9000 0000 0002',
      address: 'House No. 12, Village Road, Pune, Maharashtra - 411001',
      status: 'Pending',
      emailId: 'user2@dummy.com',
      designation: 'Executive',
      employeeCode: 'EMP002',
      requestedOn: '2025-01-13'
    },
    {
      id: '3',
      userId: 'USR012',
      userName: 'User Three',
      mobileNo: '9000000003',
      userRole: 'Viewer',
      userType: 'Maker',
      orgName: 'Sample Cooperative Ltd One',
      aadhaarNo: '9000 0000 0003',
      address: 'Street No. 8, Industrial Estate, Chennai, Tamil Nadu - 600001',
      status: 'Approved',
      emailId: 'user3@dummy.com',
      designation: 'Supervisor',
      employeeCode: 'EMP003',
      requestedOn: '2025-01-10'
    }
  ]);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApprovalUser | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'Approved' | 'Rejected' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter State
  const [filters, setFilters] = useState({
    status: 'All',
    userRole: 'All',
    userType: 'All'
  });

  // Dropdown States
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterUserRoleDropdownOpen, setFilterUserRoleDropdownOpen] = useState(false);
  const [filterUserTypeDropdownOpen, setFilterUserTypeDropdownOpen] = useState(false);

  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterUserRoleRef = useRef<HTMLDivElement | null>(null);
  const filterUserTypeRef = useRef<HTMLDivElement | null>(null);

  // NLP Search Logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      if (query.includes('pending') || query.includes('approved') || query.includes('rejected')) {
        setNlpSuggestion('Filtering by status');
      } else if (query.includes('admin') || query.includes('operator') || query.includes('viewer')) {
        setNlpSuggestion('Searching by user role');
      } else if (query.includes('maker') || query.includes('checker')) {
        setNlpSuggestion('Searching by user type');
      } else if (query.match(/\d{10}/) || query.match(/\d{4}\s\d{4}/)) {
        setNlpSuggestion('Searching by phone/aadhaar');
      } else if (query.includes('@')) {
        setNlpSuggestion('Searching by email');
      } else {
        setNlpSuggestion('Searching by name, user ID, or organization');
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
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusDropdownOpen(false);
      }
      if (filterUserRoleRef.current && !filterUserRoleRef.current.contains(event.target as Node)) {
        setFilterUserRoleDropdownOpen(false);
      }
      if (filterUserTypeRef.current && !filterUserTypeRef.current.contains(event.target as Node)) {
        setFilterUserTypeDropdownOpen(false);
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
  const filteredUsers = users.filter(user => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        user.userId.toLowerCase().includes(query) ||
        user.userName.toLowerCase().includes(query) ||
        user.mobileNo.includes(query) ||
        user.userRole.toLowerCase().includes(query) ||
        user.userType.toLowerCase().includes(query) ||
        user.orgName.toLowerCase().includes(query) ||
        user.aadhaarNo.includes(query) ||
        user.address.toLowerCase().includes(query) ||
        user.emailId.toLowerCase().includes(query) ||
        user.designation.toLowerCase().includes(query) ||
        user.employeeCode.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    if (filters.status !== 'All' && user.status !== filters.status) return false;
    if (filters.userRole !== 'All' && user.userRole !== filters.userRole) return false;
    if (filters.userType !== 'All' && user.userType !== filters.userType) return false;

    return true;
  });


  const handleViewDetails = (user: ApprovalUser) => {
    setSelectedUser(user);
    setViewDrawerOpen(true);
    setActiveActionMenu(null);
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      userRole: 'All',
      userType: 'All'
    });
  };

  const activeFilterCount = [
    filters.status !== 'All',
    filters.userRole !== 'All',
    filters.userType !== 'All'
  ].filter(Boolean).length;

  const getBadgeColors = (status: ApprovalUser['status']) => {
    switch (status) {
      case 'Approved':
        return { border: '#CCD8DF', dot: '#00A040', bg: '#FFFFFF', text: '#666666' };
      case 'Rejected':
        return { border: '#CCD8DF', dot: '#E94545', bg: '#FFFFFF', text: '#666666' };
      default:
        return { border: '#CCD8DF', dot: '#FFA200', bg: '#FFFFFF', text: '#666666' };
    }
  };

  const handleApproveClick = (user: ApprovalUser) => {
    setSelectedUser(user);
    setPendingAction('Approved');
    setConfirmModalOpen(true);
  };

  const handleRejectClick = (user: ApprovalUser) => {
    setSelectedUser(user);
    setPendingAction('Rejected');
    setRejectionReason('');
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedUser && pendingAction) {
      if (pendingAction === 'Rejected' && !rejectionReason.trim()) {
        alert('Please provide a rejection reason');
        return;
      }
      setUsers(prev =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, status: pendingAction } : u))
      );
      setConfirmModalOpen(false);
      setPendingAction(null);
      setRejectionReason('');
      if (viewDrawerOpen) {
        setViewDrawerOpen(false);
      }
    }
  };

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
        <span style={{ fontWeight: '600', color: '#222' }}>User Registration Approval</span>
      </div>

      {/* Main Content Card */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
              <CheckCircle2 className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                User Registration Approval
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                {filteredUsers.length} of {users.length} user requests
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
                placeholder="Try: 'pending users', 'admin maker', '9000000001'..."
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
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  User Id / Name
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Contact
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Role / Type
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Organization
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Aadhaar No
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Address
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Designation / Code
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
                filteredUsers.map((user) => {
                  const colors = getBadgeColors(user.status);
                  return (
                    <tr
                      key={user.id}
                      onClick={() => handleViewDetails(user)}
                      className="border-t transition-colors cursor-pointer hover:bg-gray-50"
                      style={{ borderColor: '#E5EBEF' }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(user);
                            }}
                            className="text-left hover:underline transition-colors"
                            style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '2px' }}
                          >
                            {user.userId}
                          </button>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {user.userName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                              {user.mobileNo}
                            </p>
                          </div>
                          {user.emailId && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" style={{ color: '#315B78' }} />
                              <p style={{ fontSize: '12px', color: '#315B78' }}>
                                {user.emailId}
                              </p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {user.userRole}
                          </p>
                          <p style={{ fontSize: '12px', color: '#315B78' }}>
                            {user.userType}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4" style={{ maxWidth: '200px' }}>
                        <p style={{ fontSize: '14px', color: '#315B78' }} className="truncate">
                          {user.orgName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p style={{ fontSize: '14px', color: '#315B78' }}>
                          {user.aadhaarNo}
                        </p>
                      </td>
                      <td className="px-6 py-4" style={{ maxWidth: '250px' }}>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 mt-0.5" style={{ color: '#315B78', flexShrink: 0 }} />
                          <p style={{ fontSize: '12px', color: '#315B78' }} className="truncate">
                            {user.address}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                            {user.designation}
                          </p>
                          <p style={{ fontSize: '12px', color: '#315B78' }}>
                            {user.employeeCode}
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
                            style={{ backgroundColor: colors.dot }}
                          />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
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

                            {activeActionMenu === user.id && (
                              <div 
                                className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl overflow-hidden z-50 border"
                                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(user);
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
                  <td colSpan={9} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                      <FileText className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      No User Requests Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'No pending user registration requests'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Drawer */}
      {viewDrawerOpen && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={() => setViewDrawerOpen(false)}
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
                  User Details
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Complete user registration information
                </p>
              </div>
              <button
                onClick={() => setViewDrawerOpen(false)}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
              >
                <X className="w-6 h-6" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="px-8 py-6">
              <div className="space-y-6">
                {/* User Information */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      User Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User Id
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222', fontWeight: '600' }}>
                          {selectedUser.userId}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User Name
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222', fontWeight: '600' }}>
                          {selectedUser.userName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Mobile No
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center gap-2" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <Phone className="w-4 h-4" style={{ color: '#666' }} />
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.mobileNo}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Email Id
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center gap-2" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <Mail className="w-4 h-4" style={{ color: '#666' }} />
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.emailId}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User Role
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.userRole}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        User Type
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.userType}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Designation
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.designation}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Employee Code
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.employeeCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization & Address */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5" style={{ color: '#027F83' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                      Organization & Address
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Organization Name
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.orgName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Aadhaar No
                      </label>
                      <div className="h-12 px-4 rounded-lg border flex items-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <p style={{ fontSize: '14px', color: '#222' }}>
                          {selectedUser.aadhaarNo}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Address
                      </label>
                      <div className="px-4 py-3 rounded-lg border" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#666', flexShrink: 0 }} />
                          <p style={{ fontSize: '14px', color: '#222' }}>
                            {selectedUser.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="pt-6 border-t" style={{ borderColor: '#E5EBEF' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Status
                      </label>
                      <span
                        className="px-4 py-2 inline-flex items-center gap-2 border"
                        style={{
                          borderColor: getBadgeColors(selectedUser.status).border,
                          color: getBadgeColors(selectedUser.status).text,
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          backgroundColor: getBadgeColors(selectedUser.status).bg,
                          borderRadius: '0'
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getBadgeColors(selectedUser.status).dot }}
                        />
                        {selectedUser.status}
                      </span>
                    </div>
                    {selectedUser.status === 'Pending' && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleApproveClick(selectedUser)}
                          className="px-6 h-12 rounded-lg transition-all flex items-center gap-2"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #00A040',
                            color: '#00A040',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F0FDF4';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 160, 64, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectClick(selectedUser)}
                          className="px-6 h-12 rounded-lg transition-all flex items-center gap-2"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E94545',
                            color: '#E94545',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF5F5';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(233, 69, 69, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <XCircle className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
                      { value: 'Approved', label: 'Approved' },
                      { value: 'Rejected', label: 'Rejected' }
                    ]}
                    isOpen={filterStatusDropdownOpen}
                    onToggle={() => setFilterStatusDropdownOpen(!filterStatusDropdownOpen)}
                    dropdownRef={filterStatusRef}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    User Role
                  </label>
                  <CustomDropdown
                    value={filters.userRole}
                    onChange={(value) => setFilters({ ...filters, userRole: value })}
                    options={[
                      { value: 'All', label: 'All Roles' },
                      { value: 'Admin', label: 'Admin' },
                      { value: 'Operator', label: 'Operator' },
                      { value: 'Viewer', label: 'Viewer' }
                    ]}
                    isOpen={filterUserRoleDropdownOpen}
                    onToggle={() => setFilterUserRoleDropdownOpen(!filterUserRoleDropdownOpen)}
                    dropdownRef={filterUserRoleRef}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    User Type
                  </label>
                  <CustomDropdown
                    value={filters.userType}
                    onChange={(value) => setFilters({ ...filters, userType: value })}
                    options={[
                      { value: 'All', label: 'All Types' },
                      { value: 'Maker', label: 'Maker' },
                      { value: 'Checker', label: 'Checker' }
                    ]}
                    isOpen={filterUserTypeDropdownOpen}
                    onToggle={() => setFilterUserTypeDropdownOpen(!filterUserTypeDropdownOpen)}
                    dropdownRef={filterUserTypeRef}
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

      {/* Confirmation Modal */}
      {confirmModalOpen && selectedUser && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-50 transition-opacity"
            onClick={() => {
              setConfirmModalOpen(false);
              setPendingAction(null);
              setRejectionReason('');
            }}
          />

          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 border"
            style={{ borderColor: '#E5EBEF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  {pendingAction === 'Approved' ? 'Confirm Approval' : 'Confirm Rejection'}
                </h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {pendingAction === 'Approved' 
                    ? `Are you sure you want to approve user ${selectedUser.userId}?`
                    : `Are you sure you want to reject user ${selectedUser.userId}?`
                  }
                </p>
              </div>
              <button
                onClick={() => {
                  setConfirmModalOpen(false);
                  setPendingAction(null);
                  setRejectionReason('');
                }}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
              >
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="px-6 py-6">
              {pendingAction === 'Rejected' && (
                <div className="mb-4">
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Rejection Reason <span style={{ color: '#E94545' }}>*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejection..."
                    rows={4}
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
              )}

              <div className="flex items-center gap-3">
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 h-12 rounded-lg transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: pendingAction === 'Approved' ? '#00A040' : '#E94545',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 160, 64, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {pendingAction === 'Approved' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Confirm Approval
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      Confirm Rejection
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setConfirmModalOpen(false);
                    setPendingAction(null);
                    setRejectionReason('');
                  }}
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
