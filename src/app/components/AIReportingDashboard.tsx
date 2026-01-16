import React, { useState, useEffect, useRef } from 'react';
import {
  Home, ChevronRight, BarChart3, TrendingUp, TrendingDown, Brain, Zap,
  Search, Mic, Sparkles, Filter, Download, RefreshCw, AlertTriangle,
  Users, Package, ShoppingCart, Warehouse, DollarSign, FileText, Calendar,
  PieChart, Activity, ArrowUpRight, ArrowDownRight, Eye, MoreVertical,
  Target, Award, AlertCircle, CheckCircle2, XCircle, Clock, MapPin,
  Building2, UserCheck, Truck, Receipt, CreditCard, TrendingUp as TrendUp,
  Lightbulb, Shield, Target as TargetIcon, Gauge, LineChart, X
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface AIInsight {
  id: string;
  type: 'Trend' | 'Anomaly' | 'Prediction' | 'Recommendation' | 'Alert';
  category: string;
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  confidence: number;
  data: any;
  actionable: boolean;
  action?: string;
  timestamp: string;
}

interface ReportQuery {
  id: string;
  query: string;
  response: string;
  data: any;
  timestamp: string;
  type: 'Summary' | 'Comparison' | 'Trend' | 'Detail' | 'Prediction';
}

interface ModuleSummary {
  module: string;
  icon: any;
  totalRecords: number;
  recentActivity: number;
  growth: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  insights: string[];
  lastUpdated: string;
}

export default function AIReportingDashboard() {
  // View State
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'insights' | 'queries'>('overview');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 Days');

  // AI Query State
  const [aiQuery, setAiQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<ReportQuery[]>([]);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [queryResponse, setQueryResponse] = useState<any>(null);
  const [nlpSuggestion, setNlpSuggestion] = useState('');

  // Voice Search
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Filter State
  const [filters, setFilters] = useState({
    dateRange: 'Last 30 Days',
    modules: 'All',
    insightType: 'All'
  });

  // Dropdown States
  const [dateRangeDropdownOpen, setDateRangeDropdownOpen] = useState(false);
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [insightTypeDropdownOpen, setInsightTypeDropdownOpen] = useState(false);

  const dateRangeRef = useRef<HTMLDivElement | null>(null);
  const modulesRef = useRef<HTMLDivElement | null>(null);
  const insightTypeRef = useRef<HTMLDivElement | null>(null);

  // Mock AI Insights
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'Prediction',
      category: 'Inventory',
      title: 'Wheat Inventory Depletion Risk',
      description: 'Based on current dispatch patterns, wheat inventory at Main Procurement Center will deplete in 12 days. Recommend immediate procurement planning.',
      impact: 'High',
      confidence: 94,
      data: { currentStock: 500, dailyConsumption: 42, daysRemaining: 12 },
      actionable: true,
      action: 'Plan procurement for 800 QTL wheat',
      timestamp: '2025-01-20 10:30 AM'
    },
    {
      id: '2',
      type: 'Anomaly',
      category: 'Lot Entry',
      title: 'Unusual Lot Entry Pattern Detected',
      description: 'Detected 3 consecutive lot entries from same farmer (Farmer One) within 2 hours. Possible duplicate entry or system issue.',
      impact: 'Medium',
      confidence: 87,
      data: { farmerId: 'F2024001', entries: 3, timeWindow: '2 hours' },
      actionable: true,
      action: 'Review lot entries for F2024001',
      timestamp: '2025-01-20 09:15 AM'
    },
    {
      id: '3',
      type: 'Trend',
      category: 'Dispatch',
      title: 'Dispatch Volume Increasing',
      description: 'Dispatch volume has increased by 23% compared to last week. This trend is expected to continue based on historical patterns.',
      impact: 'Low',
      confidence: 82,
      data: { currentWeek: 1250, lastWeek: 1015, growth: 23 },
      actionable: false,
      timestamp: '2025-01-20 08:45 AM'
    },
    {
      id: '4',
      type: 'Recommendation',
      category: 'WHR',
      title: 'Optimize Warehouse Utilization',
      description: 'Central Warehouse is 78% utilized. Consider redistributing inventory to other warehouses to optimize space utilization.',
      impact: 'Medium',
      confidence: 89,
      data: { utilization: 78, capacity: 1000, current: 780 },
      actionable: true,
      action: 'Review warehouse distribution strategy',
      timestamp: '2025-01-20 07:20 AM'
    },
    {
      id: '5',
      type: 'Alert',
      category: 'Payment',
      title: 'Payment Processing Delay',
      description: '3 payment transactions are pending approval for more than 48 hours. This exceeds normal processing time.',
      impact: 'High',
      confidence: 95,
      data: { pendingCount: 3, avgDelay: '52 hours' },
      actionable: true,
      action: 'Review pending payments',
      timestamp: '2025-01-20 06:10 AM'
    }
  ]);

  // Module Summaries
  const moduleSummaries: ModuleSummary[] = [
    {
      module: 'Registration',
      icon: Users,
      totalRecords: 1250,
      recentActivity: 45,
      growth: 12.5,
      status: 'Healthy',
      insights: ['New farmer registrations up 12%', 'User approval rate: 94%'],
      lastUpdated: '2025-01-20 10:00 AM'
    },
    {
      module: 'Lot Entry',
      icon: Package,
      totalRecords: 3420,
      recentActivity: 128,
      growth: 8.3,
      status: 'Healthy',
      insights: ['Average lot size: 5.2 QTL', 'Peak entry time: 10-11 AM'],
      lastUpdated: '2025-01-20 10:15 AM'
    },
    {
      module: 'Inventory',
      icon: Warehouse,
      totalRecords: 1850,
      recentActivity: 67,
      growth: -2.1,
      status: 'Warning',
      insights: ['3 loss alerts detected', 'Wheat stock depleting'],
      lastUpdated: '2025-01-20 10:30 AM'
    },
    {
      module: 'Dispatch',
      icon: Truck,
      totalRecords: 2100,
      recentActivity: 89,
      growth: 23.4,
      status: 'Healthy',
      insights: ['Dispatch efficiency: 96%', 'On-time delivery: 98%'],
      lastUpdated: '2025-01-20 09:45 AM'
    },
    {
      module: 'WHR',
      icon: Receipt,
      totalRecords: 1560,
      recentActivity: 52,
      growth: 15.7,
      status: 'Healthy',
      insights: ['WHR approval rate: 97%', 'Average processing time: 2.5 hours'],
      lastUpdated: '2025-01-20 09:30 AM'
    },
    {
      module: 'Payment',
      icon: CreditCard,
      totalRecords: 2890,
      recentActivity: 134,
      growth: 18.9,
      status: 'Warning',
      insights: ['3 payments pending >48h', 'Payment success rate: 99.2%'],
      lastUpdated: '2025-01-20 10:05 AM'
    }
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setDateRangeDropdownOpen(false);
      }
      if (modulesRef.current && !modulesRef.current.contains(event.target as Node)) {
        setModulesDropdownOpen(false);
      }
      if (insightTypeRef.current && !insightTypeRef.current.contains(event.target as Node)) {
        setInsightTypeDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NLP Query Processing
  useEffect(() => {
    if (aiQuery.trim()) {
      const query = aiQuery.toLowerCase();
      
      if (query.includes('inventory') || query.includes('stock')) {
        setNlpSuggestion('Analyzing inventory data across all locations...');
      } else if (query.includes('loss') || query.includes('missing')) {
        setNlpSuggestion('Identifying loss patterns and anomalies...');
      } else if (query.includes('trend') || query.includes('growth')) {
        setNlpSuggestion('Calculating trends and growth patterns...');
      } else if (query.includes('compare') || query.includes('vs')) {
        setNlpSuggestion('Preparing comparative analysis...');
      } else if (query.includes('predict') || query.includes('forecast')) {
        setNlpSuggestion('Running predictive models...');
      } else {
        setNlpSuggestion('Processing your query with AI...');
      }
    } else {
      setNlpSuggestion('');
    }
  }, [aiQuery]);

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
      setAiQuery(transcript);
      setIsListening(false);
      setIsProcessingVoice(true);

      setTimeout(() => {
        setIsProcessingVoice(false);
        handleAIQuery(transcript);
      }, 500);
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

  // Process AI Query
  const handleAIQuery = async (query?: string) => {
    const queryText = query || aiQuery;
    if (!queryText.trim()) return;

    setIsProcessingQuery(true);
    setNlpSuggestion('Processing with AI...');

    // Simulate AI processing
    setTimeout(() => {
      const mockResponse = generateAIResponse(queryText);
      const newQuery: ReportQuery = {
        id: Date.now().toString(),
        query: queryText,
        response: mockResponse.summary,
        data: mockResponse.data,
        timestamp: new Date().toISOString(),
        type: mockResponse.type
      };

      setQueryHistory([newQuery, ...queryHistory]);
      setQueryResponse(mockResponse);
      setAiQuery('');
      setIsProcessingQuery(false);
      setNlpSuggestion('');
    }, 2000);
  };

  // Generate AI Response (Mock)
  const generateAIResponse = (query: string): any => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
      return {
        type: 'Summary',
        summary: '**Inventory Overview**\n\nTotal Inventory: 1,850 QTL across 12 locations\n- Centers: 800 QTL\n- Societies: 450 QTL\n- Warehouses: 600 QTL\n\n**Key Insights:**\n- 3 loss alerts detected (total loss: 15 QTL)\n- Wheat inventory depleting at Main Center (12 days remaining)\n- Optimal stock levels maintained at 78% of capacity',
        data: {
          total: 1850,
          byLocation: { centers: 800, societies: 450, warehouses: 600 },
          alerts: 3,
          losses: 15
        }
      };
    } else if (lowerQuery.includes('loss') || lowerQuery.includes('missing')) {
      return {
        type: 'Detail',
        summary: '**Loss Analysis**\n\nTotal Losses Detected: 15 QTL (0.8% of total inventory)\n\n**Breakdown:**\n- Main Procurement Center: 5 QTL (moisture loss)\n- North Zone Center: 7 QTL (handling loss)\n- Central Warehouse: 3 QTL (storage loss)\n\n**AI Recommendation:** Review storage conditions and handling procedures at North Zone Center. Loss rate is 1.4% which exceeds normal threshold.',
        data: {
          totalLoss: 15,
          locations: [
            { name: 'Main Procurement Center', loss: 5, type: 'moisture' },
            { name: 'North Zone Center', loss: 7, type: 'handling' },
            { name: 'Central Warehouse', loss: 3, type: 'storage' }
          ]
        }
      };
    } else if (lowerQuery.includes('trend') || lowerQuery.includes('growth')) {
      return {
        type: 'Trend',
        summary: '**Growth Trends Analysis**\n\n**Positive Trends:**\n- Dispatch volume: +23.4% (week-over-week)\n- WHR creation: +15.7%\n- Payment processing: +18.9%\n\n**Areas of Concern:**\n- Inventory levels: -2.1% (depletion risk)\n\n**Predictions:**\n- Dispatch volume expected to increase 15% next week\n- Inventory replenishment needed within 10 days',
        data: {
          trends: [
            { metric: 'Dispatch', change: 23.4, direction: 'up' },
            { metric: 'WHR', change: 15.7, direction: 'up' },
            { metric: 'Payment', change: 18.9, direction: 'up' },
            { metric: 'Inventory', change: -2.1, direction: 'down' }
          ]
        }
      };
    } else if (lowerQuery.includes('compare') || lowerQuery.includes('vs')) {
      return {
        type: 'Comparison',
        summary: '**Comparative Analysis**\n\n**Center Performance:**\n- Main Procurement Center: 342 lots, 98% efficiency\n- North Zone Center: 289 lots, 95% efficiency\n- South Zone Center: 256 lots, 97% efficiency\n\n**Top Performer:** Main Procurement Center leads in volume and efficiency.',
        data: {
          centers: [
            { name: 'Main Procurement Center', lots: 342, efficiency: 98 },
            { name: 'North Zone Center', lots: 289, efficiency: 95 },
            { name: 'South Zone Center', lots: 256, efficiency: 97 }
          ]
        }
      };
    } else {
      return {
        type: 'Summary',
        summary: '**System Overview**\n\n**Total Activity:**\n- 12,270 total records across all modules\n- 515 recent activities in last 24 hours\n- 94% system health score\n\n**Key Highlights:**\n- All modules operating normally\n- 5 AI insights generated\n- 3 alerts requiring attention\n\n**Recommendations:**\n- Review pending payments (3 items)\n- Monitor inventory levels\n- Optimize warehouse utilization',
        data: {
          totalRecords: 12270,
          recentActivity: 515,
          healthScore: 94,
          alerts: 3
        }
      };
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'Prediction': return Brain;
      case 'Anomaly': return AlertTriangle;
      case 'Trend': return TrendingUp;
      case 'Recommendation': return Lightbulb;
      case 'Alert': return AlertCircle;
      default: return Zap;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'Prediction': return { bg: '#E6F7F7', text: '#027F83', border: '#027F83' };
      case 'Anomaly': return { bg: '#FFF5F5', text: '#E94545', border: '#E94545' };
      case 'Trend': return { bg: '#F0FDF4', text: '#00A040', border: '#00A040' };
      case 'Recommendation': return { bg: '#FFFBF0', text: '#FFA200', border: '#FFA200' };
      case 'Alert': return { bg: '#FFF5F5', text: '#E94545', border: '#E94545' };
      default: return { bg: '#F7F9FA', text: '#666', border: '#CCD8DF' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return { bg: '#F0FDF4', text: '#00A040', dot: '#00A040' };
      case 'Warning': return { bg: '#FFFBF0', text: '#FFA200', dot: '#FFA200' };
      case 'Critical': return { bg: '#FFF5F5', text: '#E94545', dot: '#E94545' };
      default: return { bg: '#F7F9FA', text: '#666', dot: '#666' };
    }
  };

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
        <span style={{ fontWeight: '600', color: '#222' }}>AI Reporting Dashboard</span>
      </div>

      {/* Header */}
      {/* <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
            <Brain className="w-6 h-6" style={{ color: '#027F83' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
              AI Reporting Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Intelligent Insights Across All Modules • Powered by AI & ML
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="h-12 px-4 rounded-lg border transition-all flex items-center gap-2"
            style={{
              borderColor: '#CCD8DF',
              backgroundColor: '#FFFFFF',
              color: '#027F83'
            }}
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const csv = [
                ['Module', 'Total Records', 'Recent Activity', 'Growth %', 'Status'].join(','),
                ...moduleSummaries.map(m => [
                  m.module,
                  m.totalRecords,
                  m.recentActivity,
                  m.growth,
                  m.status
                ].join(','))
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'ai-report-dashboard.csv';
              a.click();
            }}
            className="h-12 px-4 rounded-lg border transition-all flex items-center gap-2"
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
      </div> */}

      {/* AI Query Interface */}
      <div className="mb-6 rounded-xl border-2 overflow-visible" style={{ borderColor: '#027F83', backgroundColor: '#FFFFFF' }}>
        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: '#E5EBEF', backgroundColor: '#F0FDF4' }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
            <Zap className="w-5 h-5" style={{ color: '#027F83' }} />
          </div>
          <div className="flex-1">
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
              Ask AI Anything
            </h2>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Get instant insights using natural language. Try: "Show me inventory losses", "Compare center performance", "Predict next week trends"
            </p>
          </div>
        </div>
        <div className="p-6 relative" style={{ zIndex: 10 }}>
          <div className="relative">
            <div 
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: '#F2FCFB' }}
            >
              <Search className="w-4 h-4" style={{ color: '#027F83' }} />
            </div>
            <input
              type="text"
              placeholder="Ask me anything... e.g., 'Show inventory status', 'Compare all centers', 'Predict next week trends'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAIQuery()}
              disabled={isProcessingQuery}
              className="h-14 pl-14 pr-24 rounded-lg border transition-all outline-none"
              style={{
                borderColor: '#CCD8DF',
                color: '#222222',
                fontSize: '14px',
                backgroundColor: '#FFFFFF',
                width: '100%'
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
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={handleVoiceSearch}
                disabled={isListening || isProcessingVoice || isProcessingQuery}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all disabled:opacity-50"
                style={{
                  backgroundColor: isListening ? '#FF6B6B' : isProcessingVoice ? '#FFA500' : 'transparent'
                }}
                title={isListening ? 'Listening...' : isProcessingVoice ? 'Processing...' : 'Voice input'}
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
              <button
                onClick={() => handleAIQuery()}
                disabled={!aiQuery.trim() || isProcessingQuery}
                className="h-8 px-4 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                style={{
                  backgroundColor: isProcessingQuery ? '#CCD8DF' : '#027F83',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                {isProcessingQuery ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Ask AI
                  </>
                )}
              </button>
            </div>
            {nlpSuggestion && (
              <div className="absolute top-full left-0 mt-2 px-3 py-1.5 rounded-md z-50 shadow-lg" style={{ backgroundColor: '#E6F7F7', fontSize: '12px', fontWeight: '600', color: '#027F83', border: '1px solid #027F83' }}>
                <Sparkles className="w-3 h-3 inline mr-1" />
                {nlpSuggestion}
              </div>
            )}
          </div>

          {/* Query Response */}
          {queryResponse && (
            <div className="mt-6 p-6 rounded-lg border-2" style={{ borderColor: '#027F83', backgroundColor: '#F0FDF4' }}>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                  <Brain className="w-5 h-5" style={{ color: '#027F83' }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                    AI Response
                  </h3>
                  <div 
                    className="prose prose-sm max-w-none"
                    style={{ 
                      fontSize: '14px', 
                      color: '#333',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap'
                    }}
                    dangerouslySetInnerHTML={{ __html: queryResponse.summary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                </div>
                <button
                  onClick={() => {
                    setQueryResponse(null);
                    setAiQuery('');
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4" style={{ color: '#666' }} />
                </button>
              </div>
            </div>
          )}

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="mt-4">
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
                Recent Queries
              </h4>
              <div className="space-y-2">
                {queryHistory.slice(0, 3).map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setAiQuery(q.query);
                      setQueryResponse({ summary: q.response, data: q.data, type: q.type });
                    }}
                    className="w-full text-left p-3 rounded-lg border transition-all hover:bg-gray-50"
                    style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#003A5D', marginBottom: '4px' }}>
                      {q.query}
                    </p>
                    <p style={{ fontSize: '11px', color: '#666' }}>
                      {new Date(q.timestamp).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2 border-b" style={{ borderColor: '#E5EBEF' }}>
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: LineChart },
          { id: 'insights', label: 'AI Insights', icon: Brain },
          { id: 'queries', label: 'Query History', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-6 py-3 relative transition-all flex items-center gap-2"
              style={{
                color: activeTab === tab.id ? '#027F83' : '#666',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '14px'
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#027F83' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Module Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleSummaries.map((module) => {
              const Icon = module.icon;
              const statusColors = getStatusColor(module.status);
              return (
                <div 
                  key={module.module}
                  className="p-6 rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer"
                  style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}
                  onClick={() => setSelectedModule(module.module)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                      <Icon className="w-6 h-6" style={{ color: '#027F83' }} />
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: statusColors.dot }}
                      />
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                      >
                        {module.status}
                      </span>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                    {module.module}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#666' }}>Total Records</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                        {module.totalRecords.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#666' }}>Recent Activity</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#027F83' }}>
                        {module.recentActivity} (24h)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#666' }}>Growth</span>
                      <div className="flex items-center gap-1">
                        {module.growth >= 0 ? (
                          <TrendingUp className="w-3 h-3" style={{ color: '#00A040' }} />
                        ) : (
                          <TrendingDown className="w-3 h-3" style={{ color: '#E94545' }} />
                        )}
                        <span 
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: module.growth >= 0 ? '#00A040' : '#E94545' 
                          }}
                        >
                          {module.growth >= 0 ? '+' : ''}{module.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t" style={{ borderColor: '#E5EBEF' }}>
                    <p style={{ fontSize: '12px', fontWeight: '600', color: '#777', marginBottom: '4px' }}>
                      AI Insights:
                    </p>
                    <ul className="space-y-1">
                      {module.insights.map((insight, idx) => (
                        <li key={idx} style={{ fontSize: '12px', color: '#666' }}>
                          • {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase' }}>
                  Total Records
                </span>
                <FileText className="w-5 h-5" style={{ color: '#027F83' }} />
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#003A5D' }}>
                {moduleSummaries.reduce((sum, m) => sum + m.totalRecords, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase' }}>
                  Recent Activity
                </span>
                <Activity className="w-5 h-5" style={{ color: '#00A040' }} />
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#00A040' }}>
                {moduleSummaries.reduce((sum, m) => sum + m.recentActivity, 0)}
              </p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Last 24 hours</p>
            </div>
            <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase' }}>
                  AI Insights
                </span>
                <Brain className="w-5 h-5" style={{ color: '#FFA200' }} />
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#FFA200' }}>
                {aiInsights.length}
              </p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Active insights</p>
            </div>
            <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase' }}>
                  System Health
                </span>
                <Shield className="w-5 h-5" style={{ color: '#00A040' }} />
              </div>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#00A040' }}>
                94%
              </p>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>All systems operational</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '16px' }}>
                Module Performance
              </h3>
              <div className="space-y-4">
                {moduleSummaries.map((module) => (
                  <div key={module.module}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                        {module.module}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: module.growth >= 0 ? '#00A040' : '#E94545' }}>
                        {module.growth >= 0 ? '+' : ''}{module.growth}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F7F9FA' }}>
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(Math.abs(module.growth) * 5, 100)}%`,
                          backgroundColor: module.growth >= 0 ? '#00A040' : '#E94545'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '16px' }}>
                Activity Distribution
              </h3>
              <div className="space-y-3">
                {moduleSummaries.map((module) => {
                  const Icon = module.icon;
                  const percentage = (module.recentActivity / moduleSummaries.reduce((sum, m) => sum + m.recentActivity, 0)) * 100;
                  return (
                    <div key={module.module} className="flex items-center gap-3">
                      <Icon className="w-4 h-4" style={{ color: '#027F83' }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#003A5D' }}>
                            {module.module}
                          </span>
                          <span style={{ fontSize: '13px', color: '#666' }}>
                            {module.recentActivity} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F7F9FA' }}>
                          <div 
                            className="h-2 rounded-full transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: '#027F83'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {aiInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colors = getInsightColor(insight.type);
            return (
              <div 
                key={insight.id}
                className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.bg
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                    <Icon className="w-5 h-5" style={{ color: colors.text }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: colors.text, color: '#FFFFFF' }}
                          >
                            {insight.type}
                          </span>
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: '#FFFFFF', color: '#666' }}
                          >
                            {insight.category}
                          </span>
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-semibold"
                            style={{ 
                              backgroundColor: insight.impact === 'High' ? '#E94545' : 
                                           insight.impact === 'Medium' ? '#FFA200' : '#00A040',
                              color: '#FFFFFF'
                            }}
                          >
                            {insight.impact} Impact
                          </span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                          {insight.title}
                        </h3>
                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                          {insight.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="mb-2">
                          <span style={{ fontSize: '12px', color: '#666' }}>Confidence</span>
                          <p style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>
                            {insight.confidence}%
                          </p>
                        </div>
                        <span style={{ fontSize: '11px', color: '#666' }}>
                          {insight.timestamp}
                        </span>
                      </div>
                    </div>
                    {insight.actionable && insight.action && (
                      <div className="pt-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" style={{ color: '#FFA200' }} />
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#003A5D' }}>
                            Recommended Action:
                          </span>
                          <span style={{ fontSize: '13px', color: '#666' }}>
                            {insight.action}
                          </span>
                        </div>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                          style={{
                            backgroundColor: colors.text,
                            color: '#FFFFFF'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                        >
                          Take Action
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Query History Tab */}
      {activeTab === 'queries' && (
        <div className="space-y-4">
          {queryHistory.length > 0 ? (
            queryHistory.map((query) => (
              <div 
                key={query.id}
                className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
                style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                    <Brain className="w-5 h-5" style={{ color: '#027F83' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: '#E6F7F7', color: '#027F83' }}
                      >
                        {query.type}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(query.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                      {query.query}
                    </h3>
                    <div 
                      className="prose prose-sm max-w-none p-4 rounded-lg"
                      style={{ 
                        backgroundColor: '#F7F9FA',
                        fontSize: '14px', 
                        color: '#333',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap'
                      }}
                      dangerouslySetInnerHTML={{ __html: query.response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
              <Brain className="w-16 h-16 mx-auto mb-4" style={{ color: '#E5EBEF' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                No Query History
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>
                Start asking questions using the AI query interface above
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
