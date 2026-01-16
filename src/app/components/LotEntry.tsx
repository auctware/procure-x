import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, RotateCcw, TrendingUp, AlertCircle, Clock, Copy, Zap, Home, ChevronRight, ShoppingCart, Mic, Sparkles, X } from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Mock farmer data
const mockFarmerData: Record<string, any> = {
  '900000000001': {
    farmerId: 'F2024001',
    farmerName: 'Farmer One',
    commodityDailyLimit: 50,
    commodityDailyUtilized: 20,
    totalUtilizationLimit: 500,
    commodityTotalUtilized: 180,
    farmerProcLimit: 100,
    totalCenterUtilizationLimit: 1000,
    recentTransactions: [
      { date: '2026-01-10', bags: 10, quantity: 5, value: 11250, billNo: 'B001' },
      { date: '2026-01-08', bags: 8, quantity: 4, value: 9000, billNo: 'B002' }
    ],
    surveyDetails: [
      { market: 'Market A', surveyNo: 'S123', acreage: 5.5, utilizationLimit: 100 },
      { market: 'Market B', surveyNo: 'S124', acreage: 3.2, utilizationLimit: 60 }
    ]
  }
};

export default function LotEntry() {
  const [searchValue, setSearchValue] = useState('');
  const [farmerData, setFarmerData] = useState<any>(null);
  const [formData, setFormData] = useState({
    scheme: 'MSP-2024',
    seasonId: 'Rabi-2024',
    commodity: '',
    center: '',
    searchFarmerBy: 'Aadhar Number',
    aadharNumber: '',
    farmerId: '',
    farmerName: '',
    packType: '',
    ratePerQuintal: '2250',
    bags: '',
    quantityQtls: '',
    value: '',
    billNo: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  // AI/NLP States
  const [nlpInput, setNlpInput] = useState('');
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isProcessingNlp, setIsProcessingNlp] = useState(false);
  
  // Dropdown states
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [packTypeDropdownOpen, setPackTypeDropdownOpen] = useState(false);
  
  // Refs for dropdowns
  const commodityRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const packTypeRef = useRef<HTMLDivElement | null>(null);
  
  // Options for dropdowns
  const commodityOptions = [
    { value: '', label: 'Select Commodity' },
    { value: 'wheat', label: 'Wheat' },
    { value: 'rice', label: 'Rice' },
    { value: 'paddy', label: 'Paddy' }
  ];
  
  const centerOptions = [
    { value: '', label: 'Select Center' },
    { value: 'center1', label: 'Main Procurement Center' },
    { value: 'center2', label: 'North Zone Center' },
    { value: 'center3', label: 'South Zone Center' }
  ];
  
  const packTypeOptions = [
    { value: '', label: 'Select Pack Type' },
    { value: '50kg', label: '50 KG Bags' },
    { value: '100kg', label: '100 KG Bags' }
  ];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (commodityRef.current && !commodityRef.current.contains(event.target as Node)) {
        setCommodityDropdownOpen(false);
      }
      if (centerRef.current && !centerRef.current.contains(event.target as Node)) {
        setCenterDropdownOpen(false);
      }
      if (packTypeRef.current && !packTypeRef.current.contains(event.target as Node)) {
        setPackTypeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time calculations
  useEffect(() => {
    if (formData.bags && formData.ratePerQuintal) {
      const bags = parseFloat(formData.bags) || 0;
      const rate = parseFloat(formData.ratePerQuintal) || 0;
      const quantity = bags * 0.5; // Assuming 50kg per bag = 0.5 quintals
      const value = quantity * rate;
      
      setFormData(prev => ({
        ...prev,
        quantityQtls: quantity.toFixed(2),
        value: value.toFixed(2)
      }));
    }
  }, [formData.bags, formData.ratePerQuintal]);

  // NLP Processing - Parse natural language input
  const processNlpInput = (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessingNlp(true);
    setNlpSuggestion('');
    
    // Simulate AI processing delay
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const updates: any = {};
      let suggestion = '';
      
      // First, check for Aadhaar number (12 digits)
      const aadhaarMatch = input.match(/\b(\d{12})\b/) || 
                          input.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/) ||
                          input.match(/aadhaar[:\s]*(\d{12})/i) ||
                          input.match(/aadhar[:\s]*(\d{12})/i);
      
      if (aadhaarMatch) {
        const aadhaarNumber = aadhaarMatch[1].replace(/\s/g, '');
        setSearchValue(aadhaarNumber);
        suggestion += `✓ Aadhaar: ${aadhaarNumber}\n`;
        
        // Search for farmer
        const data = mockFarmerData[aadhaarNumber];
        if (data) {
          setFarmerData(data);
          setFormData(prev => ({
            ...prev,
            aadharNumber: aadhaarNumber,
            farmerId: data.farmerId,
            farmerName: data.farmerName
          }));
          suggestion += `✓ Farmer Found: ${data.farmerName}\n`;
        } else {
          suggestion += '⚠ Farmer not found with this Aadhaar\n';
        }
      }
      
      // Extract Commodity
      if (lowerInput.includes('wheat')) {
        updates.commodity = 'wheat';
        suggestion += '✓ Commodity: Wheat\n';
      } else if (lowerInput.includes('rice')) {
        updates.commodity = 'rice';
        suggestion += '✓ Commodity: Rice\n';
      } else if (lowerInput.includes('paddy')) {
        updates.commodity = 'paddy';
        suggestion += '✓ Commodity: Paddy\n';
      }
      
      // Extract Center
      if (lowerInput.includes('main') || lowerInput.includes('procurement center')) {
        updates.center = 'center1';
        suggestion += '✓ Center: Main Procurement Center\n';
      } else if (lowerInput.includes('north')) {
        updates.center = 'center2';
        suggestion += '✓ Center: North Zone Center\n';
      } else if (lowerInput.includes('south')) {
        updates.center = 'center3';
        suggestion += '✓ Center: South Zone Center\n';
      }
      
      // Extract Pack Type
      if (lowerInput.includes('50') || lowerInput.includes('fifty')) {
        updates.packType = '50kg';
        suggestion += '✓ Pack Type: 50 KG Bags\n';
      } else if (lowerInput.includes('100') || lowerInput.includes('hundred')) {
        updates.packType = '100kg';
        suggestion += '✓ Pack Type: 100 KG Bags\n';
      }
      
      // Extract Number of Bags
      const bagMatch = lowerInput.match(/(\d+)\s*(?:bags?|sacks?|packets?)/i) || 
                       lowerInput.match(/(\d+)\s*(?:bag|sack|packet)/i);
      if (bagMatch) {
        updates.bags = bagMatch[1];
        suggestion += `✓ Bags: ${bagMatch[1]}\n`;
      }
      
      // Extract Rate
      const rateMatch = lowerInput.match(/rate[:\s]*₹?(\d+)/i) || 
                       lowerInput.match(/₹(\d+)/) ||
                       lowerInput.match(/(\d+)\s*(?:per|rate|rupees?)/i);
      if (rateMatch) {
        updates.ratePerQuintal = rateMatch[1];
        suggestion += `✓ Rate: ₹${rateMatch[1]} per quintal\n`;
      }
      
      // Extract Bill Number
      const billMatch = lowerInput.match(/bill[:\s]*(?:no|number)?[:\s]*([A-Z0-9]+)/i) ||
                       lowerInput.match(/bill[:\s]*([A-Z0-9]+)/i);
      if (billMatch) {
        updates.billNo = billMatch[1].toUpperCase();
        suggestion += `✓ Bill No: ${billMatch[1].toUpperCase()}\n`;
      }
      
      // Apply updates if any found (only if farmer is found or if no Aadhaar was provided)
      if (Object.keys(updates).length > 0) {
        if (farmerData || !aadhaarMatch) {
          setFormData(prev => ({ ...prev, ...updates }));
          setNlpSuggestion(suggestion.trim() || '💡 Parsed lot entry data from your input');
        } else {
          setNlpSuggestion(suggestion.trim() + '\n⚠ Please search for farmer first');
        }
      } else if (aadhaarMatch) {
        setNlpSuggestion(suggestion.trim());
      } else {
        setNlpSuggestion('💡 Try: "Aadhaar 900000000001, Wheat, 10 bags, Main Procurement Center, 50kg bags, rate 2250"');
      }
      
      setIsProcessingNlp(false);
    }, 800);
  };

  // Handle Voice Search
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
      setNlpInput(transcript);
      setIsListening(false);
      setIsProcessingVoice(true);

      // Process the voice input
      processNlpInput(transcript);

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

  // Handle NLP input change
  const handleNlpInputChange = (value: string) => {
    setNlpInput(value);
    // Clear suggestion when user starts typing
    if (!value.trim()) {
      setNlpSuggestion('');
    }
    
    // Auto-process when user stops typing (debounce)
    if (value.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        processNlpInput(value);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close NLP suggestion popup when clicking outside
      const target = event.target as HTMLElement;
      if (nlpSuggestion && !target.closest('.nlp-suggestion-popup')) {
        setNlpSuggestion('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [nlpSuggestion]);

  const handleSearch = () => {
    const data = mockFarmerData[searchValue];
    if (data) {
      setFarmerData(data);
      setFormData(prev => ({
        ...prev,
        aadharNumber: searchValue,
        farmerId: data.farmerId,
        farmerName: data.farmerName
      }));
    }
  };

  const handleQuickFill = (transaction: any) => {
    setFormData(prev => ({
      ...prev,
      bags: transaction.bags.toString(),
      ratePerQuintal: prev.ratePerQuintal
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      scheme: 'MSP-2024',
      seasonId: 'Rabi-2024',
      commodity: '',
      center: '',
      searchFarmerBy: 'Aadhar Number',
      aadharNumber: '',
      farmerId: '',
      farmerName: '',
      packType: '',
      ratePerQuintal: '2250',
      bags: '',
      quantityQtls: '',
      value: '',
      billNo: ''
    });
    setSearchValue('');
    setFarmerData(null);
  };

  const remainingDailyLimit = farmerData ? farmerData.commodityDailyLimit - farmerData.commodityDailyUtilized : 0;
  const remainingTotalLimit = farmerData ? farmerData.totalUtilizationLimit - farmerData.commodityTotalUtilized : 0;

  return (
    <div className="p-8 pb-20" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
            console.log('Navigate to Operations');
          }}
          className="hover:underline transition-colors cursor-pointer"
          style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}
        >
          Operations
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#315B78' }}>Lot Entry</span>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#00A040', color: '#FFFFFF' }}>
          <Check className="w-5 h-5" />
          <span>Transaction recorded successfully!</span>
        </div>
      )}

      {/* Main Content Card */}
      <div className="rounded-2xl border overflow-hidden flex-1 flex flex-col" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        {/* Header Section */}
        <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#E5EBEF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
              <ShoppingCart className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                Farmer Procurement Entry
              </h2>
              <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                Quick entry for farmer commodity transactions
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div style={{ color: '#666', fontSize: '12px' }}>Today's Date</div>
              <div style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>12 Jan 2026</div>
            </div>
            <div className="text-center px-4 border-l" style={{ borderColor: '#CCD8DF' }}>
              <div style={{ color: '#666', fontSize: '12px' }}>Season</div>
              <div style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>Rabi 2024</div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>

          {/* AI Natural Language / Voice Entry - On Top */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#FFFCE6', border: '1px solid #FFA200' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" style={{ color: '#FFA200' }} />
              <span style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>AI Natural Language / Voice Entry</span>
            </div>
            <div className="relative">
              <div 
                className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: '#F2FCFB' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#027F83' }} />
              </div>
              <input
                type="text"
                value={nlpInput}
                onChange={(e) => handleNlpInputChange(e.target.value)}
                placeholder={farmerData 
                  ? "Try: 'Wheat, 10 bags, Main Procurement Center, 50kg bags, rate 2250, bill B001'"
                  : "Try: 'Aadhaar 900000000001, Wheat, 10 bags, Main Procurement Center, 50kg bags, rate 2250'"
                }
                className="w-full h-12 pl-14 pr-12 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: nlpInput ? '#027F83' : '#CCD8DF',
                  color: '#315B78',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#027F83';
                  e.target.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = nlpInput ? '#027F83' : '#CCD8DF';
                  e.target.style.boxShadow = 'none';
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && nlpInput.trim()) {
                    processNlpInput(nlpInput);
                  }
                }}
              />
              <button
                onClick={handleVoiceSearch}
                disabled={isListening || isProcessingVoice}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-md transition-all disabled:opacity-50"
                style={{
                  backgroundColor: isListening ? '#FF6B6B' : isProcessingVoice ? '#FFA500' : 'transparent'
                }}
                title={isListening ? 'Listening...' : isProcessingVoice ? 'Processing...' : 'Voice entry'}
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
              {(nlpSuggestion || isProcessingNlp) && (
                <div className="nlp-suggestion-popup absolute top-full left-0 mt-2 w-full px-4 py-3 rounded-lg z-50 shadow-lg" style={{ backgroundColor: '#E6F7F7', border: '1px solid #027F83' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      {isProcessingNlp ? (
                        <div className="flex items-center gap-2" style={{ fontSize: '12px', color: '#027F83' }}>
                          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#027F83' }}></div>
                          Processing your input...
                        </div>
                      ) : (
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#315B78', whiteSpace: 'pre-line' }}>
                          {nlpSuggestion}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setNlpSuggestion('');
                        setIsProcessingNlp(false);
                      }}
                      className="flex-shrink-0 p-1 rounded hover:bg-white/50 transition-colors"
                      style={{ color: '#315B78' }}
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2" style={{ color: '#666', fontSize: '12px' }}>
              {farmerData 
                ? "Speak or type in natural language. Example: 'Wheat, 10 bags, Main Procurement Center, 50kg bags, rate 2250'"
                : "Speak or type to search farmer and enter lot data. Example: 'Aadhaar 900000000001, Wheat, 10 bags, Main Procurement Center, 50kg bags, rate 2250'"
              }
            </p>
          </div>

          {/* Smart Search First */}
          <div className="mb-6">
            <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              1. Search Farmer <span style={{ color: '#E94545' }}>*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter Aadhar Number (e.g., 900000000001)"
                className="flex-1 h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: searchValue ? '#027F83' : '#CCD8DF',
                  color: '#315B78',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF'
                }}
              />
              <button
                type="button"
                onClick={handleSearch}
                className="h-12 px-6 rounded-lg flex items-center gap-2 transition-all hover:opacity-90"
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
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
            <p className="mt-2" style={{ color: '#666', fontSize: '12px' }}>
              Press Enter or click Search to auto-fill farmer details
            </p>
          </div>

          {/* Auto-filled Farmer Info */}
          {farmerData && (
            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#F2FCFB', border: '2px solid #027F83' }}>
              <div className="flex items-center gap-2 mb-3">
                <Check className="w-5 h-5" style={{ color: '#00A040' }} />
                <span style={{ color: '#00A040', fontSize: '14px', fontWeight: '600' }}>Farmer Found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Farmer ID</div>
                  <div style={{ color: '#315B78', fontSize: '16px', fontWeight: '600' }}>{farmerData.farmerId}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Farmer Name</div>
                  <div style={{ color: '#315B78', fontSize: '16px', fontWeight: '600' }}>{farmerData.farmerName}</div>
                </div>
                <div>
                  <div style={{ color: '#666', fontSize: '12px' }}>Available Daily Limit</div>
                  <div style={{ color: remainingDailyLimit > 10 ? '#00A040' : '#E94545', fontSize: '16px', fontWeight: '600' }}>
                    {remainingDailyLimit} Qtls
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Main Form - Only shows when farmer is found */}
          {farmerData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Entry Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit}>
                <h3 className="mb-4" style={{ color: '#315B78', fontSize: '18px', fontWeight: '600' }}>
                  2. Enter Transaction Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Commodity <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={formData.commodity}
                      onChange={(value) => setFormData({ ...formData, commodity: value })}
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
                      value={formData.center}
                      onChange={(value) => setFormData({ ...formData, center: value })}
                      options={centerOptions}
                      placeholder="Select Center"
                      isOpen={centerDropdownOpen}
                      onToggle={() => setCenterDropdownOpen(!centerDropdownOpen)}
                      dropdownRef={centerRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Pack Type <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={formData.packType}
                      onChange={(value) => setFormData({ ...formData, packType: value })}
                      options={packTypeOptions}
                      placeholder="Select Pack Type"
                      isOpen={packTypeDropdownOpen}
                      onToggle={() => setPackTypeDropdownOpen(!packTypeDropdownOpen)}
                      dropdownRef={packTypeRef}
                    />
                  </div>

                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Rate per Quintal (₹) <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.ratePerQuintal}
                      onChange={(e) => setFormData({ ...formData, ratePerQuintal: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#E5EBEF'
                      }}
                    />
                    <p className="mt-1" style={{ color: '#666', fontSize: '12px' }}>MSP Rate pre-filled</p>
                  </div>
                </div>

                {/* Quantity Entry with Real-time Calculation */}
                <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: '#FFFCE6', border: '1px solid #FFA200' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5" style={{ color: '#FFA200' }} />
                    <span style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>Smart Calculation</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Number of Bags <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.bags}
                        onChange={(e) => setFormData({ ...formData, bags: e.target.value })}
                        placeholder="Enter bags"
                        className="w-full h-12 px-4 rounded-lg border-2 transition-all outline-none"
                        style={{
                          borderColor: '#FFA200',
                          color: '#315B78',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Quantity (Quintals)
                      </label>
                      <input
                        type="text"
                        value={formData.quantityQtls}
                        readOnly
                        className="w-full h-12 px-4 rounded-lg border outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#027F83',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: '#F2FCFB'
                        }}
                      />
                      <p className="mt-1" style={{ color: '#666', fontSize: '12px' }}>Auto-calculated</p>
                    </div>
                    <div>
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Total Value (₹)
                      </label>
                      <input
                        type="text"
                        value={formData.value}
                        readOnly
                        className="w-full h-12 px-4 rounded-lg border outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#00A040',
                          fontSize: '14px',
                          fontWeight: '600',
                          backgroundColor: '#F2FCFB'
                        }}
                      />
                      <p className="mt-1" style={{ color: '#666', fontSize: '12px' }}>Auto-calculated</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                    Bill Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.billNo}
                    onChange={(e) => setFormData({ ...formData, billNo: e.target.value })}
                    placeholder="Auto-generated if left blank"
                    className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                    style={{
                      borderColor: '#CCD8DF',
                      color: '#315B78',
                      fontSize: '14px',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 h-12 rounded-lg transition-all hover:opacity-90"
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
                    disabled={!formData.commodity || !formData.center || !formData.bags}
                    className="flex items-center justify-center gap-2 px-8 h-12 rounded-lg transition-all hover:opacity-90 disabled:opacity-50"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#027F83',
                      border: '1px solid #027F83',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = '#E6F7F7';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Check className="w-5 h-5" />
                    Submit Transaction
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column - Live Summary & Quick Actions */}
            <div className="space-y-6">
              
              {/* Live Utilization Summary */}
              <div className="bg-white rounded-xl p-4 md:p-6 border" style={{ borderColor: '#E5EBEF' }}>
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#315B78', fontSize: '16px', fontWeight: '600' }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#027F83' }} />
                  Utilization Summary
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#F2FCFB' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span style={{ color: '#666', fontSize: '12px' }}>Daily Limit</span>
                      <span style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>
                        {farmerData.commodityDailyUtilized}/{farmerData.commodityDailyLimit} Qtls
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5EBEF' }}>
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          backgroundColor: '#027F83',
                          width: `${(farmerData.commodityDailyUtilized / farmerData.commodityDailyLimit) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#F2FCFB' }}>
                    <div className="flex justify-between items-center mb-2">
                      <span style={{ color: '#666', fontSize: '12px' }}>Total Limit</span>
                      <span style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>
                        {farmerData.commodityTotalUtilized}/{farmerData.totalUtilizationLimit} Qtls
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E5EBEF' }}>
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          backgroundColor: '#00A040',
                          width: `${(farmerData.commodityTotalUtilized / farmerData.totalUtilizationLimit) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3">
                    <div className="text-center p-2 rounded" style={{ backgroundColor: '#F7F9FA' }}>
                      <div style={{ color: '#666', fontSize: '11px' }}>Proc Limit</div>
                      <div style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>{farmerData.farmerProcLimit}</div>
                    </div>
                    <div className="text-center p-2 rounded" style={{ backgroundColor: '#F7F9FA' }}>
                      <div style={{ color: '#666', fontSize: '11px' }}>Center Limit</div>
                      <div style={{ color: '#315B78', fontSize: '14px', fontWeight: '600' }}>{farmerData.totalCenterUtilizationLimit}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions - Quick Fill */}
              <div className="bg-white rounded-xl p-4 md:p-6 border" style={{ borderColor: '#E5EBEF' }}>
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#315B78', fontSize: '16px', fontWeight: '600' }}>
                  <Clock className="w-5 h-5" style={{ color: '#027F83' }} />
                  Recent Transactions
                </h3>
                <div className="space-y-2">
                  {farmerData.recentTransactions.map((trans: any, idx: number) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-lg border cursor-pointer transition-all hover:border-opacity-100"
                      style={{ 
                        borderColor: '#CCD8DF',
                        backgroundColor: '#F7F9FA'
                      }}
                      onClick={() => handleQuickFill(trans)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span style={{ color: '#666', fontSize: '12px' }}>{trans.date}</span>
                        <button
                          type="button"
                          className="flex items-center gap-1 px-2 py-1 rounded transition-all"
                          style={{ 
                            backgroundColor: 'transparent',
                            color: '#027F83',
                            border: '1px solid #027F83',
                            fontSize: '11px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E6F7F7';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Copy className="w-3 h-3" />
                          Use
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div style={{ color: '#666', fontSize: '11px' }}>Bags</div>
                          <div style={{ color: '#315B78', fontSize: '13px', fontWeight: '600' }}>{trans.bags}</div>
                        </div>
                        <div>
                          <div style={{ color: '#666', fontSize: '11px' }}>Qty</div>
                          <div style={{ color: '#315B78', fontSize: '13px', fontWeight: '600' }}>{trans.quantity}</div>
                        </div>
                        <div>
                          <div style={{ color: '#666', fontSize: '11px' }}>Value</div>
                          <div style={{ color: '#315B78', fontSize: '13px', fontWeight: '600' }}>₹{trans.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-center" style={{ color: '#666', fontSize: '12px' }}>
                  Click "Use" to quick-fill similar transaction
                </p>
              </div>

              {/* Survey Details */}
              {farmerData.surveyDetails && farmerData.surveyDetails.length > 0 && (
                <div className="bg-white rounded-xl p-4 md:p-6 border" style={{ borderColor: '#E5EBEF' }}>
                  <h3 className="mb-4" style={{ color: '#315B78', fontSize: '16px', fontWeight: '600' }}>
                    Land Details
                  </h3>
                  <div className="space-y-2">
                    {farmerData.surveyDetails.map((survey: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                        <div className="flex justify-between items-center mb-1">
                          <span style={{ color: '#315B78', fontSize: '13px', fontWeight: '600' }}>{survey.market}</span>
                          <span style={{ color: '#666', fontSize: '12px' }}>Survey: {survey.surveyNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: '#666', fontSize: '12px' }}>Acreage: {survey.acreage} acres</span>
                          <span style={{ color: '#027F83', fontSize: '12px', fontWeight: '600' }}>Limit: {survey.utilizationLimit} Qtls</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Empty State */}
          {!farmerData && (
            <div className="bg-white rounded-xl p-12 text-center border" style={{ borderColor: '#E5EBEF' }}>
              <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCD8DF' }} />
              <h3 className="mb-2" style={{ color: '#315B78', fontSize: '18px', fontWeight: '600' }}>
                Search for a Farmer to Begin
            </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Enter an Aadhar number above to load farmer details and start a transaction
              </p>
              <p className="mt-4" style={{ color: '#999', fontSize: '12px' }}>
                Try: 900000000001 (demo)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
