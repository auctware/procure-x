import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, ChevronRight, Search, Filter, MoreVertical, Eye, 
  Package, ShoppingCart, User, Building2, DollarSign, 
  FileText, Calendar, TrendingUp, CheckCircle2, XCircle
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface LotEntry {
  id: string;
  lotId: string;
  farmerId: string;
  farmerName: string;
  aadharNumber: string;
  scheme: string;
  seasonId: string;
  commodity: string;
  center: string;
  packType: string;
  ratePerQuintal: string;
  bags: string;
  quantityQtls: string;
  value: string;
  billNo: string;
  entryDate: string;
  status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
}

export default function ViewLotEntry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedLot, setSelectedLot] = useState<LotEntry | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'All',
    commodity: 'All',
    center: 'All',
    dateFrom: '',
    dateTo: ''
  });
  
  // Dropdown refs
  const filterStatusRef = useRef<HTMLDivElement | null>(null);
  const filterCommodityRef = useRef<HTMLDivElement | null>(null);
  const filterCenterRef = useRef<HTMLDivElement | null>(null);
  const [filterStatusDropdownOpen, setFilterStatusDropdownOpen] = useState(false);
  const [filterCommodityDropdownOpen, setFilterCommodityDropdownOpen] = useState(false);
  const [filterCenterDropdownOpen, setFilterCenterDropdownOpen] = useState(false);

  // Mock lot entries data
  const [lotEntries, setLotEntries] = useState<LotEntry[]>([
    {
      id: '1',
      lotId: 'LOT-2025-001',
      farmerId: 'F2024001',
      farmerName: 'Farmer One',
      aadharNumber: '900000000001',
      scheme: 'MSP-2024',
      seasonId: 'Rabi-2024',
      commodity: 'Wheat',
      center: 'Main Procurement Center',
      packType: '50 KG Bags',
      ratePerQuintal: '2250',
      bags: '10',
      quantityQtls: '5.00',
      value: '11250.00',
      billNo: 'BILL-001',
      entryDate: '2025-01-15',
      status: 'Active'
    },
    {
      id: '2',
      lotId: 'LOT-2025-002',
      farmerId: 'F2024002',
      farmerName: 'Farmer Two',
      aadharNumber: '900000000002',
      scheme: 'MSP-2024',
      seasonId: 'Rabi-2024',
      commodity: 'Rice',
      center: 'North Zone Center',
      packType: '100 KG Bags',
      ratePerQuintal: '2400',
      bags: '8',
      quantityQtls: '8.00',
      value: '19200.00',
      billNo: 'BILL-002',
      entryDate: '2025-01-14',
      status: 'Pending'
    },
    {
      id: '3',
      lotId: 'LOT-2025-003',
      farmerId: 'F2024003',
      farmerName: 'Farmer Three',
      aadharNumber: '900000000003',
      scheme: 'MSP-2024',
      seasonId: 'Rabi-2024',
      commodity: 'Paddy',
      center: 'South Zone Center',
      packType: '50 KG Bags',
      ratePerQuintal: '2100',
      bags: '15',
      quantityQtls: '7.50',
      value: '15750.00',
      billNo: 'BILL-003',
      entryDate: '2025-01-13',
      status: 'Completed'
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
      if (filterStatusRef.current && !filterStatusRef.current.contains(event.target as Node)) {
        setFilterStatusDropdownOpen(false);
      }
      if (filterCommodityRef.current && !filterCommodityRef.current.contains(event.target as Node)) {
        setFilterCommodityDropdownOpen(false);
      }
      if (filterCenterRef.current && !filterCenterRef.current.contains(event.target as Node)) {
        setFilterCenterDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter lot entries
  const filteredLotEntries = lotEntries.filter(entry => {
    const matchesSearch = 
      entry.lotId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.farmerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.aadharNumber.includes(searchQuery) ||
      entry.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.center.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.billNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'All' || entry.status === filters.status;
    const matchesCommodity = filters.commodity === 'All' || entry.commodity === filters.commodity;
    const matchesCenter = filters.center === 'All' || entry.center === filters.center;
    
    const matchesDateFrom = !filters.dateFrom || entry.entryDate >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || entry.entryDate <= filters.dateTo;
    
    return matchesSearch && matchesStatus && matchesCommodity && matchesCenter && matchesDateFrom && matchesDateTo;
  });

  const handleViewDetails = (entry: LotEntry) => {
    setSelectedLot(entry);
    setViewDrawerOpen(true);
    setActiveActionMenu(null);
  };

  const handleCloseDrawer = () => {
    setViewDrawerOpen(false);
    setSelectedLot(null);
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      commodity: 'All',
      center: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#E6F7F7', text: '#027F83', border: '#027F83' };
      case 'Pending':
        return { bg: '#FFF3E0', text: '#FFA200', border: '#FFA200' };
      case 'Completed':
        return { bg: '#E6F7F7', text: '#00A040', border: '#00A040' };
      case 'Cancelled':
        return { bg: '#FFEBEE', text: '#E94545', border: '#E94545' };
      default:
        return { bg: '#F7F9FA', text: '#666', border: '#CCD8DF' };
    }
  };

  const formatAadhaar = (aadhaar: string) => {
    if (aadhaar.length === 12) {
      return `${aadhaar.slice(0, 4)} ${aadhaar.slice(4, 8)} ${aadhaar.slice(8, 12)}`;
    }
    return aadhaar;
  };

  return (
    <div className="p-8 overflow-y-auto pb-20" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <button
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>View Lot Entry</span>
      </div>

      {/* Main Content Card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#E6F7F7' }}
            >
              <ShoppingCart className="w-6 h-6" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#315B78',
                }}
              >
                View Lot Entry
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                View all lot entry transactions
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-6 py-4 border-b flex flex-col sm:flex-row gap-4" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Lot ID, Farmer ID, Farmer Name, Aadhaar, Commodity, Center, or Bill No..."
              className="w-full pl-10 pr-4 h-12 rounded-lg border transition-all outline-none"
              style={{
                borderColor: '#CCD8DF',
                color: '#222',
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
          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="px-4 h-12 rounded-lg border-2 transition-all flex items-center gap-2"
            style={{
              borderColor: filterDrawerOpen ? '#027F83' : '#CCD8DF',
              backgroundColor: '#FFFFFF',
              color: '#027F83',
              fontSize: '14px',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              if (!filterDrawerOpen) {
                e.currentTarget.style.borderColor = '#027F83';
              }
            }}
            onMouseLeave={(e) => {
              if (!filterDrawerOpen) {
                e.currentTarget.style.borderColor = '#CCD8DF';
              }
            }}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Drawer */}
        {filterDrawerOpen && (
          <div className="px-6 py-4 border-b" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative" ref={filterStatusRef}>
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
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' }
                  ]}
                  placeholder="Select Status"
                  isOpen={filterStatusDropdownOpen}
                  onToggle={() => setFilterStatusDropdownOpen(!filterStatusDropdownOpen)}
                  dropdownRef={filterStatusRef}
                />
              </div>
              <div className="relative" ref={filterCommodityRef}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                  Commodity
                </label>
                <CustomDropdown
                  value={filters.commodity}
                  onChange={(value) => setFilters({ ...filters, commodity: value })}
                  options={[
                    { value: 'All', label: 'All Commodities' },
                    { value: 'Wheat', label: 'Wheat' },
                    { value: 'Rice', label: 'Rice' },
                    { value: 'Paddy', label: 'Paddy' }
                  ]}
                  placeholder="Select Commodity"
                  isOpen={filterCommodityDropdownOpen}
                  onToggle={() => setFilterCommodityDropdownOpen(!filterCommodityDropdownOpen)}
                  dropdownRef={filterCommodityRef}
                />
              </div>
              <div className="relative" ref={filterCenterRef}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                  Center
                </label>
                <CustomDropdown
                  value={filters.center}
                  onChange={(value) => setFilters({ ...filters, center: value })}
                  options={[
                    { value: 'All', label: 'All Centers' },
                    { value: 'Main Procurement Center', label: 'Main Procurement Center' },
                    { value: 'North Zone Center', label: 'North Zone Center' },
                    { value: 'South Zone Center', label: 'South Zone Center' }
                  ]}
                  placeholder="Select Center"
                  isOpen={filterCenterDropdownOpen}
                  onToggle={() => setFilterCenterDropdownOpen(!filterCenterDropdownOpen)}
                  dropdownRef={filterCenterRef}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                  Entry Date From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                  style={{
                    borderColor: '#CCD8DF',
                    color: '#222',
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
                  Entry Date To
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                  style={{
                    borderColor: '#CCD8DF',
                    color: '#222',
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
            <div className="flex items-center gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg border-2 transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  backgroundColor: '#FFFFFF',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#027F83';
                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CCD8DF';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Lot ID
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Farmer Info
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Scheme / Season
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Commodity
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Center
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quantity / Value
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Entry Date
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
              {filteredLotEntries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12" style={{ color: '#CCD8DF' }} />
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>
                        No lot entries found
                      </p>
                      <p style={{ fontSize: '14px', color: '#999' }}>
                        {searchQuery || Object.values(filters).some(f => f !== 'All' && f !== '') 
                          ? 'Try adjusting your search or filters'
                          : 'No lot entries have been recorded yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLotEntries.map((entry) => {
                  const statusColors = getStatusColor(entry.status);
                  return (
                    <tr
                      key={entry.id}
                      className="border-t transition-colors hover:bg-gray-50 cursor-pointer"
                      style={{ borderColor: '#E5EBEF' }}
                      onClick={() => handleViewDetails(entry)}
                    >
                      <td className="px-6 py-4" style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                        {entry.lotId}
                      </td>
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>{entry.farmerName}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{entry.farmerId}</div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{formatAadhaar(entry.aadharNumber)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', color: '#315B78' }}>{entry.scheme}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{entry.seasonId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', color: '#315B78' }}>{entry.commodity}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{entry.packType}</div>
                      </td>
                      <td className="px-6 py-4" style={{ fontSize: '14px', color: '#315B78' }}>
                        {entry.center}
                      </td>
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>{entry.quantityQtls} Qtls</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#027F83', marginTop: '2px' }}>₹{parseFloat(entry.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>{entry.bags} bags @ ₹{entry.ratePerQuintal}/qtl</div>
                      </td>
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', color: '#315B78' }}>{new Date(entry.entryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>Bill: {entry.billNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-3 py-1.5 inline-flex items-center gap-1.5 border rounded-lg"
                          style={{
                            borderColor: statusColors.border,
                            color: statusColors.text,
                            backgroundColor: statusColors.bg,
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {entry.status === 'Active' && <CheckCircle2 className="w-3 h-3" />}
                          {entry.status === 'Pending' && <TrendingUp className="w-3 h-3" />}
                          {entry.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {entry.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionMenu(activeActionMenu === entry.id ? null : entry.id);
                            }}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: '#315B78' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#F7F9FA';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                          </button>
                          {activeActionMenu === entry.id && (
                            <div
                              className="absolute right-0 mt-2 w-40 rounded-lg shadow-lg overflow-hidden z-50 border-2"
                              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleViewDetails(entry)}
                                className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                style={{ fontSize: '14px', color: '#315B78' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Drawer */}
      {viewDrawerOpen && selectedLot && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end"
          onClick={handleCloseDrawer}
        >
          <div
            className="bg-white h-full w-full lg:w-2/3 xl:w-1/2 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b-2 z-10 px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#E6F7F7' }}
                >
                  <ShoppingCart className="w-5 h-5" style={{ color: '#027F83' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#315B78' }}>
                    Lot Entry Details
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                    {selectedLot.lotId}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-2 rounded-lg transition-colors"
                style={{ color: '#666' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Status
                  </p>
                  {(() => {
                    const statusColors = getStatusColor(selectedLot.status);
                    return (
                      <span
                        className="px-4 py-2 inline-flex items-center gap-2 border rounded-lg"
                        style={{
                          borderColor: statusColors.border,
                          color: statusColors.text,
                          backgroundColor: statusColors.bg,
                          fontSize: '13px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {selectedLot.status === 'Active' && <CheckCircle2 className="w-4 h-4" />}
                        {selectedLot.status === 'Pending' && <TrendingUp className="w-4 h-4" />}
                        {selectedLot.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                        {selectedLot.status === 'Cancelled' && <XCircle className="w-4 h-4" />}
                        {selectedLot.status}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Farmer Information */}
              <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                    <User className="w-5 h-5" style={{ color: '#027F83' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#315B78' }}>Farmer Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Farmer ID
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.farmerId}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Farmer Name
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.farmerName}
                    </p>
                  </div>
                  <div className="py-3 border-b md:col-span-2" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Aadhaar Number
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {formatAadhaar(selectedLot.aadharNumber)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                    <Package className="w-5 h-5" style={{ color: '#027F83' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#315B78' }}>Transaction Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Lot ID
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.lotId}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Bill Number
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.billNo}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Scheme
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.scheme}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Season
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.seasonId}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Commodity
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.commodity}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Pack Type
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.packType}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Center
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.center}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Entry Date
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {new Date(selectedLot.entryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity and Value Details */}
              <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                    <DollarSign className="w-5 h-5" style={{ color: '#027F83' }} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#315B78' }}>Quantity & Value Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Number of Bags
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.bags}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Quantity (Qtls)
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      {selectedLot.quantityQtls} Qtls
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Rate per Quintal
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                      ₹{parseFloat(selectedLot.ratePerQuintal).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Total Value
                    </p>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#027F83' }}>
                      ₹{parseFloat(selectedLot.value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
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
