import React, { useState, useEffect, useRef } from 'react';
import {
  Home, ChevronRight, BarChart3, TrendingUp, TrendingDown, Brain, Zap,
  Search, Mic, Sparkles, Filter, Download, RefreshCw, AlertTriangle,
  Users, Package, ShoppingCart, Warehouse, DollarSign, FileText, Calendar,
  Activity, ArrowUpRight, ArrowDownRight, Eye, MoreVertical,
  Target, Award, AlertCircle, CheckCircle2, XCircle, Clock, MapPin,
  Building2, UserCheck, Truck, Receipt, CreditCard, TrendingUp as TrendUp,
  Lightbulb, Shield, Gauge, LineChart, X, ChevronDown, ChevronUp,
  Settings, BookOpen, Layers, Database, Globe, ChartBar, Table2,
  Grid3x3, List, LayoutGrid, ArrowRight, Play, Pause, Maximize2,
  Minimize2, Share2, Bookmark, BookmarkCheck, History, Star, Upload
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';
import BaseReportViewer from '@/app/components/reports/BaseReportViewer';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ReportConfig {
  id: string;
  name: string;
  category: 'daily' | 'farmer' | 'procurement' | 'payment';
  icon: any;
  description: string;
  filters: string[];
  columns: string[];
  defaultView: 'table' | 'chart' | 'graph' | 'map';
  aiKeywords: string[];
  priority: number;
}

interface AIInsight {
  id: string;
  type: 'anomaly' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  action?: string;
  data?: any;
}

interface ReportData {
  reportType: string;
  filters: Record<string, any>;
  columns: string[];
  data: any[];
  insights: AIInsight[];
  generatedAt: string;
}

export default function UnifiedReportingDashboard() {
  // View State
  const [activeCategory, setActiveCategory] = useState<'daily' | 'farmer' | 'procurement' | 'payment' | 'all'>('all');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'table' | 'chart' | 'graph' | 'map'>('table');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Query State
  const [aiQuery, setAiQuery] = useState('');
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [queryResponse, setQueryResponse] = useState<ReportData | null>(null);
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [showQueryHistory, setShowQueryHistory] = useState(false);

  // Voice Search
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [savedFilters, setSavedFilters] = useState<Record<string, any>>({});

  // UI State
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentReports, setRecentReports] = useState<string[]>([]);
  const [showInsights, setShowInsights] = useState(true);

  // Report Configurations
  const reportConfigs: ReportConfig[] = [
    // Daily Reports
    {
      id: 'procurementStatus',
      name: 'Procurement Status Report',
      category: 'daily',
      icon: Package,
      description: 'Real-time procurement status with trends and analytics',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'farmerId', 'lotId', 'status', 'fromDate', 'toDate'],
      columns: ['state', 'season', 'commodity', 'slaName', 'societyName', 'center', 'district', 'centerName', 'farmerId', 'farmerName', 'farmerMobile', 'lotId', 'lotCreatedDate', 'quantityQtl', 'bags', 'valueRs', 'pendingAmount', 'dispatchQuantityQtl', 'pendingQuantityQtl', 'ageInDays', 'whrNumber', 'wspName', 'pendingStageStatus', 'lastPaymentDate', 'lastLiquidationDate', 'symRefNoWithUtrNo'],
      defaultView: 'graph',
      aiKeywords: ['procurement status', 'procurement report', 'procurement data', 'procurement trends'],
      priority: 1
    },
    {
      id: 'lotPendingPayment',
      name: 'Lot Wise Pending Payment',
      category: 'daily',
      icon: DollarSign,
      description: 'Track pending payments by lot with risk assessment',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'farmerId', 'lotId'],
      columns: ['lotId', 'farmerId', 'farmerName', 'commodity', 'quantityQtl', 'bags', 'valueRs', 'pendingAmount', 'paymentStatus', 'ageInDays', 'lastPaymentDate', 'paymentStage', 'utrNumber'],
      defaultView: 'table',
      aiKeywords: ['pending payment', 'lot payment', 'payment status', 'unpaid lots'],
      priority: 2
    },
    {
      id: 'dispatchReport',
      name: 'Dispatch Report',
      category: 'daily',
      icon: Truck,
      description: 'Comprehensive dispatch tracking and analytics',
      filters: ['yearSeason', 'scheme', 'state', 'stateAgency', 'district', 'fpoPacs', 'center', 'dispatchId', 'status', 'fromDate', 'toDate'],
      columns: ['state', 'stateAgency', 'pacsFpo', 'district', 'center', 'warehouse', 'dispatchId', 'dispatchQtyQtl', 'dispatchBag', 'replacedLotDispatchQty', 'replacedLotDispatchBag', 'noOfLots', 'valueRs', 'createdDate', 'status'],
      defaultView: 'table',
      aiKeywords: ['dispatch', 'dispatch report', 'dispatch tracking', 'delivery status'],
      priority: 3
    },
    {
      id: 'districtProcurement',
      name: 'District Wise Procurement Status',
      category: 'daily',
      icon: MapPin,
      description: 'Geographic procurement analysis by district',
      filters: ['yearSeason', 'scheme', 'state', 'district'],
      columns: ['state', 'district', 'registeredPacsFpos', 'noOfFarmersRegistered', 'quantityPurchasedMt', 'noOfFarmersBenefited'],
      defaultView: 'map',
      aiKeywords: ['district procurement', 'geographic procurement', 'district wise', 'location based'],
      priority: 4
    },
    {
      id: 'whrReport',
      name: 'WHR Report',
      category: 'daily',
      icon: Receipt,
      description: 'Warehouse Receipt tracking and status',
      filters: ['yearSeason', 'scheme', 'state', 'stateAgency', 'district', 'fpoPacs', 'center', 'whrNo', 'status', 'fromDate', 'toDate'],
      columns: ['state', 'season', 'scheme', 'commodity', 'district', 'sla', 'pacsFpos', 'center', 'warehouse', 'whrDate', 'whrNumber', 'status', 'whrCreatedDate', 'dispatchQuantityQtl', 'dispatchBags', 'acceptedQuantity', 'acceptedBags', 'quantityLossQtl', 'bagsLoss', 'replacedQuantity', 'replacedBags', 'replacedWhrNo', 'rejectedQuantityQtl', 'rejectedBags', 'quantityGainQtl', 'bagsGain', 'creatorRemark', 'rejectRemark'],
      defaultView: 'table',
      aiKeywords: ['whr', 'warehouse receipt', 'whr report', 'warehouse status'],
      priority: 5
    },
    // Farmer Reports
    {
      id: 'provisionalRegistration',
      name: 'Provisional Registration',
      category: 'farmer',
      icon: UserCheck,
      description: 'Track provisional farmer registrations',
      filters: ['state', 'commodity', 'district', 'taluka', 'village', 'mobileNumber', 'aadhaarNumber'],
      columns: ['stateName', 'districtName', 'taluka', 'village', 'pacsName', 'mobileNumber', 'aadhaarNo', 'farmerName', 'commodity', 'registeredForScheme', 'dataSource', 'registrationDate'],
      defaultView: 'table',
      aiKeywords: ['provisional registration', 'farmer registration', 'pending registration'],
      priority: 1
    },
    {
      id: 'farmerSummary',
      name: 'Farmer Summary',
      category: 'farmer',
      icon: Users,
      description: 'Comprehensive farmer summary and analytics',
      filters: ['yearSeason', 'scheme', 'state', 'district', 'fpoPacs', 'fromDate', 'toDate'],
      columns: ['pacsFpo', 'appliedRegistrations', 'approvedRegistrations', 'revertedRegistrations', 'deemedApproved', 'totalRegistrations'],
      defaultView: 'chart',
      aiKeywords: ['farmer summary', 'farmer statistics', 'registration summary'],
      priority: 2
    },
    {
      id: 'farmerLandDetails',
      name: 'Farmer Land Details',
      category: 'farmer',
      icon: MapPin,
      description: 'Detailed land information for farmers',
      filters: ['state', 'district', 'taluka', 'village', 'surveyNo', 'khataNo', 'seasonId', 'commodity'],
      columns: ['farmerId', 'farmerName', 'state', 'district', 'taluka', 'village', 'season', 'commodity', 'khataNo', 'surveyNo', 'sowingAreaHectare', 'sowingAreaAcre', 'marketCode'],
      defaultView: 'table',
      aiKeywords: ['land details', 'farmer land', 'land information', 'sowing area'],
      priority: 3
    },
    {
      id: 'schemeWiseFarmer',
      name: 'Scheme Wise Farmer Details',
      category: 'farmer',
      icon: FileText,
      description: 'Farmer participation by scheme',
      filters: ['yearSeason', 'scheme', 'state', 'stateAgency', 'fpoPacs', 'center', 'farmerId', 'applicationId', 'status', 'fromDate', 'toDate'],
      columns: ['applicationId', 'farmerId', 'farmerName', 'mobileNumber', 'farmerState', 'farmerDistrict', 'gender', 'casteCategory', 'accountNo', 'ifscCode', 'bankName', 'branchCode', 'branchName', 'schemeStatus', 'pacsFpo', 'center', 'basicDocument', 'bankDocument', 'originalSchemeApplicationReceipt', 'modifiedSchemeApplicationReceipt', 'cropDetails'],
      defaultView: 'table',
      aiKeywords: ['scheme wise', 'farmer scheme', 'scheme participation'],
      priority: 4
    },
    {
      id: 'stateCommodityFarmer',
      name: 'State and Commodity Wise Farmer',
      category: 'farmer',
      icon: Globe,
      description: 'Farmer distribution by state and commodity',
      filters: ['state', 'commodity', 'yearSeason', 'scheme'],
      columns: ['state', 'commodity', 'totalFarmersRegistered', 'activeFarmers', 'totalLandAreaHectare', 'totalProcurementQuantityQtl', 'averageProcurementPerFarmerQtl'],
      defaultView: 'chart',
      aiKeywords: ['state commodity', 'farmer distribution', 'geographic farmer'],
      priority: 5
    },
    {
      id: 'farmerFruits',
      name: 'Farmer Fruits Details',
      category: 'farmer',
      icon: Package,
      description: 'Fruit production and procurement details',
      filters: ['state', 'district', 'commodity', 'farmerId', 'season'],
      columns: ['farmerId', 'farmerName', 'mobileNumber', 'state', 'district', 'taluka', 'village', 'commodity', 'fruitVariety', 'quantityQtlKg', 'qualityGrade', 'marketPrice', 'harvestDate', 'procurementDate'],
      defaultView: 'table',
      aiKeywords: ['fruits', 'fruit details', 'fruit production'],
      priority: 6
    },
    {
      id: 'farmerTracker',
      name: 'Farmer Tracker',
      category: 'farmer',
      icon: Activity,
      description: 'Real-time farmer activity tracking',
      filters: ['farmerId', 'mobileNumber', 'aadhaarNumber', 'state', 'district', 'fromDate', 'toDate'],
      columns: ['farmerId', 'farmerName', 'mobileNumber', 'aadhaarNumber', 'state', 'district', 'taluka', 'village', 'registrationDate', 'lastActivityDate', 'totalLotsCreated', 'totalQuantityProcuredQtl', 'totalPaymentReceivedRs', 'currentStatus', 'engagementScore', 'activityTimeline'],
      defaultView: 'table',
      aiKeywords: ['farmer tracker', 'farmer activity', 'track farmer'],
      priority: 7
    },
    {
      id: 'farmerNominee',
      name: 'Farmer Nominee Report',
      category: 'farmer',
      icon: Users,
      description: 'Farmer nominee information and compliance',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'stateAgency', 'district', 'fpoPacs', 'center', 'searchFarmerBy', 'searchValue'],
      columns: ['cna', 'commodity', 'stateAgency', 'center', 'state', 'district', 'taluka', 'village', 'farmerName', 'farmerId', 'farmerMobileNumber', 'applicationId', 'lotId', 'lotQuantity', 'totalBags', 'valueInRs', 'procuredFrom', 'nomineeName'],
      defaultView: 'table',
      aiKeywords: ['nominee', 'farmer nominee', 'nominee report'],
      priority: 8
    },
    // Procurement Reports
    {
      id: 'procurementStatus',
      name: 'Procurement Status',
      category: 'procurement',
      icon: ShoppingCart,
      description: 'Overall procurement status and progress',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'status', 'fromDate', 'toDate'],
      columns: ['state', 'district', 'center', 'commodity', 'scheme', 'totalLots', 'totalQuantityQtl', 'totalBags', 'totalValueRs', 'pendingQuantityQtl', 'completedQuantityQtl', 'completionPercentage', 'averageLotSizeQtl', 'status'],
      defaultView: 'chart',
      aiKeywords: ['procurement status', 'procurement progress', 'procurement summary'],
      priority: 1
    },
    {
      id: 'lotReplacement',
      name: 'Lot Replacement Acknowledge',
      category: 'procurement',
      icon: RefreshCw,
      description: 'Track lot replacements and acknowledgments',
      filters: ['yearSeason', 'scheme', 'state', 'district', 'center', 'originalLotId', 'replacementLotId', 'status', 'fromDate', 'toDate'],
      columns: ['originalLotId', 'replacementLotId', 'farmerId', 'farmerName', 'originalQuantityQtl', 'replacementQuantityQtl', 'originalBags', 'replacementBags', 'replacementReason', 'acknowledgmentStatus', 'replacementDate', 'acknowledgmentDate', 'center', 'warehouse'],
      defaultView: 'table',
      aiKeywords: ['lot replacement', 'replacement', 'lot acknowledge'],
      priority: 2
    },
    {
      id: 'slaProcurement',
      name: 'SLA Procurement Summary',
      category: 'procurement',
      icon: Target,
      description: 'SLA compliance and performance tracking',
      filters: ['yearSeason', 'scheme', 'slaName', 'state', 'district', 'center', 'fromDate', 'toDate'],
      columns: ['slaName', 'state', 'district', 'center', 'totalLots', 'totalQuantityQtl', 'slaTargetQuantityQtl', 'achievementPercentage', 'onTimeCompletionRate', 'averageProcessingTimeDays', 'slaComplianceStatus'],
      defaultView: 'chart',
      aiKeywords: ['sla procurement', 'sla summary', 'sla compliance'],
      priority: 3
    },
    {
      id: 'slaWhrPayment',
      name: 'SLA Wise WHR and Payment Summary',
      category: 'procurement',
      icon: Gauge,
      description: 'Combined WHR and Payment SLA tracking',
      filters: ['yearSeason', 'scheme', 'slaName', 'state', 'district', 'center', 'fromDate', 'toDate'],
      columns: ['slaName', 'state', 'district', 'center', 'whrSlaTarget', 'whrAchievement', 'whrCompliancePercent', 'paymentSlaTarget', 'paymentAchievement', 'paymentCompliancePercent', 'combinedSlaScore', 'averageWhrProcessingTime', 'averagePaymentProcessingTime', 'slaViolationsCount'],
      defaultView: 'chart',
      aiKeywords: ['sla whr payment', 'sla summary', 'whr payment sla'],
      priority: 4
    },
    {
      id: 'whrTracker',
      name: 'WHR Tracker',
      category: 'procurement',
      icon: Receipt,
      description: 'Real-time WHR processing tracker',
      filters: ['yearSeason', 'scheme', 'state', 'district', 'center', 'warehouse', 'whrNumber', 'status', 'fromDate', 'toDate'],
      columns: ['whrNumber', 'whrDate', 'status', 'state', 'district', 'center', 'warehouse', 'dispatchQuantityQtl', 'acceptedQuantityQtl', 'quantityLossQtl', 'quantityGainQtl', 'processingStage', 'currentStageDuration', 'estimatedCompletionDate', 'creator', 'checker', 'approver'],
      defaultView: 'table',
      aiKeywords: ['whr tracker', 'track whr', 'whr status'],
      priority: 5
    },
    {
      id: 'stateEstimatedProcurement',
      name: 'State Wise Estimated Procurement',
      category: 'procurement',
      icon: TrendingUp,
      description: 'Procurement estimation accuracy by state',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district'],
      columns: ['state', 'district', 'commodity', 'scheme', 'estimatedQuantityMt', 'actualQuantityMt', 'varianceMt', 'variancePercentage', 'estimationAccuracy', 'historicalAverageMt'],
      defaultView: 'chart',
      aiKeywords: ['estimated procurement', 'procurement estimation', 'estimation accuracy'],
      priority: 6
    },
    {
      id: 'dataUpload',
      name: 'Data Upload Report',
      category: 'procurement',
      icon: Upload,
      description: 'Track data uploads and processing',
      filters: ['uploadType', 'state', 'district', 'center', 'uploadDate', 'status', 'fromDate', 'toDate'],
      columns: ['uploadId', 'uploadDate', 'uploadType', 'state', 'district', 'center', 'totalRecords', 'successfulRecords', 'failedRecords', 'errorCount', 'errorDetails', 'uploadStatus', 'processingTime', 'uploadedBy', 'verifiedBy'],
      defaultView: 'table',
      aiKeywords: ['data upload', 'upload report', 'data processing'],
      priority: 7
    },
    {
      id: 'warehouseAssaying',
      name: 'Warehouse Wise Avg Assaying',
      category: 'procurement',
      icon: Award,
      description: 'Quality assaying metrics by warehouse',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'warehouse', 'fromDate', 'toDate'],
      columns: ['warehouse', 'state', 'district', 'commodity', 'totalSamplesTested', 'averageMoistureContentPercent', 'averageForeignMatterPercent', 'averageDamagedGrainsPercent', 'averageQualityGrade', 'passRatePercent', 'rejectionRatePercent', 'averageAssayingTimeHours'],
      defaultView: 'chart',
      aiKeywords: ['assaying', 'warehouse assaying', 'quality assaying'],
      priority: 8
    },
    {
      id: 'vehicleDetail',
      name: 'Vehicle Wise Detail Report',
      category: 'procurement',
      icon: Truck,
      description: 'Vehicle performance and utilization',
      filters: ['vehicleNumber', 'state', 'district', 'center', 'warehouse', 'fromDate', 'toDate', 'status'],
      columns: ['vehicleNumber', 'vehicleType', 'driverName', 'driverMobile', 'state', 'district', 'center', 'warehouse', 'totalTrips', 'totalDistanceKm', 'totalQuantityTransportedQtl', 'averageTripTimeHours', 'fuelConsumption', 'maintenanceStatus', 'onTimeDeliveryRatePercent', 'status'],
      defaultView: 'table',
      aiKeywords: ['vehicle', 'vehicle report', 'transport', 'delivery vehicle'],
      priority: 9
    },
    // Payment Reports
    {
      id: 'responsePendingPayment',
      name: 'Response Pending Payment View',
      category: 'payment',
      icon: Clock,
      description: 'Payments awaiting response',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'farmerId', 'lotId', 'paymentStatus', 'fromDate', 'toDate'],
      columns: ['farmerId', 'farmerName', 'mobileNumber', 'lotId', 'commodity', 'quantityQtl', 'valueRs', 'paymentAmountRs', 'pendingAmountRs', 'paymentStatus', 'responseStatus', 'paymentRequestDate', 'lastResponseDate', 'ageInDays', 'utrNumber', 'bankAccount', 'ifscCode'],
      defaultView: 'table',
      aiKeywords: ['response pending', 'pending payment', 'awaiting response'],
      priority: 1
    },
    {
      id: 'successfulPayment',
      name: 'Successful Payment View',
      category: 'payment',
      icon: CheckCircle2,
      description: 'All successful payment transactions',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'paymentDate', 'utrNumber', 'fromDate', 'toDate'],
      columns: ['paymentId', 'paymentDate', 'utrNumber', 'farmerId', 'farmerName', 'mobileNumber', 'lotId', 'commodity', 'quantityQtl', 'paymentAmountRs', 'bankAccount', 'paymentMethod', 'paymentStatus', 'transactionTime', 'confirmationTime', 'bankResponseCode', 'bankResponseMessage'],
      defaultView: 'table',
      aiKeywords: ['successful payment', 'completed payment', 'payment success'],
      priority: 2
    },
    {
      id: 'failedPayment',
      name: 'Failed Payment View',
      category: 'payment',
      icon: XCircle,
      description: 'Failed payment analysis and retry tracking',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'failureReason', 'fromDate', 'toDate'],
      columns: ['paymentId', 'paymentDate', 'utrNumber', 'farmerId', 'farmerName', 'mobileNumber', 'lotId', 'commodity', 'paymentAmountRs', 'failureReason', 'errorCode', 'errorMessage', 'bankAccount', 'ifscCode', 'retryCount', 'lastRetryDate', 'resolutionStatus'],
      defaultView: 'table',
      aiKeywords: ['failed payment', 'payment failure', 'payment error'],
      priority: 3
    },
    {
      id: 'pendingPayment',
      name: 'Pending Payment',
      category: 'payment',
      icon: AlertCircle,
      description: 'Comprehensive pending payment tracking',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'paymentStage', 'ageRange', 'fromDate', 'toDate'],
      columns: ['paymentId', 'paymentRequestDate', 'farmerId', 'farmerName', 'mobileNumber', 'lotId', 'commodity', 'quantityQtl', 'paymentAmountRs', 'pendingAmountRs', 'paymentStage', 'currentStatus', 'ageInDays', 'priorityLevel', 'bankAccount', 'ifscCode', 'expectedCompletionDate'],
      defaultView: 'table',
      aiKeywords: ['pending payment', 'unpaid', 'payment pending'],
      priority: 4
    },
    {
      id: 'dbtPayment',
      name: 'DBT Payment View',
      category: 'payment',
      icon: CreditCard,
      description: 'Direct Benefit Transfer payment tracking',
      filters: ['yearSeason', 'scheme', 'commodity', 'state', 'district', 'center', 'dbtStatus', 'fromDate', 'toDate'],
      columns: ['dbtPaymentId', 'paymentDate', 'utrNumber', 'farmerId', 'farmerName', 'aadhaarNumber', 'lotId', 'commodity', 'quantityQtl', 'dbtAmountRs', 'bankAccount', 'dbtStatus', 'npciResponse', 'transactionReference', 'beneficiaryId', 'paymentConfirmationDate', 'bankResponseCode', 'bankResponseMessage'],
      defaultView: 'table',
      aiKeywords: ['dbt payment', 'direct benefit transfer', 'dbt'],
      priority: 5
    },
    {
      id: 'fundDetails',
      name: 'Fund Details',
      category: 'payment',
      icon: DollarSign,
      description: 'Fund allocation and utilization tracking',
      filters: ['fundType', 'state', 'district', 'scheme', 'fromDate', 'toDate'],
      columns: ['fundId', 'fundType', 'fundName', 'state', 'district', 'scheme', 'allocatedAmountRs', 'utilizedAmountRs', 'availableBalanceRs', 'utilizationPercentage', 'fundStatus', 'lastTransactionDate', 'transactionCount', 'averageTransactionAmount', 'fundSource', 'fundPurpose'],
      defaultView: 'chart',
      aiKeywords: ['fund details', 'fund management', 'fund allocation'],
      priority: 6
    }
  ];

  // Get reports by category
  const getReportsByCategory = (category: string) => {
    if (category === 'all') return reportConfigs;
    return reportConfigs.filter(r => r.category === category);
  };

  // Get current report config
  const currentReportConfig = selectedReport
    ? reportConfigs.find(r => r.id === selectedReport)
    : null;

  // Mock AI Insights
  const generateAIInsights = (reportType: string): AIInsight[] => {
    const insights: AIInsight[] = [];

    if (reportType.includes('payment')) {
      insights.push({
        id: '2',
        type: 'anomaly',
        title: 'Payment Processing Delay Detected',
        description: '3 payments have been pending for more than 48 hours, exceeding normal processing time',
        impact: 'high',
        confidence: 95,
        actionable: true,
        action: 'Review pending payments immediately',
        data: { pendingCount: 3, avgDelay: 52 }
      });
    }

    if (reportType.includes('farmer')) {
      insights.push({
        id: '3',
        type: 'trend',
        title: 'Farmer Registration Growth',
        description: 'Farmer registrations have increased by 12% compared to last month',
        impact: 'medium',
        confidence: 88,
        actionable: false,
        data: { growth: 12, current: 1250, previous: 1116 }
      });
    }

    if (reportType.includes('procurement')) {
      insights.push({
        id: '4',
        type: 'alert',
        title: 'Procurement Status Alert',
        description: 'Procurement volume is currently at 85% of target. Monitor closely to ensure target achievement.',
        impact: 'medium',
        confidence: 90,
        actionable: true,
        action: 'Review procurement progress',
        data: { current: 850, target: 1000, percentage: 85 }
      });
    }

    return insights;
  };

  // Process AI Query
  const handleAIQuery = async (query?: string) => {
    const queryText = query || aiQuery;
    if (!queryText.trim()) return;

    setIsProcessingQuery(true);
    setNlpSuggestion('Processing your query with AI...');

    // Simulate AI processing
    setTimeout(() => {
      // Find matching report
      const lowerQuery = queryText.toLowerCase();
      let matchedReport: ReportConfig | null = null;

      for (const report of reportConfigs) {
        if (report.aiKeywords.some(keyword => lowerQuery.includes(keyword))) {
          matchedReport = report;
          break;
        }
      }

      // Extract filters from query
      const extractedFilters: Record<string, any> = {};
      if (lowerQuery.includes('last week') || lowerQuery.includes('past week')) {
        extractedFilters.dateRange = 'lastWeek';
      }
      if (lowerQuery.includes('last month')) {
        extractedFilters.dateRange = 'lastMonth';
      }
      if (lowerQuery.includes('wheat')) {
        extractedFilters.commodity = 'wheat';
      }
      if (lowerQuery.includes('maharashtra')) {
        extractedFilters.state = 'maharashtra';
      }

      if (matchedReport) {
        setSelectedReport(matchedReport.id);
        setActiveCategory(matchedReport.category);
        setFilters(extractedFilters);

        const mockData = generateMockReportData(matchedReport.id);
        const insights = generateAIInsights(matchedReport.id);

        setQueryResponse({
          reportType: matchedReport.id,
          filters: extractedFilters,
          columns: matchedReport.columns,
          data: mockData,
          insights: insights,
          generatedAt: new Date().toISOString()
        });

        // Add to history
        setQueryHistory([queryText, ...queryHistory.slice(0, 9)]);
        setRecentReports([matchedReport.id, ...recentReports.filter(r => r !== matchedReport.id).slice(0, 4)]);
      }

      setAiQuery('');
      setIsProcessingQuery(false);
      setNlpSuggestion('');
    }, 1500);
  };

  // Generate mock report data
  const generateMockReportData = (reportId: string): any[] => {
    const data: any[] = [];
    const states = ['Maharashtra', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'];
    const districts = ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Bangalore', 'Ahmedabad', 'Jaipur', 'Ludhiana'];
    const commodities = ['Wheat', 'Rice', 'Paddy', 'Cotton', 'Sugarcane'];

    for (let i = 1; i <= 20; i++) {
      data.push({
        id: i,
        state: states[i % states.length],
        district: districts[i % districts.length],
        center: `Center ${i}`,
        commodity: commodities[i % commodities.length],
        quantity: Math.floor(Math.random() * 1000) + 100,
        quantityQtl: Math.floor(Math.random() * 1000) + 100,
        value: Math.floor(Math.random() * 100000) + 10000,
        valueRs: Math.floor(Math.random() * 100000) + 10000,
        status: ['Active', 'Pending', 'Completed'][i % 3],
        paymentStatus: ['Success', 'Failed', 'Pending'][i % 3],
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        lotCreatedDate: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        totalQuantityQtl: Math.floor(Math.random() * 5000) + 500,
        totalBags: Math.floor(Math.random() * 1000) + 100,
        totalValueRs: Math.floor(Math.random() * 500000) + 50000,
        farmers: Math.floor(Math.random() * 500) + 50,
        totalFarmersRegistered: Math.floor(Math.random() * 500) + 50,
        appliedRegistrations: Math.floor(Math.random() * 300) + 30,
        totalLots: Math.floor(Math.random() * 100) + 10,
        pendingAmount: Math.floor(Math.random() * 50000) + 5000,
        completionPercentage: Math.floor(Math.random() * 100),
        totalLandAreaHectare: Math.floor(Math.random() * 1000) + 100,
        totalProcurementQuantityQtl: Math.floor(Math.random() * 2000) + 200
      });
    }
    return data;
  };

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

  // NLP Suggestion Logic
  useEffect(() => {
    if (aiQuery.trim()) {
      const query = aiQuery.toLowerCase();

      if (query.includes('procurement') || query.includes('procure')) {
        setNlpSuggestion('💡 Try: "Show procurement status", "Compare procurement by district"');
      } else if (query.includes('payment') || query.includes('pay')) {
        setNlpSuggestion('💡 Try: "Show pending payments", "Analyze payment failures"');
      } else if (query.includes('farmer') || query.includes('registration')) {
        setNlpSuggestion('💡 Try: "Show farmer summary", "Track farmer activity"');
      } else if (query.includes('dispatch') || query.includes('delivery')) {
        setNlpSuggestion('💡 Try: "Show dispatch report", "Track deliveries"');
      } else if (query.includes('whr') || query.includes('warehouse')) {
        setNlpSuggestion('💡 Try: "Show WHR status", "Track warehouse receipts"');
      } else if (query.includes('predict') || query.includes('forecast')) {
        setNlpSuggestion('💡 Forecasting features are not available. Try: "Show current status", "Analyze trends"');
      } else {
        setNlpSuggestion('💡 Ask about procurement, payments, farmers, dispatch, or WHR');
      }
    } else {
      setNlpSuggestion('');
    }
  }, [aiQuery]);

  // Toggle favorite
  const toggleFavorite = (reportId: string) => {
    setFavorites(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const categoryIcons = {
    daily: Package,
    farmer: Users,
    procurement: ShoppingCart,
    payment: DollarSign,
    all: Layers
  };

  const categoryColors = {
    daily: { bg: '#E6F7F7', text: '#027F83', border: '#027F83' },
    farmer: { bg: '#F0FDF4', text: '#00A040', border: '#00A040' },
    procurement: { bg: '#FFFBF0', text: '#FFA200', border: '#FFA200' },
    payment: { bg: '#FFF5F5', text: '#E94545', border: '#E94545' },
    all: { bg: '#F7F9FA', text: '#666', border: '#CCD8DF' }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return AlertTriangle;
      case 'trend': return TrendingUp;
      case 'recommendation': return Lightbulb;
      case 'alert': return AlertCircle;
      default: return Zap;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'anomaly': return { bg: '#FFF5F5', text: '#E94545', border: '#E94545' };
      case 'trend': return { bg: '#F0FDF4', text: '#00A040', border: '#00A040' };
      case 'recommendation': return { bg: '#FFFBF0', text: '#FFA200', border: '#FFA200' };
      case 'alert': return { bg: '#FFF5F5', text: '#E94545', border: '#E94545' };
      default: return { bg: '#F7F9FA', text: '#666', border: '#CCD8DF' };
    }
  };

  return (
    <div className={`p-8 overflow-y-auto pb-20 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', height: isFullscreen ? '100vh' : 'auto', maxHeight: isFullscreen ? '100vh' : 'none' }}>
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
        <span style={{ fontWeight: '600', color: '#222' }}>AI-Powered Reporting</span>
      </div>

      {/* Header */}
      {/* <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ 
            background: 'linear-gradient(135deg, #027F83 0%, #00A040 100%)',
            boxShadow: '0 8px 24px rgba(2, 127, 131, 0.3)'
          }}>
            <Brain className="w-7 h-7" style={{ color: '#FFFFFF' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
              AI-Powered Reporting Dashboard
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Intelligent Insights • Trend Analysis • Natural Language Queries
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-12 px-4 rounded-xl border transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            style={{
              borderColor: '#CCD8DF',
              backgroundColor: '#FFFFFF',
              color: '#027F83'
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="h-12 px-4 rounded-xl border transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            style={{
              borderColor: '#CCD8DF',
              backgroundColor: '#FFFFFF',
              color: '#027F83'
            }}
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div> */}

      {/* AI Query Interface - Premium Design */}
      <div className="mb-6 rounded-2xl border-2 overflow-visible shadow-xl" style={{
        borderColor: '#027F83',
        backgroundColor: '#FFFFFF',
        background: 'linear-gradient(to bottom, #F0FDF4 0%, #FFFFFF 100%)'
      }}>
        <div className="px-6 py-5 border-b flex items-center gap-3" style={{
          borderColor: '#E5EBEF',
          background: 'linear-gradient(135deg, #E6F7F7 0%, #F0FDF4 100%)'
        }}>
          <div className="p-3 rounded-xl shadow-md" style={{
            background: 'linear-gradient(135deg, #027F83 0%, #00A040 100%)',
            boxShadow: '0 4px 12px rgba(2, 127, 131, 0.3)'
          }}>
            <Zap className="w-6 h-6" style={{ color: '#FFFFFF' }} />
          </div>
          <div className="flex-1">
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
              Ask AI Anything
            </h2>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Get instant reports using natural language. Try: "Show procurement status", "Compare payment success rates", "Analyze farmer registrations"
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQueryHistory(!showQueryHistory)}
              className="p-2 rounded-lg transition-all hover:bg-white/50"
              title="Query History"
            >
              <History className="w-5 h-5" style={{ color: '#027F83' }} />
            </button>
          </div>
        </div>

        <div className="p-6 relative" style={{ zIndex: 10 }}>
          <div className="relative">
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl shadow-md"
              style={{
                background: 'linear-gradient(135deg, #E6F7F7 0%, #F0FDF4 100%)',
                boxShadow: '0 2px 8px rgba(2, 127, 131, 0.2)'
              }}
            >
              <Search className="w-5 h-5" style={{ color: '#027F83' }} />
            </div>
            <input
              type="text"
              placeholder="Ask me anything... e.g., 'Show procurement status for last week', 'Compare payment success rates', 'Analyze farmer registration trends'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isProcessingQuery && handleAIQuery()}
              disabled={isProcessingQuery}
              className="h-16 pl-16 pr-28 rounded-2xl border-2 transition-all outline-none shadow-lg"
              style={{
                borderColor: aiQuery ? '#027F83' : '#CCD8DF',
                color: '#222222',
                fontSize: '15px',
                backgroundColor: '#FFFFFF',
                width: '100%',
                boxShadow: aiQuery ? '0 0 0 4px rgba(2, 127, 131, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#027F83';
                e.target.style.boxShadow = '0 0 0 4px rgba(2, 127, 131, 0.15)';
              }}
              onBlur={(e) => {
                if (!aiQuery) {
                  e.target.style.borderColor = '#CCD8DF';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={handleVoiceSearch}
                disabled={isListening || isProcessingVoice || isProcessingQuery}
                className="flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-50 shadow-md"
                style={{
                  backgroundColor: isListening ? '#FF6B6B' : isProcessingVoice ? '#FFA500' : '#F7F9FA',
                  border: isListening || isProcessingVoice ? 'none' : '1px solid #E5EBEF'
                }}
                title={isListening ? 'Listening...' : isProcessingVoice ? 'Processing...' : 'Voice input'}
              >
                <Mic
                  className={`w-5 h-5 transition-colors ${isListening ? 'text-white' : isProcessingVoice ? 'text-white' : ''
                    }`}
                  style={{
                    color: isListening ? '#FFFFFF' : isProcessingVoice ? '#FFFFFF' : '#666666'
                  }}
                />
              </button>
              <button
                onClick={() => handleAIQuery()}
                disabled={!aiQuery.trim() || isProcessingQuery}
                className="h-10 px-6 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg font-semibold"
                style={{
                  background: isProcessingQuery
                    ? 'linear-gradient(135deg, #CCD8DF 0%, #E5EBEF 100%)'
                    : 'linear-gradient(135deg, #027F83 0%, #00A040 100%)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxShadow: isProcessingQuery ? 'none' : '0 4px 12px rgba(2, 127, 131, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isProcessingQuery) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(2, 127, 131, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
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
              <div className="absolute top-full left-0 mt-3 px-4 py-2.5 rounded-xl z-50 shadow-xl border-2 animate-in slide-in-from-top-2" style={{
                backgroundColor: '#E6F7F7',
                fontSize: '13px',
                fontWeight: '600',
                color: '#027F83',
                borderColor: '#027F83',
                maxWidth: '600px'
              }}>
                <Sparkles className="w-4 h-4 inline mr-2" />
                {nlpSuggestion}
              </div>
            )}
          </div>

          {/* Query History Dropdown */}
          {showQueryHistory && queryHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border-2 shadow-2xl z-50 overflow-hidden" style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E5EBEF',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>Recent Queries</span>
                <button onClick={() => setShowQueryHistory(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-4 h-4" style={{ color: '#666' }} />
                </button>
              </div>
              <div className="py-2">
                {queryHistory.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiQuery(query);
                      setShowQueryHistory(false);
                      handleAIQuery(query);
                    }}
                    className="w-full text-left px-4 py-3 transition-all hover:bg-gray-50 border-b last:border-b-0"
                    style={{ borderColor: '#E5EBEF' }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#003A5D', marginBottom: '2px' }}>
                      {query}
                    </p>
                    <p style={{ fontSize: '11px', color: '#666' }}>
                      Click to run again
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs - Beautiful Design */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Reports', icon: Layers },
          { id: 'daily', label: 'Daily Reports', icon: Package },
          { id: 'farmer', label: 'Farmer Reports', icon: Users },
          { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
          { id: 'payment', label: 'Payment', icon: DollarSign }
        ].map((category) => {
          const Icon = category.icon;
          const colors = categoryColors[category.id as keyof typeof categoryColors];
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id as any);
                setSelectedReport(null);
                setQueryResponse(null);
              }}
              className="px-6 py-3 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bg} 100%)`
                  : '#FFFFFF',
                border: `2px solid ${isActive ? colors.border : '#E5EBEF'}`,
                color: isActive ? colors.text : '#666',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isActive ? `0 4px 12px ${colors.border}40` : '0 2px 4px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = colors.bg;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#E5EBEF';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              <Icon className="w-5 h-5" />
              {category.label}
              {category.id !== 'all' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{
                  backgroundColor: isActive ? colors.text : '#CCD8DF',
                  color: isActive ? '#FFFFFF' : '#666'
                }}>
                  {getReportsByCategory(category.id).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border-2 shadow-lg overflow-hidden sticky top-4" style={{
            borderColor: '#E5EBEF',
            backgroundColor: '#FFFFFF'
          }}>
            <div className="px-4 py-4 border-b flex items-center justify-between" style={{
              borderColor: '#E5EBEF',
              backgroundColor: '#F7F9FA'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D' }}>
                Available Reports
              </h3>
              <span className="px-2 py-1 rounded-full text-xs font-bold" style={{
                backgroundColor: '#027F83',
                color: '#FFFFFF'
              }}>
                {getReportsByCategory(activeCategory).length}
              </span>
            </div>

            {/* Favorites Section */}
            {favorites.length > 0 && (
              <div className="px-4 py-3 border-b" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFBF0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4" style={{ color: '#FFA200' }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>
                    Favorites
                  </span>
                </div>
                <div className="space-y-1">
                  {favorites.map(favId => {
                    const report = reportConfigs.find(r => r.id === favId);
                    if (!report) return null;
                    const Icon = report.icon;
                    return (
                      <button
                        key={favId}
                        onClick={() => {
                          setSelectedReport(favId);
                          setActiveCategory(report.category);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 hover:bg-white"
                        style={{
                          backgroundColor: selectedReport === favId ? '#E6F7F7' : 'transparent'
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: '#027F83' }} />
                        <span style={{ fontSize: '13px', fontWeight: selectedReport === favId ? '600' : '500', color: selectedReport === favId ? '#027F83' : '#666' }}>
                          {report.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            {recentReports.length > 0 && (
              <div className="px-4 py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-4 h-4" style={{ color: '#666' }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#777', textTransform: 'uppercase' }}>
                    Recent
                  </span>
                </div>
                <div className="space-y-1">
                  {recentReports.slice(0, 3).map(reportId => {
                    const report = reportConfigs.find(r => r.id === reportId);
                    if (!report) return null;
                    const Icon = report.icon;
                    return (
                      <button
                        key={reportId}
                        onClick={() => {
                          setSelectedReport(reportId);
                          setActiveCategory(report.category);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-2 hover:bg-gray-50"
                        style={{
                          backgroundColor: selectedReport === reportId ? '#E6F7F7' : 'transparent'
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: '#027F83' }} />
                        <span style={{ fontSize: '13px', fontWeight: selectedReport === reportId ? '600' : '500', color: selectedReport === reportId ? '#027F83' : '#666' }}>
                          {report.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Reports List */}
            <div className="p-2 max-h-[600px] overflow-y-auto">
              <div className="space-y-1">
                {getReportsByCategory(activeCategory).map((report) => {
                  const Icon = report.icon;
                  const colors = categoryColors[report.category];
                  const isSelected = selectedReport === report.id;

                  return (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report.id)}
                      className="w-full text-left px-3 py-3 rounded-xl transition-all flex items-start gap-3 group relative"
                      style={{
                        backgroundColor: isSelected ? colors.bg : 'transparent',
                        border: `2px solid ${isSelected ? colors.border : 'transparent'}`,
                        boxShadow: isSelected ? `0 2px 8px ${colors.border}30` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = '#F7F9FA';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: isSelected ? colors.text : '#F7F9FA' }}>
                        <Icon className="w-4 h-4" style={{ color: isSelected ? '#FFFFFF' : '#666' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p style={{
                            fontSize: '13px',
                            fontWeight: isSelected ? '700' : '600',
                            color: isSelected ? colors.text : '#003A5D',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                          }}>
                            {report.name}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(report.id);
                            }}
                            className="p-1 rounded-lg hover:bg-white/50 flex-shrink-0"
                          >
                            {favorites.includes(report.id) ? (
                              <BookmarkCheck className="w-4 h-4" style={{ color: '#FFA200' }} />
                            ) : (
                              <Bookmark className="w-4 h-4" style={{ color: '#CCD8DF' }} />
                            )}
                          </button>
                        </div>
                        <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.3' }}>
                          {report.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Report Content Area */}
        <div className="lg:col-span-3">
          {selectedReport && currentReportConfig ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="rounded-2xl border-2 shadow-lg overflow-hidden" style={{
                borderColor: '#E5EBEF',
                backgroundColor: '#FFFFFF'
              }}>
                <div className="px-6 py-5 border-b flex items-center justify-between" style={{
                  borderColor: '#E5EBEF',
                  background: `linear-gradient(135deg, ${categoryColors[currentReportConfig.category].bg} 0%, #FFFFFF 100%)`
                }}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl shadow-md" style={{
                      backgroundColor: categoryColors[currentReportConfig.category].text
                    }}>
                      <currentReportConfig.icon className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                        {currentReportConfig.name}
                      </h2>
                      <p style={{ fontSize: '13px', color: '#666' }}>
                        {currentReportConfig.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterDrawerOpen(true)}
                      className="h-10 px-4 rounded-lg border transition-all flex items-center gap-2"
                      style={{
                        borderColor: '#CCD8DF',
                        backgroundColor: '#FFFFFF',
                        color: '#027F83'
                      }}
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <button
                      onClick={() => {
                        // Export functionality
                        const csv = [
                          currentReportConfig.columns.join(','),
                          ...(queryResponse?.data || []).map((row: any) =>
                            currentReportConfig.columns.map(col => row[col] || '').join(',')
                          )
                        ].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${currentReportConfig.name.replace(/\s+/g, '-')}.csv`;
                        a.click();
                      }}
                      className="h-10 px-4 rounded-lg border transition-all flex items-center gap-2"
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

                {/* View Toggle */}
                <div className="px-6 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'table', label: 'Table', icon: Table2 },
                      { id: 'chart', label: 'Chart', icon: BarChart3 },
                      { id: 'graph', label: 'Graph', icon: LineChart },
                      { id: 'map', label: 'Map', icon: MapPin }
                    ].map((view) => {
                      const ViewIcon = view.icon;
                      return (
                        <button
                          key={view.id}
                          onClick={() => setCurrentView(view.id as any)}
                          className="px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                          style={{
                            backgroundColor: currentView === view.id ? '#027F83' : 'transparent',
                            color: currentView === view.id ? '#FFFFFF' : '#666',
                            fontWeight: currentView === view.id ? '600' : '500',
                            fontSize: '13px'
                          }}
                        >
                          <ViewIcon className="w-4 h-4" />
                          {view.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {queryResponse?.data?.length || 0} records
                    </span>
                  </div>
                </div>

                {/* Report Content */}
                <div className="p-6">
                  {queryResponse ? (
                    <BaseReportViewer
                      reportId={currentReportConfig.id}
                      reportName={currentReportConfig.name}
                      category={currentReportConfig.category}
                      data={queryResponse.data}
                      columns={currentReportConfig.columns}
                      currentView={currentView}
                    />
                  ) : (
                    <div className="p-12 text-center rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
                      <currentReportConfig.icon className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCD8DF' }} />
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                        No Data Generated Yet
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                        Use the AI query interface above to generate this report, or click "Generate Report" below
                      </p>
                      <button
                        onClick={() => handleAIQuery(`Show ${currentReportConfig.name.toLowerCase()}`)}
                        className="px-6 py-3 rounded-xl transition-all flex items-center gap-2 mx-auto"
                        style={{
                          background: 'linear-gradient(135deg, #027F83 0%, #00A040 100%)',
                          color: '#FFFFFF',
                          fontSize: '14px',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(2, 127, 131, 0.3)'
                        }}
                      >
                        <Play className="w-4 h-4" />
                        Generate Report
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Insights Panel */}
              {showInsights && queryResponse?.insights && queryResponse.insights.length > 0 && (
                <div className="rounded-2xl border-2 shadow-lg overflow-hidden" style={{
                  borderColor: '#027F83',
                  backgroundColor: '#FFFFFF'
                }}>
                  <div className="px-6 py-4 border-b flex items-center justify-between" style={{
                    borderColor: '#E5EBEF',
                    background: 'linear-gradient(135deg, #E6F7F7 0%, #F0FDF4 100%)'
                  }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#027F83' }}>
                        <Brain className="w-5 h-5" style={{ color: '#FFFFFF' }} />
                      </div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>
                        AI-Powered Insights
                      </h3>
                      <span className="px-2 py-1 rounded-full text-xs font-bold" style={{
                        backgroundColor: '#027F83',
                        color: '#FFFFFF'
                      }}>
                        {queryResponse.insights.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowInsights(false)}
                      className="p-2 rounded-lg hover:bg-white/50"
                    >
                      <ChevronUp className="w-4 h-4" style={{ color: '#666' }} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {queryResponse.insights.map((insight) => {
                        const Icon = getInsightIcon(insight.type);
                        const colors = getInsightColor(insight.type);
                        return (
                          <div
                            key={insight.id}
                            className="p-5 rounded-xl border-2 transition-all hover:shadow-lg"
                            style={{
                              borderColor: colors.border,
                              backgroundColor: colors.bg
                            }}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                                <Icon className="w-5 h-5" style={{ color: colors.text }} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className="px-2 py-1 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: colors.text, color: '#FFFFFF' }}
                                  >
                                    {insight.type.toUpperCase()}
                                  </span>
                                  <span
                                    className="px-2 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                      backgroundColor: insight.impact === 'high' ? '#E94545' :
                                        insight.impact === 'medium' ? '#FFA200' : '#00A040',
                                      color: '#FFFFFF'
                                    }}
                                  >
                                    {insight.impact.toUpperCase()} IMPACT
                                  </span>
                                </div>
                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                                  {insight.title}
                                </h4>
                                <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '12px' }}>
                                  {insight.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span style={{ fontSize: '11px', color: '#666' }}>Confidence</span>
                                    <p style={{ fontSize: '18px', fontWeight: '700', color: colors.text }}>
                                      {insight.confidence}%
                                    </p>
                                  </div>
                                  {insight.actionable && insight.action && (
                                    <button
                                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                      style={{
                                        backgroundColor: colors.text,
                                        color: '#FFFFFF'
                                      }}
                                    >
                                      {insight.action}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border-2 shadow-lg p-12 text-center" style={{
              borderColor: '#E5EBEF',
              backgroundColor: '#FFFFFF'
            }}>
              <Layers className="w-20 h-20 mx-auto mb-6" style={{ color: '#CCD8DF' }} />
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#003A5D', marginBottom: '12px' }}>
                Welcome to AI-Powered Reporting
              </h3>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
                Select a report from the sidebar or use the AI query interface above to generate any report instantly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { icon: Brain, label: 'AI-Powered', desc: 'Natural language queries' },
                  { icon: Zap, label: 'Instant Reports', desc: 'Generate in seconds' },
                  { icon: TrendingUp, label: 'Trend Analysis', desc: 'ML-based insights' },
                  { icon: Shield, label: 'Smart Alerts', desc: 'Anomaly detection' }
                ].map((feature, idx) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-xl border-2 transition-all hover:shadow-lg"
                      style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="p-3 rounded-lg mx-auto mb-3 w-fit" style={{ backgroundColor: '#E6F7F7' }}>
                        <FeatureIcon className="w-6 h-6" style={{ color: '#027F83' }} />
                      </div>
                      <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                        {feature.label}
                      </h4>
                      <p style={{ fontSize: '13px', color: '#666' }}>
                        {feature.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      {filterDrawerOpen && currentReportConfig && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
            onClick={() => setFilterDrawerOpen(false)}
          />

          <div
            className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto"
            style={{
              animation: 'slideInRight 0.3s ease-out',
              borderLeft: '1px solid #E5EBEF'
            }}
          >
            <div className="sticky top-0 z-10 px-6 py-5 border-b flex items-center justify-between" style={{
              backgroundColor: '#FFFFFF',
              borderColor: '#E5EBEF'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  Apply Filters
                </h2>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  {currentReportConfig.name}
                </p>
              </div>
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
              >
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="space-y-4">
                {currentReportConfig.filters.map((filter) => (
                  <div key={filter}>
                    <label style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#777777',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                      marginBottom: '8px',
                      display: 'block'
                    }}>
                      {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                    <input
                      type="text"
                      value={filters[filter] || ''}
                      onChange={(e) => setFilters({ ...filters, [filter]: e.target.value })}
                      placeholder={`Enter ${filter}`}
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
                ))}
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t sticky bottom-0 bg-white pb-6" style={{ borderColor: '#E5EBEF' }}>
                <button
                  onClick={() => {
                    setFilterDrawerOpen(false);
                    if (selectedReport) {
                      handleAIQuery(`Show ${currentReportConfig.name.toLowerCase()}`);
                    }
                  }}
                  className="flex-1 h-12 rounded-xl transition-all font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #027F83 0%, #00A040 100%)',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(2, 127, 131, 0.3)'
                  }}
                >
                  Apply Filters
                </button>

                <button
                  onClick={() => {
                    setFilters({});
                    setFilterDrawerOpen(false);
                  }}
                  className="px-6 h-12 rounded-xl transition-all font-semibold"
                  style={{
                    backgroundColor: '#F7F9FA',
                    border: '1px solid #CCD8DF',
                    color: '#666',
                    fontSize: '14px'
                  }}
                >
                  Clear
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
        @keyframes animate-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: animate-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
