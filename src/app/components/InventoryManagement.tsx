import React, { useState, useEffect, useRef } from 'react';
import {
  Home, ChevronRight, Package, TrendingUp, TrendingDown, AlertTriangle, AlertCircle,
  Warehouse, Building2, Users, Search, Filter, Download, Eye, MoreVertical,
  CheckCircle2, XCircle, Clock, RefreshCw, BarChart3, PieChart, Activity,
  Zap, Brain, Shield, ArrowUpCircle, ArrowDownCircle, MinusCircle,
  FileText, Calendar, MapPin, Mic, Sparkles, X, ChevronDown, ChevronUp
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface InventoryTransaction {
  id: string;
  transactionType: 'Credit' | 'Debit';
  transactionDate: string;
  referenceType: 'Lot Entry' | 'Dispatch' | 'WHR Creation' | 'Loss' | 'Adjustment';
  referenceId: string;
  referenceNumber: string;
  locationType: 'Center' | 'Society' | 'Warehouse';
  locationId: string;
  locationName: string;
  commodity: string;
  quantity: number;
  bags: number;
  farmerId?: string;
  farmerName?: string;
  lotNumber?: string;
  dispatchId?: string;
  whrNumber?: string;
  status: 'Active' | 'Reversed';
  remarks?: string;
}

interface InventorySummary {
  locationId: string;
  locationName: string;
  locationType: 'Center' | 'Society' | 'Warehouse';
  commodity: string;
  totalCredits: number;
  totalDebits: number;
  currentBalance: number;
  totalBags: number;
  lastUpdated: string;
  lossDetected: boolean;
  lossAmount?: number;
  lossPercentage?: number;
}

interface LossAlert {
  id: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  commodity: string;
  expectedQuantity: number;
  actualQuantity: number;
  lossAmount: number;
  lossPercentage: number;
  detectedDate: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  description: string;
}

interface AIPrediction {
  type: 'Demand Forecast' | 'Loss Risk' | 'Optimal Stock' | 'Anomaly Detection';
  title: string;
  description: string;
  confidence: number;
  recommendation: string;
  impact: 'High' | 'Medium' | 'Low';
}

export default function InventoryManagement() {
  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'details' | 'transactions' | 'losses'>('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCommodity, setSelectedCommodity] = useState<string | null>(null);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState({
    locationType: 'All',
    commodity: 'All',
    dateRange: 'All',
    showLossesOnly: false
  });

  // Dropdown States
  const [locationTypeDropdownOpen, setLocationTypeDropdownOpen] = useState(false);
  const [commodityFilterDropdownOpen, setCommodityFilterDropdownOpen] = useState(false);
  const [dateRangeDropdownOpen, setDateRangeDropdownOpen] = useState(false);

  const locationTypeRef = useRef<HTMLDivElement | null>(null);
  const commodityFilterRef = useRef<HTMLDivElement | null>(null);
  const dateRangeRef = useRef<HTMLDivElement | null>(null);

  // Mock Inventory Data
  const [inventoryTransactions, setInventoryTransactions] = useState<InventoryTransaction[]>([
    {
      id: '1',
      transactionType: 'Credit',
      transactionDate: '2025-01-15',
      referenceType: 'Lot Entry',
      referenceId: 'LOT001',
      referenceNumber: 'LOT-2025-001',
      locationType: 'Center',
      locationId: 'C001',
      locationName: 'Main Procurement Center',
      commodity: 'Wheat',
      quantity: 500,
      bags: 1000,
      farmerId: 'F2024001',
      farmerName: 'Farmer One',
      lotNumber: 'LOT-2025-001',
      status: 'Active'
    },
    {
      id: '2',
      transactionType: 'Credit',
      transactionDate: '2025-01-15',
      referenceType: 'Lot Entry',
      referenceId: 'LOT001',
      referenceNumber: 'LOT-2025-001',
      locationType: 'Society',
      locationId: 'S001',
      locationName: 'Farmers Cooperative Society',
      commodity: 'Wheat',
      quantity: 500,
      bags: 1000,
      farmerId: 'F2024001',
      farmerName: 'Farmer One',
      lotNumber: 'LOT-2025-001',
      status: 'Active'
    },
    {
      id: '3',
      transactionType: 'Debit',
      transactionDate: '2025-01-16',
      referenceType: 'Dispatch',
      referenceId: 'DISP001',
      referenceNumber: 'DISP-2025-001',
      locationType: 'Center',
      locationId: 'C001',
      locationName: 'Main Procurement Center',
      commodity: 'Wheat',
      quantity: 200,
      bags: 400,
      dispatchId: 'DISP-2025-001',
      status: 'Active'
    },
    {
      id: '4',
      transactionType: 'Credit',
      transactionDate: '2025-01-17',
      referenceType: 'WHR Creation',
      referenceId: 'WHR001',
      referenceNumber: 'WHR-2025-001',
      locationType: 'Warehouse',
      locationId: 'W001',
      locationName: 'Central Warehouse',
      commodity: 'Wheat',
      quantity: 200,
      bags: 400,
      whrNumber: 'WHR-2025-001',
      status: 'Active'
    },
    {
      id: '5',
      transactionType: 'Debit',
      transactionDate: '2025-01-18',
      referenceType: 'Loss',
      referenceId: 'LOSS001',
      referenceNumber: 'LOSS-2025-001',
      locationType: 'Center',
      locationId: 'C001',
      locationName: 'Main Procurement Center',
      commodity: 'Wheat',
      quantity: 5,
      bags: 10,
      status: 'Active',
      remarks: 'Moisture loss detected during storage'
    }
  ]);

  // Calculate Inventory Summary
  const calculateInventorySummary = (): InventorySummary[] => {
    const summaryMap = new Map<string, InventorySummary>();

    inventoryTransactions.forEach(transaction => {
      if (transaction.status !== 'Active') return;

      const key = `${transaction.locationId}-${transaction.commodity}`;
      
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          locationId: transaction.locationId,
          locationName: transaction.locationName,
          locationType: transaction.locationType,
          commodity: transaction.commodity,
          totalCredits: 0,
          totalDebits: 0,
          currentBalance: 0,
          totalBags: 0,
          lastUpdated: transaction.transactionDate,
          lossDetected: false
        });
      }

      const summary = summaryMap.get(key)!;
      
      if (transaction.transactionType === 'Credit') {
        summary.totalCredits += transaction.quantity;
        summary.totalBags += transaction.bags;
      } else {
        summary.totalDebits += transaction.quantity;
        summary.totalBags -= transaction.bags;
      }

      summary.currentBalance = summary.totalCredits - summary.totalDebits;
      summary.lastUpdated = transaction.transactionDate > summary.lastUpdated 
        ? transaction.transactionDate 
        : summary.lastUpdated;

      // Detect losses
      if (transaction.referenceType === 'Loss') {
        summary.lossDetected = true;
        summary.lossAmount = (summary.lossAmount || 0) + transaction.quantity;
        summary.lossPercentage = summary.totalCredits > 0 
          ? ((summary.lossAmount || 0) / summary.totalCredits) * 100 
          : 0;
      }
    });

    return Array.from(summaryMap.values());
  };

  const inventorySummary = calculateInventorySummary();

  // Calculate Loss Alerts
  const calculateLossAlerts = (): LossAlert[] => {
    const alerts: LossAlert[] = [];
    
    inventorySummary.forEach(summary => {
      if (summary.lossDetected && summary.lossAmount) {
        alerts.push({
          id: `ALERT-${summary.locationId}-${summary.commodity}`,
          severity: (summary.lossPercentage || 0) > 5 ? 'Critical' : 
                   (summary.lossPercentage || 0) > 2 ? 'High' : 
                   (summary.lossPercentage || 0) > 1 ? 'Medium' : 'Low',
          location: summary.locationName,
          commodity: summary.commodity,
          expectedQuantity: summary.totalCredits,
          actualQuantity: summary.currentBalance,
          lossAmount: summary.lossAmount,
          lossPercentage: summary.lossPercentage || 0,
          detectedDate: summary.lastUpdated,
          status: 'Open',
          description: `Loss detected at ${summary.locationName} for ${summary.commodity}`
        });
      }
    });

    return alerts.sort((a, b) => {
      const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  };

  const lossAlerts = calculateLossAlerts();

  // AI Predictions (Mock)
  const aiPredictions: AIPrediction[] = [
    {
      type: 'Loss Risk',
      title: 'High Loss Risk Detected',
      description: 'Main Procurement Center shows 3.2% loss rate, above normal threshold',
      confidence: 92,
      recommendation: 'Immediate inspection recommended. Review storage conditions and handling procedures.',
      impact: 'High'
    },
    {
      type: 'Demand Forecast',
      title: 'Inventory Optimization',
      description: 'Wheat inventory at Central Warehouse expected to deplete in 15 days based on current dispatch rate',
      confidence: 85,
      recommendation: 'Plan procurement to maintain optimal stock levels.',
      impact: 'Medium'
    },
    {
      type: 'Anomaly Detection',
      title: 'Unusual Transaction Pattern',
      description: 'Detected 3 consecutive loss transactions at Main Procurement Center within 48 hours',
      confidence: 88,
      recommendation: 'Investigate root cause. Possible systematic issue.',
      impact: 'High'
    }
  ];

  // Filtered Data
  const filteredSummary = inventorySummary.filter(summary => {
    if (filters.locationType !== 'All' && summary.locationType !== filters.locationType) return false;
    if (filters.commodity !== 'All' && summary.commodity !== filters.commodity) return false;
    if (filters.showLossesOnly && !summary.lossDetected) return false;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return summary.locationName.toLowerCase().includes(query) ||
             summary.commodity.toLowerCase().includes(query);
    }
    
    return true;
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationTypeRef.current && !locationTypeRef.current.contains(event.target as Node)) {
        setLocationTypeDropdownOpen(false);
      }
      if (commodityFilterRef.current && !commodityFilterRef.current.contains(event.target as Node)) {
        setCommodityFilterDropdownOpen(false);
      }
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setDateRangeDropdownOpen(false);
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
      
      if (query.includes('loss') || query.includes('missing') || query.includes('shortage')) {
        setNlpSuggestion('Filtering by losses');
      } else if (query.includes('center') || query.includes('warehouse') || query.includes('society')) {
        setNlpSuggestion('Searching by location type');
      } else if (query.includes('wheat') || query.includes('rice') || query.includes('paddy')) {
        setNlpSuggestion('Searching by commodity');
      } else {
        setNlpSuggestion('Searching inventory by location or commodity');
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

  const clearFilters = () => {
    setFilters({
      locationType: 'All',
      commodity: 'All',
      dateRange: 'All',
      showLossesOnly: false
    });
  };

  const activeFilterCount = [
    filters.locationType !== 'All',
    filters.commodity !== 'All',
    filters.dateRange !== 'All',
    filters.showLossesOnly
  ].filter(Boolean).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#E94545';
      case 'High': return '#FF6B6B';
      case 'Medium': return '#FFA200';
      case 'Low': return '#FFD700';
      default: return '#666';
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Center': return Building2;
      case 'Society': return Users;
      case 'Warehouse': return Warehouse;
      default: return Package;
    }
  };

  // Calculate totals
  const totalInventory = inventorySummary.reduce((sum, s) => sum + s.currentBalance, 0);
  const totalBags = inventorySummary.reduce((sum, s) => sum + s.totalBags, 0);
  const totalLosses = lossAlerts.reduce((sum, a) => sum + a.lossAmount, 0);
  const criticalAlerts = lossAlerts.filter(a => a.severity === 'Critical').length;

  return (
    <div className="p-8 overflow-y-auto pb-16" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', height: '100vh', maxHeight: '100vh' }}>
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
        <span style={{ fontWeight: '600', color: '#222' }}>Inventory Management</span>
      </div>

      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
            <Package className="w-6 h-6" style={{ color: '#027F83' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
              Inventory Management
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>
              AI-Powered Real-time Inventory Tracking & Loss Detection
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
              placeholder="Try: 'wheat inventory', 'losses at center', 'warehouse stock'..."
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
                <Sparkles className="w-3 h-3 inline mr-1" />
                {nlpSuggestion}
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

          {/* Refresh Button */}
          <button
            onClick={() => window.location.reload()}
            className="h-12 px-4 rounded-lg border transition-all flex items-center gap-2"
            style={{
              borderColor: '#CCD8DF',
              backgroundColor: '#FFFFFF',
              color: '#027F83'
            }}
            title="Refresh Inventory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-6 rounded-xl border-2 transition-all hover:shadow-lg" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
              <Package className="w-6 h-6" style={{ color: '#027F83' }} />
            </div>
            <TrendingUp className="w-5 h-5" style={{ color: '#00A040' }} />
          </div>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Total Inventory
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
            {totalInventory.toLocaleString()}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {totalBags.toLocaleString()} Bags
          </p>
        </div>

        <div className="p-6 rounded-xl border-2 transition-all hover:shadow-lg" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
              <AlertTriangle className="w-6 h-6" style={{ color: '#E94545' }} />
            </div>
            <TrendingDown className="w-5 h-5" style={{ color: '#E94545' }} />
          </div>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Total Losses
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#E94545', marginBottom: '4px' }}>
            {totalLosses.toLocaleString()}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {lossAlerts.length} Alerts
          </p>
        </div>

        <div className="p-6 rounded-xl border-2 transition-all hover:shadow-lg" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFBF0' }}>
              <AlertCircle className="w-6 h-6" style={{ color: '#FFA200' }} />
            </div>
            <Activity className="w-5 h-5" style={{ color: '#FFA200' }} />
          </div>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            Critical Alerts
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#FFA200', marginBottom: '4px' }}>
            {criticalAlerts}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Require Attention
          </p>
        </div>

        <div className="p-6 rounded-xl border-2 transition-all hover:shadow-lg" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
              <Brain className="w-6 h-6" style={{ color: '#00A040' }} />
            </div>
            <Zap className="w-5 h-5" style={{ color: '#027F83' }} />
          </div>
          <h3 style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
            AI Insights
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '700', color: '#027F83', marginBottom: '4px' }}>
            {aiPredictions.length}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Active Predictions
          </p>
        </div>
      </div>

      {/* AI Predictions Section */}
      {aiPredictions.length > 0 && (
        <div className="mb-6 rounded-xl border-2 overflow-hidden" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
              <Brain className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>
              AI-Powered Insights & Predictions
            </h2>
            <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#027F83', color: '#FFFFFF' }}>
              {aiPredictions.length}
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiPredictions.map((prediction, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg border transition-all hover:shadow-md"
                  style={{ 
                    borderColor: prediction.impact === 'High' ? '#FFE5E5' : 
                                 prediction.impact === 'Medium' ? '#FFF5E5' : '#E5F5E5',
                    backgroundColor: prediction.impact === 'High' ? '#FFF5F5' : 
                                    prediction.impact === 'Medium' ? '#FFFBF0' : '#F0FDF4'
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" style={{ color: '#027F83' }} />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase' }}>
                        {prediction.type}
                      </span>
                    </div>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        backgroundColor: prediction.impact === 'High' ? '#E94545' : 
                                         prediction.impact === 'Medium' ? '#FFA200' : '#00A040',
                        color: '#FFFFFF'
                      }}
                    >
                      {prediction.confidence}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                    {prediction.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                    {prediction.description}
                  </p>
                  <div className="pt-3 border-t" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#027F83' }}>
                      💡 {prediction.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loss Alerts Section */}
      {lossAlerts.length > 0 && (
        <div className="mb-6 rounded-xl border-2 overflow-hidden" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFF5F5' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: '#E94545' }} />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>
                Loss Detection Alerts
              </h2>
              <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#E94545', color: '#FFFFFF' }}>
                {lossAlerts.length}
              </span>
            </div>
            <button
              onClick={() => setCurrentView('losses')}
              className="text-sm font-semibold hover:underline"
              style={{ color: '#027F83' }}
            >
              View All
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {lossAlerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id}
                  className="p-4 rounded-lg border-l-4 flex items-start justify-between"
                  style={{ 
                    borderLeftColor: getSeverityColor(alert.severity),
                    backgroundColor: alert.severity === 'Critical' ? '#FFF5F5' : '#FFFBF0'
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ 
                          backgroundColor: getSeverityColor(alert.severity),
                          color: '#FFFFFF'
                        }}
                      >
                        {alert.severity}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                        {alert.location}
                      </span>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        • {alert.commodity}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span style={{ color: '#666' }}>
                        Loss: <strong style={{ color: '#E94545' }}>{alert.lossAmount} QTL ({alert.lossPercentage.toFixed(2)}%)</strong>
                      </span>
                      <span style={{ color: '#666' }}>
                        Expected: {alert.expectedQuantity} QTL
                      </span>
                      <span style={{ color: '#666' }}>
                        Actual: {alert.actualQuantity} QTL
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ 
                        backgroundColor: alert.status === 'Open' ? '#FFF5F5' : '#F0FDF4',
                        color: alert.status === 'Open' ? '#E94545' : '#00A040'
                      }}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Summary Table */}
      <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
              <BarChart3 className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>
              Inventory Summary by Location
            </h2>
            <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#027F83', color: '#FFFFFF' }}>
              {filteredSummary.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('transactions')}
              className="px-4 py-2 rounded-lg border text-sm font-semibold transition-all"
              style={{ 
                borderColor: '#CCD8DF',
                backgroundColor: '#FFFFFF',
                color: '#027F83'
              }}
            >
              View Transactions
            </button>
            <button
              onClick={() => {
                const csv = [
                  ['Location', 'Type', 'Commodity', 'Balance (QTL)', 'Bags', 'Status', 'Last Updated'].join(','),
                  ...filteredSummary.map(s => [
                    s.locationName,
                    s.locationType,
                    s.commodity,
                    s.currentBalance,
                    s.totalBags,
                    s.lossDetected ? 'Loss Detected' : 'Normal',
                    s.lastUpdated
                  ].join(','))
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'inventory-summary.csv';
                a.click();
              }}
              className="px-4 py-2 rounded-lg border text-sm font-semibold transition-all flex items-center gap-2"
              style={{ 
                borderColor: '#CCD8DF',
                backgroundColor: '#FFFFFF',
                color: '#027F83'
              }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: '#F7F9FA' }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Location / Commodity
                </th>
                <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Type
                </th>
                <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Credits
                </th>
                <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Debits
                </th>
                <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Current Balance
                </th>
                <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Bags
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
              {filteredSummary.length > 0 ? (
                filteredSummary.map((summary) => {
                  const LocationIcon = getLocationIcon(summary.locationType);
                  const isExpanded = expandedLocation === `${summary.locationId}-${summary.commodity}`;
                  
                  return (
                    <React.Fragment key={`${summary.locationId}-${summary.commodity}`}>
                      <tr
                        className="border-t transition-colors hover:bg-gray-50 cursor-pointer"
                        style={{ borderColor: '#E5EBEF' }}
                        onClick={() => {
                          setExpandedLocation(isExpanded ? null : `${summary.locationId}-${summary.commodity}`);
                          setSelectedLocation(summary.locationId);
                          setSelectedCommodity(summary.commodity);
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                              <LocationIcon className="w-4 h-4" style={{ color: '#027F83' }} />
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D', marginBottom: '2px' }}>
                                {summary.locationName}
                              </p>
                              <p style={{ fontSize: '12px', color: '#666' }}>
                                {summary.commodity}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 ml-auto" style={{ color: '#666' }} />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-auto" style={{ color: '#666' }} />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ 
                              backgroundColor: summary.locationType === 'Center' ? '#E6F7F7' : 
                                             summary.locationType === 'Warehouse' ? '#F0F9FF' : '#F0FDF4',
                              color: summary.locationType === 'Center' ? '#027F83' : 
                                    summary.locationType === 'Warehouse' ? '#0369A1' : '#00A040'
                            }}
                          >
                            {summary.locationType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ArrowUpCircle className="w-4 h-4" style={{ color: '#00A040' }} />
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#00A040' }}>
                              {summary.totalCredits.toLocaleString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ArrowDownCircle className="w-4 h-4" style={{ color: '#E94545' }} />
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#E94545' }}>
                              {summary.totalDebits.toLocaleString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                            {summary.currentBalance.toLocaleString()} QTL
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p style={{ fontSize: '14px', color: '#666' }}>
                            {summary.totalBags.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          {summary.lossDetected ? (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" style={{ color: '#E94545' }} />
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: '#FFF5F5', color: '#E94545' }}
                              >
                                Loss Detected
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" style={{ color: '#00A040' }} />
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: '#F0FDF4', color: '#00A040' }}
                              >
                                Normal
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveActionMenu(activeActionMenu === `${summary.locationId}-${summary.commodity}` ? null : `${summary.locationId}-${summary.commodity}`);
                                }}
                                className="p-2 rounded-lg transition-all hover:bg-gray-100"
                              >
                                <MoreVertical className="w-5 h-5" style={{ color: '#315B78' }} />
                              </button>

                              {activeActionMenu === `${summary.locationId}-${summary.commodity}` && (
                                <div 
                                  className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl overflow-hidden z-50 border"
                                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setCurrentView('details');
                                      setSelectedLocation(summary.locationId);
                                      setSelectedCommodity(summary.commodity);
                                      setActiveActionMenu(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                    style={{ fontSize: '14px', color: '#222', fontWeight: '500' }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#E6F7F7';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <Eye className="w-4 h-4" style={{ color: '#315B78' }} />
                                    View Details
                                  </button>
                                  <div style={{ height: '1px', backgroundColor: '#E5EBEF' }} />
                                  <button
                                    onClick={() => {
                                      const transactions = inventoryTransactions.filter(t => 
                                        t.locationId === summary.locationId && 
                                        t.commodity === summary.commodity &&
                                        t.status === 'Active'
                                      );
                                      const csv = [
                                        ['Date', 'Type', 'Reference', 'Quantity', 'Bags', 'Farmer', 'Lot Number'].join(','),
                                        ...transactions.map(t => [
                                          t.transactionDate,
                                          t.transactionType,
                                          t.referenceNumber,
                                          t.quantity,
                                          t.bags,
                                          t.farmerName || 'N/A',
                                          t.lotNumber || 'N/A'
                                        ].join(','))
                                      ].join('\n');
                                      const blob = new Blob([csv], { type: 'text/csv' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `inventory-${summary.locationName}-${summary.commodity}.csv`;
                                      a.click();
                                      setActiveActionMenu(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-left"
                                    style={{ fontSize: '14px', color: '#222', fontWeight: '500' }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#E6F7F7';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <Download className="w-4 h-4" style={{ color: '#315B78' }} />
                                    Export Transactions
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={8} className="px-6 py-4" style={{ backgroundColor: '#F7F9FA' }}>
                            <div className="space-y-4">
                              <div>
                                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D', marginBottom: '12px' }}>
                                  Recent Transactions
                                </h4>
                                <div className="space-y-2">
                                  {inventoryTransactions
                                    .filter(t => 
                                      t.locationId === summary.locationId && 
                                      t.commodity === summary.commodity &&
                                      t.status === 'Active'
                                    )
                                    .slice(0, 5)
                                    .map((transaction) => (
                                      <div 
                                        key={transaction.id}
                                        className="p-3 rounded-lg border flex items-center justify-between"
                                        style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className={`p-2 rounded-lg ${transaction.transactionType === 'Credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                                            {transaction.transactionType === 'Credit' ? (
                                              <ArrowUpCircle className="w-4 h-4" style={{ color: '#00A040' }} />
                                            ) : (
                                              <ArrowDownCircle className="w-4 h-4" style={{ color: '#E94545' }} />
                                            )}
                                          </div>
                                          <div>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                                              {transaction.referenceType}: {transaction.referenceNumber}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#666' }}>
                                              {transaction.transactionDate}
                                              {transaction.farmerName && ` • Farmer: ${transaction.farmerName}`}
                                              {transaction.lotNumber && ` • Lot: ${transaction.lotNumber}`}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <p style={{ fontSize: '14px', fontWeight: '700', color: transaction.transactionType === 'Credit' ? '#00A040' : '#E94545' }}>
                                            {transaction.transactionType === 'Credit' ? '+' : '-'}{transaction.quantity} QTL
                                          </p>
                                          <p style={{ fontSize: '12px', color: '#666' }}>
                                            {transaction.bags} Bags
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                              {summary.lossDetected && summary.lossAmount && (
                                <div className="p-4 rounded-lg border-l-4" style={{ borderLeftColor: '#E94545', backgroundColor: '#FFF5F5' }}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-5 h-5" style={{ color: '#E94545' }} />
                                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#E94545' }}>
                                      Loss Detected
                                    </h4>
                                  </div>
                                  <p style={{ fontSize: '13px', color: '#666' }}>
                                    Total Loss: <strong style={{ color: '#E94545' }}>{summary.lossAmount} QTL ({(summary.lossPercentage || 0).toFixed(2)}%)</strong>
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                      <Package className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      No Inventory Found
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666' }}>
                      {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Inventory will appear here after lot entries'}
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
                  Filter Inventory
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
                    Location Type
                  </label>
                  <CustomDropdown
                    value={filters.locationType}
                    onChange={(value) => setFilters({ ...filters, locationType: value })}
                    options={[
                      { value: 'All', label: 'All Types' },
                      { value: 'Center', label: 'Center' },
                      { value: 'Society', label: 'Society' },
                      { value: 'Warehouse', label: 'Warehouse' }
                    ]}
                    isOpen={locationTypeDropdownOpen}
                    onToggle={() => setLocationTypeDropdownOpen(!locationTypeDropdownOpen)}
                    dropdownRef={locationTypeRef}
                  />
                </div>

                <div>
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
                      { value: 'Paddy', label: 'Paddy' },
                      { value: 'Pulses', label: 'Pulses' }
                    ]}
                    isOpen={commodityFilterDropdownOpen}
                    onToggle={() => setCommodityFilterDropdownOpen(!commodityFilterDropdownOpen)}
                    dropdownRef={commodityFilterRef}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Date Range
                  </label>
                  <CustomDropdown
                    value={filters.dateRange}
                    onChange={(value) => setFilters({ ...filters, dateRange: value })}
                    options={[
                      { value: 'All', label: 'All Time' },
                      { value: 'Today', label: 'Today' },
                      { value: 'Week', label: 'Last 7 Days' },
                      { value: 'Month', label: 'Last 30 Days' },
                      { value: 'Quarter', label: 'Last 3 Months' }
                    ]}
                    isOpen={dateRangeDropdownOpen}
                    onToggle={() => setDateRangeDropdownOpen(!dateRangeDropdownOpen)}
                    dropdownRef={dateRangeRef}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.showLossesOnly}
                      onChange={(e) => setFilters({ ...filters, showLossesOnly: e.target.checked })}
                      className="w-5 h-5 rounded border-2"
                      style={{ borderColor: '#CCD8DF', accentColor: '#027F83' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                      Show Losses Only
                    </span>
                  </label>
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
