import { useState, useRef, useEffect } from 'react';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import {
  Home, ChevronRight, Plus, X, Search, Filter, Download, Upload, Eye,
  ChevronDown, ChevronUp, Edit2, Trash2, FileText, Calendar, Package,
  MapPin, Building2, Warehouse, TrendingUp, TrendingDown, MoreVertical,
  Check, AlertCircle, Clock, RefreshCw, CheckCircle, XCircle, Mic, Sparkles
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';

interface LotDetail {
  id: string;
  lotNumber: string;
  quantity: number;
  bags: number;
  quality: string;
  grade: string;
}

interface DispatchRecord {
  id: string;
  dispatchDate: string;
  dispatchId: string;
  dispatchQty: number;
  dispatchBags: number;
  actualDispatchQty: number;
  actualDispatchBags: number;
  replacedQty: number;
  replacedBags: number;
  packageType: string;
  lots: LotDetail[];
}

interface WHRRecord {
  id: string;
  whrDate: string;
  whrNumber: string;
  whrCreatedDate: string;
  scheme: string;
  commodity: string;
  stateAgency: string;
  district: string;
  fpoPacs: string;
  center: string;
  warehouse: string;
  acceptedQuantity: number;
  acceptedBags: number;
  quantityLoss: number;
  bagsLoss: number;
  quantityGain: number;
  bagsGain: number;
  lotCount: number;
  whrValue: number;
  whrType: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  whrSource: string;
  creatorRemark: string;
  slaCheckerId?: string;
  slaCheckerDate?: string;
  rejectedRemark?: string;
}

export default function WHRManagement() {
  const [currentView, setCurrentView] = useState<'info' | 'create' | 'view'>('info');
  const [expandedDispatchId, setExpandedDispatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [nlpSuggestion, setNlpSuggestion] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const recognitionRef = useRef<any>(null);

  // AI/NLP States for Create WHR Form
  const [nlpInput, setNlpInput] = useState('');
  const [nlpFormSuggestion, setNlpFormSuggestion] = useState('');
  const [isProcessingNlp, setIsProcessingNlp] = useState(false);
  const [isListeningForm, setIsListeningForm] = useState(false);
  const [isProcessingVoiceForm, setIsProcessingVoiceForm] = useState(false);
  const recognitionFormRef = useRef<any>(null);

  // Pagination states for tables
  const [dispatchRecordsLimit, setDispatchRecordsLimit] = useState(5);
  const [whrRecordsLimit, setWhrRecordsLimit] = useState(5); // Changed to 5 to show Load More button
  const [lotDetailsLimits, setLotDetailsLimits] = useState<Record<string, number>>({});

  // Dropdown states for Create Form
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [warehouseDropdownOpen, setWarehouseDropdownOpen] = useState(false);

  // Dropdown states for Filters
  const [statusFilterDropdownOpen, setStatusFilterDropdownOpen] = useState(false);
  const [filterCommodityDropdownOpen, setFilterCommodityDropdownOpen] = useState(false);
  const [filterStateDropdownOpen, setFilterStateDropdownOpen] = useState(false);

  const yearRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);
  const schemeRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<HTMLDivElement>(null);
  const commodityRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const warehouseRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const filterCommodityRef = useRef<HTMLDivElement>(null);
  const filterStateRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    year: '2025',
    season: 'Kharif',
    scheme: '',
    state: '',
    commodity: '',
    stateAgency: '',
    district: '',
    fpoPacs: '',
    center: '',
    warehouse: '',
    whrDate: '',
    remarks: ''
  });

  // Filter state
  const [filters, setFilters] = useState({
    status: 'All',
    commodity: 'All',
    state: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Mock dispatch data (shown when center and warehouse are selected)
  const [dispatchData, setDispatchData] = useState<DispatchRecord[]>([]);

  // Mock WHR records for view section
  const [whrRecords] = useState<WHRRecord[]>([
    {
      id: '1',
      whrDate: '2025-01-10',
      whrNumber: 'WHR2025001',
      whrCreatedDate: '2025-01-10 10:30 AM',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      commodity: 'Wheat',
      stateAgency: 'Karnataka State Agency',
      district: 'Bangalore Urban',
      fpoPacs: 'Bangalore FPO',
      center: 'Center A',
      warehouse: 'Warehouse 101',
      acceptedQuantity: 500,
      acceptedBags: 1000,
      quantityLoss: 5,
      bagsLoss: 10,
      quantityGain: 2,
      bagsGain: 5,
      lotCount: 5,
      whrValue: 2500000,
      whrType: 'Regular',
      status: 'Approved',
      whrSource: 'Mobile App',
      creatorRemark: 'Quality verified',
      slaCheckerId: 'SLA001',
      slaCheckerDate: '2025-01-10 02:00 PM'
    },
    {
      id: '2',
      whrDate: '2025-01-11',
      whrNumber: 'WHR2025002',
      whrCreatedDate: '2025-01-11 09:15 AM',
      scheme: 'PMFBY 2024',
      commodity: 'Rice',
      stateAgency: 'Tamil Nadu State Agency',
      district: 'Chennai',
      fpoPacs: 'Chennai PACS',
      center: 'Center B',
      warehouse: 'Warehouse 202',
      acceptedQuantity: 800,
      acceptedBags: 1600,
      quantityLoss: 8,
      bagsLoss: 16,
      quantityGain: 3,
      bagsGain: 6,
      lotCount: 8,
      whrValue: 4000000,
      whrType: 'Regular',
      status: 'Pending',
      whrSource: 'Web Portal',
      creatorRemark: 'Pending verification'
    },
    {
      id: '3',
      whrDate: '2025-01-09',
      whrNumber: 'WHR2025003',
      whrCreatedDate: '2025-01-09 03:45 PM',
      scheme: 'KISAN CREDIT 2025',
      commodity: 'Maize',
      stateAgency: 'Maharashtra State Agency',
      district: 'Pune',
      fpoPacs: 'Pune Farmers Coop',
      center: 'Center C',
      warehouse: 'Warehouse 303',
      acceptedQuantity: 350,
      acceptedBags: 700,
      quantityLoss: 3,
      bagsLoss: 6,
      quantityGain: 1,
      bagsGain: 2,
      lotCount: 4,
      whrValue: 1750000,
      whrType: 'Express',
      status: 'Rejected',
      whrSource: 'Mobile App',
      creatorRemark: 'Quality issues found',
      rejectedRemark: 'Moisture content above threshold'
    },
    {
      id: '4',
      whrDate: '2025-01-15',
      whrNumber: 'WHR2025004',
      whrCreatedDate: '2025-01-15 11:20 AM',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      commodity: 'Wheat',
      stateAgency: 'Punjab State Agency',
      district: 'Ludhiana',
      fpoPacs: 'Ludhiana Farmers Union',
      center: 'Center D',
      warehouse: 'Warehouse 404',
      acceptedQuantity: 650,
      acceptedBags: 1300,
      quantityLoss: 6,
      bagsLoss: 12,
      quantityGain: 4,
      bagsGain: 8,
      lotCount: 7,
      whrValue: 3250000,
      whrType: 'Regular',
      status: 'Approved',
      whrSource: 'Web Portal',
      creatorRemark: 'All quality checks passed',
      slaCheckerId: 'SLA004',
      slaCheckerDate: '2025-01-15 03:30 PM'
    },
    {
      id: '5',
      whrDate: '2025-01-16',
      whrNumber: 'WHR2025005',
      whrCreatedDate: '2025-01-16 09:45 AM',
      scheme: 'PMFBY 2024',
      commodity: 'Rice',
      stateAgency: 'Andhra Pradesh State Agency',
      district: 'Vijayawada',
      fpoPacs: 'Vijayawada PACS',
      center: 'Center E',
      warehouse: 'Warehouse 505',
      acceptedQuantity: 450,
      acceptedBags: 900,
      quantityLoss: 4,
      bagsLoss: 8,
      quantityGain: 2,
      bagsGain: 4,
      lotCount: 6,
      whrValue: 2250000,
      whrType: 'Regular',
      status: 'Pending',
      whrSource: 'Mobile App',
      creatorRemark: 'Awaiting quality certification'
    },
    {
      id: '6',
      whrDate: '2025-01-17',
      whrNumber: 'WHR2025006',
      whrCreatedDate: '2025-01-17 02:15 PM',
      scheme: 'KISAN CREDIT 2025',
      commodity: 'Maize',
      stateAgency: 'Gujarat State Agency',
      district: 'Ahmedabad',
      fpoPacs: 'Ahmedabad Farmers Coop',
      center: 'Center F',
      warehouse: 'Warehouse 606',
      acceptedQuantity: 300,
      acceptedBags: 600,
      quantityLoss: 2,
      bagsLoss: 4,
      quantityGain: 1,
      bagsGain: 2,
      lotCount: 4,
      whrValue: 1500000,
      whrType: 'Express',
      status: 'Approved',
      whrSource: 'Web Portal',
      creatorRemark: 'Express processing completed',
      slaCheckerId: 'SLA006',
      slaCheckerDate: '2025-01-17 04:00 PM'
    },
    {
      id: '7',
      whrDate: '2025-01-18',
      whrNumber: 'WHR2025007',
      whrCreatedDate: '2025-01-18 10:00 AM',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      commodity: 'Wheat',
      stateAgency: 'Haryana State Agency',
      district: 'Karnal',
      fpoPacs: 'Karnal FPO',
      center: 'Center G',
      warehouse: 'Warehouse 707',
      acceptedQuantity: 550,
      acceptedBags: 1100,
      quantityLoss: 5,
      bagsLoss: 10,
      quantityGain: 3,
      bagsGain: 6,
      lotCount: 8,
      whrValue: 2750000,
      whrType: 'Regular',
      status: 'Rejected',
      whrSource: 'Mobile App',
      creatorRemark: 'Discrepancy in lot details',
      rejectedRemark: 'Lot numbers do not match dispatch records'
    },
    {
      id: '8',
      whrDate: '2025-01-19',
      whrNumber: 'WHR2025008',
      whrCreatedDate: '2025-01-19 08:30 AM',
      scheme: 'PMFBY 2024',
      commodity: 'Rice',
      stateAgency: 'Kerala State Agency',
      district: 'Thrissur',
      fpoPacs: 'Thrissur Farmers Association',
      center: 'Center H',
      warehouse: 'Warehouse 808',
      acceptedQuantity: 400,
      acceptedBags: 800,
      quantityLoss: 3,
      bagsLoss: 6,
      quantityGain: 2,
      bagsGain: 4,
      lotCount: 5,
      whrValue: 2000000,
      whrType: 'Regular',
      status: 'Pending',
      whrSource: 'Web Portal',
      creatorRemark: 'Pending final verification'
    },
    {
      id: '9',
      whrDate: '2025-01-20',
      whrNumber: 'WHR2025009',
      whrCreatedDate: '2025-01-20 01:45 PM',
      scheme: 'KISAN CREDIT 2025',
      commodity: 'Maize',
      stateAgency: 'Rajasthan State Agency',
      district: 'Jaipur',
      fpoPacs: 'Jaipur PACS',
      center: 'Center I',
      warehouse: 'Warehouse 909',
      acceptedQuantity: 480,
      acceptedBags: 960,
      quantityLoss: 4,
      bagsLoss: 8,
      quantityGain: 3,
      bagsGain: 6,
      lotCount: 6,
      whrValue: 2400000,
      whrType: 'Express',
      status: 'Approved',
      whrSource: 'Mobile App',
      creatorRemark: 'All documentation verified',
      slaCheckerId: 'SLA009',
      slaCheckerDate: '2025-01-20 03:20 PM'
    },
    {
      id: '10',
      whrDate: '2025-01-21',
      whrNumber: 'WHR2025010',
      whrCreatedDate: '2025-01-21 10:15 AM',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      commodity: 'Wheat',
      stateAgency: 'Uttar Pradesh State Agency',
      district: 'Lucknow',
      fpoPacs: 'Lucknow FPO',
      center: 'Center J',
      warehouse: 'Warehouse 1010',
      acceptedQuantity: 720,
      acceptedBags: 1440,
      quantityLoss: 7,
      bagsLoss: 14,
      quantityGain: 5,
      bagsGain: 10,
      lotCount: 9,
      whrValue: 3600000,
      whrType: 'Regular',
      status: 'Pending',
      whrSource: 'Web Portal',
      creatorRemark: 'Large shipment, under review'
    },
    {
      id: '11',
      whrDate: '2025-01-22',
      whrNumber: 'WHR2025011',
      whrCreatedDate: '2025-01-22 09:00 AM',
      scheme: 'PMFBY 2024',
      commodity: 'Rice',
      stateAgency: 'West Bengal State Agency',
      district: 'Kolkata',
      fpoPacs: 'Kolkata Farmers Coop',
      center: 'Center K',
      warehouse: 'Warehouse 1111',
      acceptedQuantity: 380,
      acceptedBags: 760,
      quantityLoss: 3,
      bagsLoss: 6,
      quantityGain: 2,
      bagsGain: 4,
      lotCount: 5,
      whrValue: 1900000,
      whrType: 'Regular',
      status: 'Approved',
      whrSource: 'Mobile App',
      creatorRemark: 'All quality parameters met',
      slaCheckerId: 'SLA011',
      slaCheckerDate: '2025-01-22 11:30 AM'
    },
    {
      id: '12',
      whrDate: '2025-01-23',
      whrNumber: 'WHR2025012',
      whrCreatedDate: '2025-01-23 02:30 PM',
      scheme: 'KISAN CREDIT 2025',
      commodity: 'Maize',
      stateAgency: 'Madhya Pradesh State Agency',
      district: 'Bhopal',
      fpoPacs: 'Bhopal PACS',
      center: 'Center L',
      warehouse: 'Warehouse 1212',
      acceptedQuantity: 420,
      acceptedBags: 840,
      quantityLoss: 4,
      bagsLoss: 8,
      quantityGain: 3,
      bagsGain: 6,
      lotCount: 6,
      whrValue: 2100000,
      whrType: 'Express',
      status: 'Pending',
      whrSource: 'Web Portal',
      creatorRemark: 'Awaiting final approval'
    },
    {
      id: '13',
      whrDate: '2025-01-24',
      whrNumber: 'WHR2025013',
      whrCreatedDate: '2025-01-24 08:45 AM',
      scheme: 'MMFT FOR ETHANGK KHARIF 2025',
      commodity: 'Wheat',
      stateAgency: 'Odisha State Agency',
      district: 'Bhubaneswar',
      fpoPacs: 'Bhubaneswar FPO',
      center: 'Center M',
      warehouse: 'Warehouse 1313',
      acceptedQuantity: 580,
      acceptedBags: 1160,
      quantityLoss: 5,
      bagsLoss: 10,
      quantityGain: 4,
      bagsGain: 8,
      lotCount: 7,
      whrValue: 2900000,
      whrType: 'Regular',
      status: 'Approved',
      whrSource: 'Mobile App',
      creatorRemark: 'Quality standards exceeded',
      slaCheckerId: 'SLA013',
      slaCheckerDate: '2025-01-24 12:00 PM'
    },
    {
      id: '14',
      whrDate: '2025-01-25',
      whrNumber: 'WHR2025014',
      whrCreatedDate: '2025-01-25 10:20 AM',
      scheme: 'PMFBY 2024',
      commodity: 'Rice',
      stateAgency: 'Telangana State Agency',
      district: 'Hyderabad',
      fpoPacs: 'Hyderabad Farmers Union',
      center: 'Center N',
      warehouse: 'Warehouse 1414',
      acceptedQuantity: 320,
      acceptedBags: 640,
      quantityLoss: 2,
      bagsLoss: 4,
      quantityGain: 1,
      bagsGain: 2,
      lotCount: 4,
      whrValue: 1600000,
      whrType: 'Express',
      status: 'Rejected',
      whrSource: 'Web Portal',
      creatorRemark: 'Incomplete documentation',
      rejectedRemark: 'Missing mandatory certificates'
    },
    {
      id: '15',
      whrDate: '2025-01-26',
      whrNumber: 'WHR2025015',
      whrCreatedDate: '2025-01-26 01:15 PM',
      scheme: 'KISAN CREDIT 2025',
      commodity: 'Maize',
      stateAgency: 'Bihar State Agency',
      district: 'Patna',
      fpoPacs: 'Patna PACS',
      center: 'Center O',
      warehouse: 'Warehouse 1515',
      acceptedQuantity: 460,
      acceptedBags: 920,
      quantityLoss: 4,
      bagsLoss: 8,
      quantityGain: 3,
      bagsGain: 6,
      lotCount: 6,
      whrValue: 2300000,
      whrType: 'Regular',
      status: 'Pending',
      whrSource: 'Mobile App',
      creatorRemark: 'Under quality assessment'
    }
  ]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const refs = [
        yearRef, seasonRef, schemeRef, stateRef, commodityRef, centerRef, warehouseRef, 
        statusFilterRef, filterCommodityRef, filterStateRef
      ];
      
      refs.forEach(ref => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          if (ref === yearRef) setYearDropdownOpen(false);
          if (ref === seasonRef) setSeasonDropdownOpen(false);
          if (ref === schemeRef) setSchemeDropdownOpen(false);
          if (ref === stateRef) setStateDropdownOpen(false);
          if (ref === commodityRef) setCommodityDropdownOpen(false);
          if (ref === centerRef) setCenterDropdownOpen(false);
          if (ref === warehouseRef) setWarehouseDropdownOpen(false);
          if (ref === statusFilterRef) setStatusFilterDropdownOpen(false);
          if (ref === filterCommodityRef) setFilterCommodityDropdownOpen(false);
          if (ref === filterStateRef) setFilterStateDropdownOpen(false);
        }
      });

      // Close NLP suggestion popup when clicking outside
      const target = event.target as HTMLElement;
      if (nlpFormSuggestion && !target.closest('.nlp-suggestion-popup') && !target.closest('input[type="text"]')) {
        setNlpFormSuggestion('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [nlpFormSuggestion]);

  // NLP Search Logic
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      if (query.includes('approved') || query.includes('pending') || query.includes('rejected')) {
        setNlpSuggestion('Filtering by status');
      } else if (query.includes('karnataka') || query.includes('maharashtra') || query.includes('tamil')) {
        setNlpSuggestion('Searching by state');
      } else if (query.includes('wheat') || query.includes('rice') || query.includes('maize')) {
        setNlpSuggestion('Searching by commodity');
      } else if (query.match(/whr\d+/i) || query.match(/whr\s*\d+/i)) {
        setNlpSuggestion('Searching by WHR number');
      } else {
        setNlpSuggestion('Searching by WHR details');
      }
    } else {
      setNlpSuggestion('');
    }
  }, [searchQuery]);

  // Reset pagination when filters or search change
  useEffect(() => {
    setWhrRecordsLimit(5); // Reset to 5 to show Load More button
  }, [filters, searchQuery]);

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
    recognitionRef.current = recognition;
  };

  // When center and warehouse are selected, fetch dispatch data
  useEffect(() => {
    if (formData.center && formData.warehouse) {
      // Mock API call - replace with actual API
      const mockDispatches: DispatchRecord[] = [
        {
          id: 'D1',
          dispatchDate: '2025-01-12',
          dispatchId: 'DISP2025001',
          dispatchQty: 250,
          dispatchBags: 500,
          actualDispatchQty: 248,
          actualDispatchBags: 498,
          replacedQty: 2,
          replacedBags: 4,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L1', lotNumber: 'LOT001', quantity: 100, bags: 200, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L2', lotNumber: 'LOT002', quantity: 80, bags: 160, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L3', lotNumber: 'LOT003', quantity: 68, bags: 138, quality: 'Common', grade: 'Grade B' },
            { id: 'L30', lotNumber: 'LOT030', quantity: 45, bags: 90, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L31', lotNumber: 'LOT031', quantity: 42, bags: 84, quality: 'Common', grade: 'Grade B' },
            { id: 'L32', lotNumber: 'LOT032', quantity: 38, bags: 76, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L33', lotNumber: 'LOT033', quantity: 35, bags: 70, quality: 'Common', grade: 'Grade B' },
            { id: 'L34', lotNumber: 'LOT034', quantity: 32, bags: 64, quality: 'FAQ', grade: 'Grade A' }
          ]
        },
        {
          id: 'D2',
          dispatchDate: '2025-01-13',
          dispatchId: 'DISP2025002',
          dispatchQty: 300,
          dispatchBags: 600,
          actualDispatchQty: 300,
          actualDispatchBags: 600,
          replacedQty: 0,
          replacedBags: 0,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L4', lotNumber: 'LOT004', quantity: 150, bags: 300, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L5', lotNumber: 'LOT005', quantity: 150, bags: 300, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L35', lotNumber: 'LOT035', quantity: 75, bags: 150, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L36', lotNumber: 'LOT036', quantity: 70, bags: 140, quality: 'Common', grade: 'Grade B' },
            { id: 'L37', lotNumber: 'LOT037', quantity: 65, bags: 130, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L38', lotNumber: 'LOT038', quantity: 60, bags: 120, quality: 'FAQ', grade: 'Grade A' }
          ]
        },
        {
          id: 'D3',
          dispatchDate: '2025-01-14',
          dispatchId: 'DISP2025003',
          dispatchQty: 200,
          dispatchBags: 400,
          actualDispatchQty: 198,
          actualDispatchBags: 396,
          replacedQty: 2,
          replacedBags: 4,
          packageType: 'Plastic Bags',
          lots: [
            { id: 'L6', lotNumber: 'LOT006', quantity: 100, bags: 200, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L7', lotNumber: 'LOT007', quantity: 98, bags: 196, quality: 'Common', grade: 'Grade B' }
          ]
        },
        {
          id: 'D4',
          dispatchDate: '2025-01-15',
          dispatchId: 'DISP2025004',
          dispatchQty: 400,
          dispatchBags: 800,
          actualDispatchQty: 398,
          actualDispatchBags: 796,
          replacedQty: 2,
          replacedBags: 4,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L8', lotNumber: 'LOT008', quantity: 120, bags: 240, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L9', lotNumber: 'LOT009', quantity: 110, bags: 220, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L10', lotNumber: 'LOT010', quantity: 90, bags: 180, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L11', lotNumber: 'LOT011', quantity: 78, bags: 156, quality: 'Common', grade: 'Grade B' }
          ]
        },
        {
          id: 'D5',
          dispatchDate: '2025-01-16',
          dispatchId: 'DISP2025005',
          dispatchQty: 350,
          dispatchBags: 700,
          actualDispatchQty: 350,
          actualDispatchBags: 700,
          replacedQty: 0,
          replacedBags: 0,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L12', lotNumber: 'LOT012', quantity: 140, bags: 280, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L13', lotNumber: 'LOT013', quantity: 130, bags: 260, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L14', lotNumber: 'LOT014', quantity: 80, bags: 160, quality: 'Common', grade: 'Grade B' }
          ]
        },
        {
          id: 'D6',
          dispatchDate: '2025-01-17',
          dispatchId: 'DISP2025006',
          dispatchQty: 280,
          dispatchBags: 560,
          actualDispatchQty: 278,
          actualDispatchBags: 556,
          replacedQty: 2,
          replacedBags: 4,
          packageType: 'Plastic Bags',
          lots: [
            { id: 'L15', lotNumber: 'LOT015', quantity: 100, bags: 200, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L16', lotNumber: 'LOT016', quantity: 95, bags: 190, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L17', lotNumber: 'LOT017', quantity: 83, bags: 166, quality: 'Common', grade: 'Grade B' }
          ]
        },
        {
          id: 'D7',
          dispatchDate: '2025-01-18',
          dispatchId: 'DISP2025007',
          dispatchQty: 450,
          dispatchBags: 900,
          actualDispatchQty: 448,
          actualDispatchBags: 896,
          replacedQty: 2,
          replacedBags: 4,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L18', lotNumber: 'LOT018', quantity: 150, bags: 300, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L19', lotNumber: 'LOT019', quantity: 145, bags: 290, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L20', lotNumber: 'LOT020', quantity: 153, bags: 306, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L39', lotNumber: 'LOT039', quantity: 80, bags: 160, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L40', lotNumber: 'LOT040', quantity: 75, bags: 150, quality: 'Common', grade: 'Grade B' },
            { id: 'L41', lotNumber: 'LOT041', quantity: 70, bags: 140, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L42', lotNumber: 'LOT042', quantity: 65, bags: 130, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L43', lotNumber: 'LOT043', quantity: 60, bags: 120, quality: 'Common', grade: 'Grade B' }
          ]
        },
        {
          id: 'D8',
          dispatchDate: '2025-01-19',
          dispatchId: 'DISP2025008',
          dispatchQty: 320,
          dispatchBags: 640,
          actualDispatchQty: 320,
          actualDispatchBags: 640,
          replacedQty: 0,
          replacedBags: 0,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L21', lotNumber: 'LOT021', quantity: 110, bags: 220, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L22', lotNumber: 'LOT022', quantity: 105, bags: 210, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L23', lotNumber: 'LOT023', quantity: 105, bags: 210, quality: 'FAQ', grade: 'Grade A' }
          ]
        },
        {
          id: 'D9',
          dispatchDate: '2025-01-20',
          dispatchId: 'DISP2025009',
          dispatchQty: 380,
          dispatchBags: 760,
          actualDispatchQty: 376,
          actualDispatchBags: 752,
          replacedQty: 4,
          replacedBags: 8,
          packageType: 'Plastic Bags',
          lots: [
            { id: 'L24', lotNumber: 'LOT024', quantity: 125, bags: 250, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L25', lotNumber: 'LOT025', quantity: 120, bags: 240, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L26', lotNumber: 'LOT026', quantity: 131, bags: 262, quality: 'Common', grade: 'Grade B' }
          ]
        },
        {
          id: 'D10',
          dispatchDate: '2025-01-21',
          dispatchId: 'DISP2025010',
          dispatchQty: 500,
          dispatchBags: 1000,
          actualDispatchQty: 498,
          actualDispatchBags: 996,
          replacedQty: 2,
          replacedBags: 4,
          packageType: 'Jute Bags',
          lots: [
            { id: 'L27', lotNumber: 'LOT027', quantity: 165, bags: 330, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L28', lotNumber: 'LOT028', quantity: 160, bags: 320, quality: 'FAQ', grade: 'Grade A' },
            { id: 'L29', lotNumber: 'LOT029', quantity: 173, bags: 346, quality: 'FAQ', grade: 'Grade A' }
          ]
        }
      ];
      setDispatchData(mockDispatches);
      setDispatchRecordsLimit(5); // Reset to initial limit
      setLotDetailsLimits({}); // Reset lot details limits
    } else {
      setDispatchData([]);
      setDispatchRecordsLimit(5);
      setLotDetailsLimits({});
    }
  }, [formData.center, formData.warehouse]);

  const handleCreateWHR = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating WHR with form data:', formData);
    console.log('Based on dispatches:', dispatchData);
    // Add WHR creation logic here
  };

  // NLP Processing for Create WHR Form - Parse natural language input
  const processWHRNlpInput = (input: string) => {
    if (!input.trim()) return;
    
    setIsProcessingNlp(true);
    setNlpFormSuggestion('');
    
    // Simulate AI processing delay
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const updates: any = {};
      let suggestion = '';
      
      // Extract Year
      const yearMatch = lowerInput.match(/(?:year|yr)[:\s]*(\d{4})/i) ||
                       lowerInput.match(/\b(202[3-5]|20[2-9]\d)\b/);
      if (yearMatch) {
        updates.year = yearMatch[1];
        suggestion += `✓ Year: ${yearMatch[1]}\n`;
      }
      
      // Extract Season
      if (lowerInput.includes('kharif')) {
        updates.season = 'Kharif';
        suggestion += '✓ Season: Kharif\n';
      } else if (lowerInput.includes('rabi')) {
        updates.season = 'Rabi';
        suggestion += '✓ Season: Rabi\n';
      }
      
      // Extract Scheme
      if (lowerInput.includes('mmft') || lowerInput.includes('ethangk')) {
        updates.scheme = 'MMFT FOR ETHANGK KHARIF 2025';
        suggestion += '✓ Scheme: MMFT FOR ETHANGK KHARIF 2025\n';
      } else if (lowerInput.includes('pmfby')) {
        updates.scheme = 'PMFBY 2024';
        suggestion += '✓ Scheme: PMFBY 2024\n';
      } else if (lowerInput.includes('kisan') || lowerInput.includes('credit')) {
        updates.scheme = 'KISAN CREDIT 2025';
        suggestion += '✓ Scheme: KISAN CREDIT 2025\n';
      }
      
      // Extract Commodity
      if (lowerInput.includes('wheat')) {
        updates.commodity = 'Wheat';
        suggestion += '✓ Commodity: Wheat\n';
      } else if (lowerInput.includes('rice')) {
        updates.commodity = 'Rice';
        suggestion += '✓ Commodity: Rice\n';
      } else if (lowerInput.includes('maize')) {
        updates.commodity = 'Maize';
        suggestion += '✓ Commodity: Maize\n';
      }
      
      // Extract State
      if (lowerInput.includes('karnataka')) {
        updates.state = 'Karnataka';
        suggestion += '✓ State: Karnataka\n';
      } else if (lowerInput.includes('tamil nadu') || lowerInput.includes('tamil')) {
        updates.state = 'Tamil Nadu';
        suggestion += '✓ State: Tamil Nadu\n';
      } else if (lowerInput.includes('maharashtra')) {
        updates.state = 'Maharashtra';
        suggestion += '✓ State: Maharashtra\n';
      }
      
      // Extract District
      const districtMatch = lowerInput.match(/district[:\s]*([^,]+)/i) ||
                           lowerInput.match(/district[:\s]*(\w+(?:\s+\w+)*)/i);
      if (districtMatch) {
        updates.district = districtMatch[1].trim();
        suggestion += `✓ District: ${districtMatch[1].trim()}\n`;
      } else if (lowerInput.includes('bangalore') || lowerInput.includes('bangalore urban')) {
        updates.district = 'Bangalore Urban';
        suggestion += '✓ District: Bangalore Urban\n';
      } else if (lowerInput.includes('chennai')) {
        updates.district = 'Chennai';
        suggestion += '✓ District: Chennai\n';
      } else if (lowerInput.includes('pune')) {
        updates.district = 'Pune';
        suggestion += '✓ District: Pune\n';
      }
      
      // Extract FPO/PACS
      const fpoMatch = lowerInput.match(/fpo[:\s]*([^,]+)/i) ||
                       lowerInput.match(/pacs[:\s]*([^,]+)/i);
      if (fpoMatch) {
        updates.fpoPacs = fpoMatch[1].trim();
        suggestion += `✓ FPO/PACS: ${fpoMatch[1].trim()}\n`;
      }
      
      // Extract Center
      if (lowerInput.includes('center a') || lowerInput.includes('centre a')) {
        updates.center = 'Center A';
        suggestion += '✓ Center: Center A\n';
      } else if (lowerInput.includes('center b') || lowerInput.includes('centre b')) {
        updates.center = 'Center B';
        suggestion += '✓ Center: Center B\n';
      } else if (lowerInput.includes('center c') || lowerInput.includes('centre c')) {
        updates.center = 'Center C';
        suggestion += '✓ Center: Center C\n';
      }
      
      // Extract Warehouse
      const warehouseMatch = lowerInput.match(/warehouse[:\s]*(\d+)/i) ||
                            lowerInput.match(/warehouse\s*(\d+)/i);
      if (warehouseMatch) {
        updates.warehouse = `Warehouse ${warehouseMatch[1]}`;
        suggestion += `✓ Warehouse: Warehouse ${warehouseMatch[1]}\n`;
      } else if (lowerInput.includes('warehouse 101')) {
        updates.warehouse = 'Warehouse 101';
        suggestion += '✓ Warehouse: Warehouse 101\n';
      } else if (lowerInput.includes('warehouse 202')) {
        updates.warehouse = 'Warehouse 202';
        suggestion += '✓ Warehouse: Warehouse 202\n';
      } else if (lowerInput.includes('warehouse 303')) {
        updates.warehouse = 'Warehouse 303';
        suggestion += '✓ Warehouse: Warehouse 303\n';
      }
      
      // Extract State Agency
      const agencyMatch = lowerInput.match(/state agency[:\s]*([^,]+)/i);
      if (agencyMatch) {
        updates.stateAgency = agencyMatch[1].trim();
        suggestion += `✓ State Agency: ${agencyMatch[1].trim()}\n`;
      }
      
      // Extract WHR Date
      const dateMatch = lowerInput.match(/whr date[:\s]*(\d{4}[-/]\d{1,2}[-/]\d{1,2})/i) ||
                       lowerInput.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})/);
      if (dateMatch) {
        const dateStr = dateMatch[1].replace(/\//g, '-');
        updates.whrDate = dateStr;
        suggestion += `✓ WHR Date: ${dateStr}\n`;
      }
      
      // Extract Remarks
      const remarksMatch = lowerInput.match(/remark[:\s]*([^,]+)/i) ||
                          lowerInput.match(/note[:\s]*([^,]+)/i);
      if (remarksMatch) {
        updates.remarks = remarksMatch[1].trim();
        suggestion += `✓ Remarks: ${remarksMatch[1].trim()}\n`;
      }
      
      // Apply updates
      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({ ...prev, ...updates }));
        setNlpFormSuggestion(suggestion.trim() || '💡 Parsed WHR form data from your input');
      } else {
        setNlpFormSuggestion('💡 Try: "Year 2025, Kharif season, MMFT scheme, Wheat commodity, Karnataka state, Bangalore Urban district, Center A, Warehouse 101, WHR date 2025-01-15"');
      }
      
      setIsProcessingNlp(false);
    }, 800);
  };

  // Handle Voice Search for Create WHR Form
  const handleVoiceSearchForm = () => {
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
      setIsListeningForm(true);
      setIsProcessingVoiceForm(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setNlpInput(transcript);
      setIsListeningForm(false);
      setIsProcessingVoiceForm(true);

      // Process the voice input
      processWHRNlpInput(transcript);

      setTimeout(() => {
        setIsProcessingVoiceForm(false);
      }, 1000);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListeningForm(false);
      setIsProcessingVoiceForm(false);
    };

    recognition.onend = () => {
      setIsListeningForm(false);
    };

    recognition.start();
    recognitionFormRef.current = recognition;
  };

  // Handle NLP input change
  const handleNlpInputChange = (value: string) => {
    setNlpInput(value);
    // Clear suggestion when user starts typing
    if (!value.trim()) {
      setNlpFormSuggestion('');
      setIsProcessingNlp(false);
    }
  };

  // Auto-process NLP input when user stops typing (debounce)
  useEffect(() => {
    if (nlpInput.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        processWHRNlpInput(nlpInput);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [nlpInput]);

  const getStatusBadge = (status: string) => {
    const dotColor = status === 'Approved' ? '#00A040' : status === 'Pending' ? '#FFA200' : '#E94545';
    
    return (
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #CCD8DF',
          borderRadius: '0',
          color: '#666666',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: dotColor
          }}
        ></div>
        {status}
      </span>
    );
  };

  // Filter WHR records
  const filteredWHRRecords = whrRecords.filter(record => {
    // Status Filter
    if (filters.status !== 'All' && record.status !== filters.status) return false;

    // Commodity Filter
    if (filters.commodity !== 'All' && record.commodity !== filters.commodity) return false;

    // State Filter
    if (filters.state !== 'All') {
      const stateMatch = filters.state === 'Karnataka' && record.stateAgency.includes('Karnataka') ||
                        filters.state === 'Tamil Nadu' && record.stateAgency.includes('Tamil Nadu') ||
                        filters.state === 'Maharashtra' && record.stateAgency.includes('Maharashtra');
      if (!stateMatch) return false;
    }

    // Date Range Filter
    if (filters.dateFrom && record.whrDate < filters.dateFrom) return false;
    if (filters.dateTo && record.whrDate > filters.dateTo) return false;

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        record.whrNumber.toLowerCase().includes(query) ||
        record.commodity.toLowerCase().includes(query) ||
        record.stateAgency.toLowerCase().includes(query) ||
        record.warehouse.toLowerCase().includes(query) ||
        record.district.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    return true;
  });

  const activeFilterCount = [
    filters.status !== 'All',
    filters.commodity !== 'All',
    filters.state !== 'All',
    filters.dateFrom !== '',
    filters.dateTo !== ''
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({
      status: 'All',
      commodity: 'All',
      state: 'All',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Load more functions
  const loadMoreDispatchRecords = () => {
    setDispatchRecordsLimit(prev => prev + 5);
  };

  const loadMoreWHRRecords = () => {
    setWhrRecordsLimit(prev => prev + 5); // Load 5 more at a time
  };

  const loadMoreLotDetails = (dispatchId: string) => {
    setLotDetailsLimits(prev => ({
      ...prev,
      [dispatchId]: (prev[dispatchId] || 5) + 5
    }));
  };

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
          Procurement
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#315B78' }}>WHR Management</span>
      </div>

      {/* INFO CARD SCREEN */}
      {currentView === 'info' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF', minHeight: 'calc(100vh - 200px)' }}>
          <div className="p-12 flex flex-col items-center justify-center text-center" style={{ minHeight: '600px' }}>
            <div className="mb-8">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#E6F7F7' }}>
                <Warehouse className="w-12 h-12" style={{ color: '#027F83' }} />
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#003A5D', marginBottom: '12px' }}>
                Warehouse Receipt Management
              </h1>
              <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                Efficiently manage Warehouse Receipts (WHR) for your procurement operations. Create new WHR records based on dispatch details or view and manage existing WHR records with comprehensive tracking and status management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
              {/* Create WHR Card */}
              <div 
                className="rounded-xl border p-8 cursor-pointer transition-all hover:shadow-lg"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#E5EBEF',
                  borderWidth: '2px'
                }}
                onClick={() => setCurrentView('create')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#027F83';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 127, 131, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5EBEF';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E6F7F7' }}>
                  <Plus className="w-8 h-8" style={{ color: '#027F83' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                  Create WHR
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                  Create new Warehouse Receipt records based on dispatch details from centers to warehouses. Fill in the required information and generate WHR documents.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#027F83' }}>
                  <span>Get Started</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* View WHR Card */}
              <div 
                className="rounded-xl border p-8 cursor-pointer transition-all hover:shadow-lg"
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#E5EBEF',
                  borderWidth: '2px'
                }}
                onClick={() => setCurrentView('view')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#027F83';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 127, 131, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5EBEF';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E6F7F7' }}>
                  <Eye className="w-8 h-8" style={{ color: '#027F83' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                  View WHR Records
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                  View, search, and manage all Warehouse Receipt records. Filter by status, commodity, state, or date range. Download receipts and track WHR status.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: '#027F83' }}>
                  <span>View Records</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#F7F9FA' }}>
                <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: '#027F83' }} />
                <p style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Track Status</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#F7F9FA' }}>
                <Download className="w-6 h-6 mx-auto mb-2" style={{ color: '#027F83' }} />
                <p style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Download Receipts</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#F7F9FA' }}>
                <Search className="w-6 h-6 mx-auto mb-2" style={{ color: '#027F83' }} />
                <p style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Advanced Search</p>
              </div>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: '#F7F9FA' }}>
                <Filter className="w-6 h-6 mx-auto mb-2" style={{ color: '#027F83' }} />
                <p style={{ fontSize: '12px', color: '#666', fontWeight: '600' }}>Smart Filters</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE WHR SCREEN */}
      {currentView === 'create' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Back Button */}
          <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('info')}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
                style={{ color: '#027F83' }}
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  Create Warehouse Receipt
                </h2>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  Fill in the details to view dispatches from center to warehouse
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-2">
                <form onSubmit={handleCreateWHR}>
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
                        placeholder="Try: 'Year 2025, Kharif season, MMFT scheme, Wheat commodity, Karnataka state, Bangalore Urban district, Center A, Warehouse 101, WHR date 2025-01-15'"
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
                            processWHRNlpInput(nlpInput);
                          }
                        }}
                      />
                      <button
                        onClick={handleVoiceSearchForm}
                        disabled={isListeningForm || isProcessingVoiceForm}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-md transition-all disabled:opacity-50"
                        style={{
                          backgroundColor: isListeningForm ? '#FF6B6B' : isProcessingVoiceForm ? '#FFA500' : 'transparent'
                        }}
                        title={isListeningForm ? 'Listening...' : isProcessingVoiceForm ? 'Processing...' : 'Voice entry'}
                      >
                        <Mic
                          className={`w-4 h-4 transition-colors ${
                            isListeningForm ? 'text-white' : isProcessingVoiceForm ? 'text-white' : ''
                          }`}
                          style={{
                            color: isListeningForm ? '#FFFFFF' : isProcessingVoiceForm ? '#FFFFFF' : '#666666'
                          }}
                        />
                      </button>
                      {(nlpFormSuggestion || isProcessingNlp) && (
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
                                  {nlpFormSuggestion}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setNlpFormSuggestion('');
                                setIsProcessingNlp(false);
                              }}
                              type="button"
                              className="p-1 rounded hover:bg-white transition-colors"
                              style={{ color: '#666' }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777', marginBottom: '4px' }}>
                      WHR Details
                    </h2>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                      Fill in the details to view dispatches from center to warehouse
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Year */}
                    <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Year <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={formData.year}
                      onChange={(value) => setFormData({ ...formData, year: value })}
                      options={[
                        { value: '2025', label: '2025' },
                        { value: '2024', label: '2024' },
                        { value: '2023', label: '2023' }
                      ]}
                      isOpen={yearDropdownOpen}
                      onToggle={() => setYearDropdownOpen(!yearDropdownOpen)}
                      dropdownRef={yearRef}
                    />
                  </div>

                  {/* Season */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Season <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={formData.season}
                      onChange={(value) => setFormData({ ...formData, season: value })}
                      options={[
                        { value: 'Kharif', label: 'Kharif' },
                        { value: 'Rabi', label: 'Rabi' }
                      ]}
                      isOpen={seasonDropdownOpen}
                      onToggle={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                      dropdownRef={seasonRef}
                    />
                  </div>

                  {/* Scheme */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
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

                    {/* Commodity */}
                    <div>
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Commodity <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.commodity}
                        onChange={(value) => setFormData({ ...formData, commodity: value })}
                        options={[
                          { value: '', label: 'Select Commodity' },
                          { value: 'Wheat', label: 'Wheat' },
                          { value: 'Rice', label: 'Rice' },
                          { value: 'Maize', label: 'Maize' }
                        ]}
                        placeholder="Select Commodity"
                        isOpen={commodityDropdownOpen}
                        onToggle={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                        dropdownRef={commodityRef}
                      />
                    </div>

                    {/* State */}
                    <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      State <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={formData.state}
                      onChange={(value) => setFormData({ ...formData, state: value })}
                      options={[
                        { value: '', label: 'Select State' },
                        { value: 'Karnataka', label: 'Karnataka' },
                        { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                        { value: 'Maharashtra', label: 'Maharashtra' }
                      ]}
                      placeholder="Select State"
                      isOpen={stateDropdownOpen}
                      onToggle={() => setStateDropdownOpen(!stateDropdownOpen)}
                      dropdownRef={stateRef}
                    />
                  </div>

                  {/* District */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      District <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="Enter District"
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                  {/* FPO/PACS */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      FPO/PACS <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fpoPacs}
                      onChange={(e) => setFormData({ ...formData, fpoPacs: e.target.value })}
                      placeholder="Enter FPO/PACS"
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                  {/* Center - IMPORTANT: Triggers dispatch fetch */}
                  <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      Center <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <CustomDropdown
                      value={formData.center}
                      onChange={(value) => setFormData({ ...formData, center: value })}
                      options={[
                        { value: '', label: 'Select Center' },
                        { value: 'Center A', label: 'Center A' },
                        { value: 'Center B', label: 'Center B' },
                        { value: 'Center C', label: 'Center C' }
                      ]}
                      placeholder="Select Center"
                      isOpen={centerDropdownOpen}
                      onToggle={() => setCenterDropdownOpen(!centerDropdownOpen)}
                      dropdownRef={centerRef}
                    />
                  </div>

                    {/* Warehouse - IMPORTANT: Triggers dispatch fetch */}
                    <div>
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Warehouse <span style={{ color: '#E94545' }}>*</span>
                      </label>
                      <CustomDropdown
                        value={formData.warehouse}
                        onChange={(value) => setFormData({ ...formData, warehouse: value })}
                        options={[
                          { value: '', label: 'Select Warehouse' },
                          { value: 'Warehouse 101', label: 'Warehouse 101' },
                          { value: 'Warehouse 202', label: 'Warehouse 202' },
                          { value: 'Warehouse 303', label: 'Warehouse 303' }
                        ]}
                        placeholder="Select Warehouse"
                        isOpen={warehouseDropdownOpen}
                        onToggle={() => setWarehouseDropdownOpen(!warehouseDropdownOpen)}
                        dropdownRef={warehouseRef}
                      />
                    </div>

                    {/* State Agency */}
                    <div>
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        State Agency
                      </label>
                      <input
                        type="text"
                        value={formData.stateAgency}
                        onChange={(e) => setFormData({ ...formData, stateAgency: e.target.value })}
                        placeholder="Enter State Agency"
                        className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#315B78',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    {/* WHR Date */}
                    <div>
                    <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                      WHR Date <span style={{ color: '#E94545' }}>*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.whrDate}
                      onChange={(e) => setFormData({ ...formData, whrDate: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                      style={{
                        borderColor: '#CCD8DF',
                        color: '#315B78',
                        fontSize: '14px',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>

                    {/* Remarks - Full width */}
                    <div className="md:col-span-2">
                      <label className="block mb-2" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
                        Remarks
                      </label>
                      <textarea
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        placeholder="Enter any remarks or notes"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none"
                        style={{
                          borderColor: '#CCD8DF',
                          color: '#315B78',
                          fontSize: '14px',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>
                  </div>

                  {/* Dispatch Details Section - Shows when Center and Warehouse selected */}
                  {formData.center && formData.warehouse && dispatchData.length > 0 && (
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
                <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                      Dispatch Details
                    </h2>
                    <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                      From {formData.center} to {formData.warehouse} • {dispatchData.length} dispatch(es) found
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Total Quantity</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#027F83' }}>
                        {dispatchData.reduce((sum, d) => sum + d.actualDispatchQty, 0)} QTL
                      </div>
                    </div>
                    <button
                      onClick={handleCreateWHR}
                      className="flex items-center gap-2 px-6 h-12 rounded-lg transition-all"
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
                      <Check className="w-5 h-5" />
                      Create WHR
                    </button>
                  </div>
                </div>

                {/* Dispatch Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: '#F7F9FA', borderBottom: '1px solid #E5EBEF' }}>
                        <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Dispatch Date
                        </th>
                        <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Dispatch ID
                        </th>
                        <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Dispatch Qty (QTL)
                        </th>
                        <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Dispatch Bags
                        </th>
                        <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Actual Dispatch Qty
                        </th>
                        <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Actual Dispatch Bags
                        </th>
                        <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Replaced Qty
                        </th>
                        <th className="px-6 py-4 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Replaced Bags
                        </th>
                        <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Package Type
                        </th>
                        <th className="px-6 py-4 text-center" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          View Lot Details
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatchData.slice(0, dispatchRecordsLimit).map((dispatch) => (
                        <>
                          {/* Dispatch Row */}
                          <tr key={dispatch.id} className="border-b transition-colors hover:bg-gray-50" style={{ borderColor: '#E5EBEF' }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5" style={{ fontSize: '13px', color: '#315B78' }}>
                                <Calendar className="w-3.5 h-3.5" style={{ color: '#999' }} />
                                {dispatch.dispatchDate}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#315B78' }}>
                                {dispatch.dispatchId}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                                {dispatch.dispatchQty}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                                {dispatch.dispatchBags}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div style={{ fontSize: '14px', fontWeight: '700', color: '#027F83' }}>
                                {dispatch.actualDispatchQty}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div style={{ fontSize: '14px', fontWeight: '600', color: '#027F83' }}>
                                {dispatch.actualDispatchBags}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div style={{ fontSize: '14px', fontWeight: '600', color: dispatch.replacedQty > 0 ? '#FF9800' : '#315B78' }}>
                                {dispatch.replacedQty}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div style={{ fontSize: '14px', fontWeight: '600', color: dispatch.replacedBags > 0 ? '#FF9800' : '#315B78' }}>
                                {dispatch.replacedBags}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div
                                className="inline-block px-3 py-1.5 rounded-lg"
                                style={{ backgroundColor: '#E6F7F7', color: '#027F83', fontSize: '12px', fontWeight: '600' }}
                              >
                                {dispatch.packageType}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => setExpandedDispatchId(expandedDispatchId === dispatch.id ? null : dispatch.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                                style={{
                                  color: expandedDispatchId === dispatch.id ? '#027F83' : '#315B78',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  border: '1px solid',
                                  borderColor: expandedDispatchId === dispatch.id ? '#027F83' : '#CCD8DF',
                                  backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <Package className="w-4 h-4" />
                                {dispatch.lots.length} Lots
                                {expandedDispatchId === dispatch.id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                          </tr>

                          {/* Lot Details - Expanded Row */}
                          {expandedDispatchId === dispatch.id && (
                            <tr>
                              <td colSpan={10} style={{ backgroundColor: '#F7F9FA', padding: 0 }}>
                                <div className="px-12 py-6">
                                  <div className="mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4" style={{ color: '#027F83' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>
                                      Lot Details for {dispatch.dispatchId}
                                    </span>
                                  </div>
                                  
                                  {/* Lot Details Table */}
                                  <table className="w-full rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                                    <thead>
                                      <tr style={{ backgroundColor: '#E6F7F7', borderBottom: '1px solid #E5EBEF' }}>
                                        <th className="px-4 py-3 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#027F83', textTransform: 'uppercase' }}>
                                          Lot Number
                                        </th>
                                        <th className="px-4 py-3 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#027F83', textTransform: 'uppercase' }}>
                                          Quantity (QTL)
                                        </th>
                                        <th className="px-4 py-3 text-right" style={{ fontSize: '12px', fontWeight: '700', color: '#027F83', textTransform: 'uppercase' }}>
                                          Bags
                                        </th>
                                        <th className="px-4 py-3 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#027F83', textTransform: 'uppercase' }}>
                                          Quality
                                        </th>
                                        <th className="px-4 py-3 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#027F83', textTransform: 'uppercase' }}>
                                          Grade
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {dispatch.lots.slice(0, lotDetailsLimits[dispatch.id] || 5).map((lot) => (
                                        <tr key={lot.id} className="border-b" style={{ borderColor: '#E5EBEF' }}>
                                          <td className="px-4 py-3">
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#315B78' }}>
                                              {lot.lotNumber}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#027F83' }}>
                                              {lot.quantity}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-right">
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#315B78' }}>
                                              {lot.bags}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#315B78' }}>
                                              {lot.quality}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <div
                                              className="inline-block px-3 py-1 rounded-full"
                                              style={{
                                                backgroundColor: lot.grade === 'Grade A' ? '#E8F8F5' : '#FFF4E6',
                                                color: lot.grade === 'Grade A' ? '#00A67E' : '#FF9800',
                                                fontSize: '11px',
                                                fontWeight: '600'
                                              }}
                                            >
                                              {lot.grade}
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>

                                  {/* Load More Button for Lot Details */}
                                  {dispatch.lots.length > (lotDetailsLimits[dispatch.id] || 5) && (
                                    <div className="mt-4 flex justify-center">
                                      <button
                                        onClick={() => loadMoreLotDetails(dispatch.id)}
                                        className="px-4 py-2 rounded-lg transition-all"
                                        style={{
                                          backgroundColor: 'transparent',
                                          color: '#027F83',
                                          border: '1px solid #027F83',
                                          fontSize: '13px',
                                          fontWeight: '600'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.backgroundColor = '#E6F7F7';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                      >
                                        Load More Lots ({dispatch.lots.length - (lotDetailsLimits[dispatch.id] || 5)} more)
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Load More Button for Dispatch Records */}
                {dispatchData.length > dispatchRecordsLimit && (
                  <div className="px-6 py-4 border-t flex justify-center" style={{ borderColor: '#E5EBEF' }}>
                    <button
                      onClick={loadMoreDispatchRecords}
                      className="px-6 py-2 rounded-lg transition-all"
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
                      Load More ({dispatchData.length - dispatchRecordsLimit} more)
                    </button>
                  </div>
                )}
              </div>
            )}

                  {/* Empty State when no center/warehouse selected */}
                  {(!formData.center || !formData.warehouse) && (
                    <div className="rounded-xl p-12 text-center border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
                      <Warehouse className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCD8DF' }} />
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#315B78', marginBottom: '8px' }}>
                        Select Center and Warehouse
                      </p>
                      <p style={{ fontSize: '14px', color: '#666' }}>
                        Choose both center and warehouse to view dispatch details
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column: Summary Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  {/* Summary Card */}
                  <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
                    {/* Header */}
                    <div className="px-6 py-4 border-b" style={{ backgroundColor: '#F7F9FA', borderColor: '#E5EBEF' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
                          <FileText className="w-5 h-5" style={{ color: '#027F83' }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '2px' }}>
                            WHR Summary
                          </h3>
                          <p style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Form Preview
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Selected Values */}
                    <div className="p-6 space-y-5">
                      {/* Basic Information Section */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#027F83' }}></div>
                          <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Basic Information
                          </h4>
                        </div>
                        
                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year & Season</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#003A5D' }}>
                              {formData.year || <span style={{ color: '#999' }}>Not selected</span>}
                            </div>
                            {formData.year && formData.season && (
                              <span style={{ fontSize: '12px', color: '#999' }}>•</span>
                            )}
                            <div style={{ fontSize: '15px', fontWeight: '700', color: '#003A5D' }}>
                              {formData.season || <span style={{ color: '#999' }}>Not selected</span>}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Commodity</div>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: formData.commodity ? '#003A5D' : '#999' }}>
                            {formData.commodity || 'Not selected'}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scheme</div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: formData.scheme ? '#315B78' : '#999', wordBreak: 'break-word', lineHeight: '1.5' }}>
                            {formData.scheme || 'Not selected'}
                          </div>
                        </div>
                      </div>

                      {/* Location Section */}
                      <div className="space-y-3 pt-3 border-t" style={{ borderColor: '#E5EBEF' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-4 rounded-full" style={{ backgroundColor: '#027F83' }}></div>
                          <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Location Details
                          </h4>
                        </div>

                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>State & District</div>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: formData.state ? '#003A5D' : '#999', marginBottom: '2px' }}>
                            {formData.state || 'Not selected'}
                          </div>
                          {formData.state && formData.district && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                              {formData.district}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Warehouse className="w-3 h-3" style={{ color: '#027F83' }} />
                              <div style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Center</div>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: formData.center ? '#003A5D' : '#999' }}>
                              {formData.center || '—'}
                            </div>
                          </div>

                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <Warehouse className="w-3 h-3" style={{ color: '#027F83' }} />
                              <div style={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Warehouse</div>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: '700', color: formData.warehouse ? '#003A5D' : '#999' }}>
                              {formData.warehouse || '—'}
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                            <div style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>WHR Date</div>
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '700', color: formData.whrDate ? '#003A5D' : '#999' }}>
                            {formData.whrDate ? new Date(formData.whrDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not selected'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats - Only show when dispatch data is available */}
                    {formData.center && formData.warehouse && dispatchData.length > 0 && (
                      <>
                        <div className="px-6 pt-4 pb-4 border-t" style={{ borderColor: '#E5EBEF', backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
                              <TrendingUp className="w-4 h-4" style={{ color: '#027F83' }} />
                            </div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D' }}>
                              Quick Stats
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF' }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dispatches</span>
                              </div>
                              <div style={{ fontSize: '20px', fontWeight: '700', color: '#027F83' }}>{dispatchData.length}</div>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF' }}>
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</span>
                              </div>
                              <div style={{ fontSize: '20px', fontWeight: '700', color: '#027F83' }}>
                                {dispatchData.reduce((sum, d) => sum + d.actualDispatchQty, 0)}
                              </div>
                              <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>QTL</div>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF' }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bags</span>
                              </div>
                              <div style={{ fontSize: '20px', fontWeight: '700', color: '#027F83' }}>
                                {dispatchData.reduce((sum, d) => sum + d.actualDispatchBags, 0)}
                              </div>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF' }}>
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-3.5 h-3.5" style={{ color: '#027F83' }} />
                                <span style={{ fontSize: '10px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lots</span>
                              </div>
                              <div style={{ fontSize: '20px', fontWeight: '700', color: '#027F83' }}>
                                {dispatchData.reduce((sum, d) => sum + d.lots.length, 0)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dispatch Preview - Compact List */}
                        <div className="px-6 pt-4 pb-6" style={{ backgroundColor: '#F7F9FA' }}>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
                              <Eye className="w-4 h-4" style={{ color: '#027F83' }} />
                            </div>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#003A5D' }}>
                              Dispatch Preview
                            </h4>
                          </div>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {dispatchData.slice(0, 3).map((dispatch) => (
                              <div
                                key={dispatch.id}
                                className="p-3 rounded-lg border transition-all hover:shadow-sm"
                                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#027F83' }}></div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#315B78' }}>
                                      {dispatch.dispatchId}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#027F83' }}>
                                    {dispatch.actualDispatchQty} QTL
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs" style={{ color: '#666' }}>
                                  <Calendar className="w-3 h-3" />
                                  <span>{dispatch.dispatchDate}</span>
                                  <span style={{ margin: '0 4px' }}>•</span>
                                  <span>{dispatch.actualDispatchBags} Bags</span>
                                </div>
                              </div>
                            ))}
                            {dispatchData.length > 3 && (
                              <div className="p-3 rounded-lg text-center" style={{ backgroundColor: '#FFFFFF', border: '1px dashed #E5EBEF' }}>
                                <span style={{ fontSize: '12px', color: '#999', fontWeight: '600' }}>
                                  +{dispatchData.length - 3} more dispatch(es)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Create Button - Sticky at bottom */}
                        <div className="px-6 pb-6">
                          <button
                            onClick={handleCreateWHR}
                            className="w-full flex items-center justify-center gap-2 px-6 h-12 rounded-lg transition-all shadow-md hover:shadow-lg"
                            style={{
                              backgroundColor: '#027F83',
                              color: '#FFFFFF',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#026A6E';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#027F83';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <Check className="w-5 h-5" />
                            Create WHR
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW WHR SCREEN */}
      {currentView === 'view' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF', maxHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
          {/* Header with Back Button */}
          <div className="px-6 py-4 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('info')}
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
                style={{ color: '#027F83' }}
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
                  View WHR Records
                </h2>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  Search, filter, and manage all Warehouse Receipt records
                </p>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="px-6 py-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0" style={{ borderColor: '#E5EBEF' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E6F7F7' }}>
                <FileText className="w-5 h-5" style={{ color: '#027F83' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#777777' }}>
                  WHR Records
                </h2>
                <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                  {filteredWHRRecords.length} of {whrRecords.length} records
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
                  placeholder="Try: 'approved WHR', 'Karnataka', 'WHR2025001'..."
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
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full">
              <thead style={{ backgroundColor: '#F7F9FA' }}>
                <tr>
                  <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    WHR Details
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Scheme & Commodity
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Location
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Variance
                  </th>
                  <th className="px-6 py-4 text-left" style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    WHR Value
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
                {filteredWHRRecords.length > 0 ? (
                  filteredWHRRecords.slice(0, whrRecordsLimit).map((record) => (
                    <tr key={record.id} className="border-t transition-colors hover:bg-gray-50" style={{ borderColor: '#E5EBEF' }}>
                      {/* WHR Details */}
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#315B78', marginBottom: '4px' }}>
                          {record.whrNumber}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {record.whrDate}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                          {record.whrType} • {record.lotCount} Lots
                        </div>
                      </td>

                      {/* Scheme & Commodity */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4" style={{ color: '#027F83' }} />
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#315B78' }}>
                            {record.commodity}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          {record.scheme}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#315B78', marginBottom: '2px' }}>
                          {record.warehouse}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {record.district}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {record.center}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#027F83', marginBottom: '2px' }}>
                          {record.acceptedQuantity} QTL
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {record.acceptedBags} Bags
                        </div>
                      </td>

                      {/* Variance */}
                      <td className="px-6 py-4">
                        {record.quantityGain > 0 && (
                          <div className="flex items-center gap-1 mb-1" style={{ fontSize: '12px', fontWeight: '600', color: '#00A67E' }}>
                            <TrendingUp className="w-3.5 h-3.5" />
                            +{record.quantityGain} QTL
                          </div>
                        )}
                        {record.quantityLoss > 0 && (
                          <div className="flex items-center gap-1" style={{ fontSize: '12px', fontWeight: '600', color: '#E94545' }}>
                            <TrendingDown className="w-3.5 h-3.5" />
                            -{record.quantityLoss} QTL
                          </div>
                        )}
                        {record.quantityGain === 0 && record.quantityLoss === 0 && (
                          <div style={{ fontSize: '12px', color: '#999' }}>No variance</div>
                        )}
                      </td>

                      {/* WHR Value */}
                      <td className="px-6 py-4">
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#315B78' }}>
                          ₹{record.whrValue.toLocaleString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStatusBadge(record.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" style={{ color: '#027F83' }} />
                          </button>
                          <button
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" style={{ color: '#027F83' }} />
                          </button>
                          <button
                            className="p-2 rounded-lg transition-all hover:bg-gray-100"
                            title="Upload Receipt"
                          >
                            <Upload className="w-4 h-4" style={{ color: '#027F83' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center" style={{ color: '#315B78' }}>
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FA' }}>
                        <FileText className="w-8 h-8" style={{ color: '#E5EBEF' }} />
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                        No WHR Records Found
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666' }}>
                        {searchQuery || activeFilterCount > 0 ? 'Try adjusting your search or filters' : 'Create your first warehouse receipt using the Create WHR section'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Load More Button for WHR Records */}
          {filteredWHRRecords.length > whrRecordsLimit && (
            <div className="px-6 py-4 border-t flex justify-center flex-shrink-0" style={{ borderColor: '#E5EBEF' }}>
              <button
                onClick={loadMoreWHRRecords}
                className="px-6 py-2 rounded-lg transition-all"
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
                Load More ({filteredWHRRecords.length - whrRecordsLimit} more)
              </button>
            </div>
          )}
        </div>
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
                  Filter WHR Records
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
                      { value: 'Approved', label: 'Approved' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Rejected', label: 'Rejected' }
                    ]}
                    isOpen={statusFilterDropdownOpen}
                    onToggle={() => setStatusFilterDropdownOpen(!statusFilterDropdownOpen)}
                    dropdownRef={statusFilterRef}
                  />
                </div>

                {/* Commodity Filter */}
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
                      { value: 'Maize', label: 'Maize' }
                    ]}
                    isOpen={filterCommodityDropdownOpen}
                    onToggle={() => setFilterCommodityDropdownOpen(!filterCommodityDropdownOpen)}
                    dropdownRef={filterCommodityRef}
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
                      { value: 'Karnataka', label: 'Karnataka' },
                      { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                      { value: 'Maharashtra', label: 'Maharashtra' }
                    ]}
                    isOpen={filterStateDropdownOpen}
                    onToggle={() => setFilterStateDropdownOpen(!filterStateDropdownOpen)}
                    dropdownRef={filterStateRef}
                  />
                </div>

                {/* Date Range */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: '#777777', marginBottom: '8px', display: 'block' }}>
                    WHR Date Range
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

              {/* Filter Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 h-12 rounded-lg transition-all"
                  style={{
                    backgroundColor: '#F7F9FA',
                    border: '1px solid #CCD8DF',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5EBEF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                  }}
                >
                  Clear All
                </button>
                
                <button
                  onClick={() => {
                    setFilterDrawerOpen(false);
                  }}
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
        </>
      )}
    </div>
  );
}
