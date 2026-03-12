import { useState, useRef, useEffect } from 'react';
import {
  Home, ChevronRight, User, Phone, Mail, MapPin, Camera, Shield,
  Smartphone, FileText, CheckCircle2, X, ChevronLeft, ChevronDown,
  Upload, Eye, EyeOff, Calendar, Building2, CreditCard, Package,
  LandPlot, Scan, Loader2, AlertCircle, Info, Mic, Volume2
} from 'lucide-react';
import CustomDropdown from '@/app/components/CustomDropdown';
import FarmerDetailsView from '@/app/components/FarmerDetailsView';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface FarmerFormData {
  // Aadhaar & Authentication
  aadhaarNumber: string;
  authenticationMethod: 'face' | 'fingerprint' | 'offline';
  consentGiven: boolean;
  
  // Personal Details (from Aadhaar)
  farmerName: string;
  dateOfBirth: string;
  gender: string;
  fatherName: string;
  address: string;
  pincode: string;
  mobileNumber: string;
  emailId: string;
  
  // Agristack/Portal Details
  agristackFarmerId: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  farmerCategory: string;
  classCategory: string;
  otherBackwardClasses: string;
  
  // Land Details
  surveyNumber: string;
  khataNumber: string;
  khataDescription: string;
  totalAreaAcre: string;
  totalAreaHa: string;
  actualSowingAreaHa: string;
  convertedSowingAreaAcre: string;
  landType: string;
  center: string;
  landOwnerName: string;
  
  // Bank Details
  accountHolderName: string;
  ifscCode: string;
  bankName: string;
  bankAccountNumber: string;
  confirmBankAccountNumber: string;
  
  // Scheme Participation
  selectedScheme: string;
  supportingDocument: File | null;
}

export default function FarmerRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState<FarmerFormData>({
    aadhaarNumber: '',
    authenticationMethod: 'face',
    consentGiven: false,
    farmerName: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    address: '',
    pincode: '',
    mobileNumber: '',
    emailId: '',
    agristackFarmerId: '',
    state: '',
    district: '',
    taluka: '',
    village: '',
    farmerCategory: '',
    classCategory: '',
    otherBackwardClasses: '',
    surveyNumber: '',
    khataNumber: '',
    khataDescription: '',
    totalAreaAcre: '',
    totalAreaHa: '',
    actualSowingAreaHa: '',
    convertedSowingAreaAcre: '',
    landType: '',
    center: '',
    landOwnerName: '',
    accountHolderName: '',
    ifscCode: '',
    bankName: '',
    bankAccountNumber: '',
    confirmBankAccountNumber: '',
    selectedScheme: '',
    supportingDocument: null
  });

  // UI State
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrProgress, setOcrProgress] = useState('');
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [showDetailsConfirmation, setShowDetailsConfirmation] = useState(false);
  const [capturedFaceImage, setCapturedFaceImage] = useState<string | null>(null);
  const [faceVerificationStatus, setFaceVerificationStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [pendingAadhaarData, setPendingAadhaarData] = useState<any>(null);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [consentAudioPlaying, setConsentAudioPlaying] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [smartLocationData, setSmartLocationData] = useState<any>(null);
  // Offline Aadhaar Verification states
  const [offlineVerificationStatus, setOfflineVerificationStatus] = useState<'idle' | 'otp-sent' | 'otp-verified' | 'ocr-processing' | 'liveness-checking' | 'face-verifying' | 'completed' | 'failed'>('idle');
  const [showOfflineOtpModal, setShowOfflineOtpModal] = useState(false);
  const [offlineOtp, setOfflineOtp] = useState(['', '', '', '', '', '']);
  const [offlineOtpRefs, setOfflineOtpRefs] = useState<(HTMLInputElement | null)[]>([]);
  const [offlineProgressMessage, setOfflineProgressMessage] = useState('');
  const [showDetailsView, setShowDetailsView] = useState(false);

  // Dropdown states
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [talukaDropdownOpen, setTalukaDropdownOpen] = useState(false);
  const [villageDropdownOpen, setVillageDropdownOpen] = useState(false);
  const [farmerCategoryDropdownOpen, setFarmerCategoryDropdownOpen] = useState(false);
  const [classCategoryDropdownOpen, setClassCategoryDropdownOpen] = useState(false);
  const [landTypeDropdownOpen, setLandTypeDropdownOpen] = useState(false);
  const [centerDropdownOpen, setCenterDropdownOpen] = useState(false);
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  // Land location dropdowns
  const [landStateDropdownOpen, setLandStateDropdownOpen] = useState(false);
  const [landDistrictDropdownOpen, setLandDistrictDropdownOpen] = useState(false);
  const [landTalukaDropdownOpen, setLandTalukaDropdownOpen] = useState(false);
  const [landVillageDropdownOpen, setLandVillageDropdownOpen] = useState(false);

  // Refs
  const stateRef = useRef<HTMLDivElement | null>(null);
  const districtRef = useRef<HTMLDivElement | null>(null);
  const talukaRef = useRef<HTMLDivElement | null>(null);
  const villageRef = useRef<HTMLDivElement | null>(null);
  const farmerCategoryRef = useRef<HTMLDivElement | null>(null);
  const classCategoryRef = useRef<HTMLDivElement | null>(null);
  const landTypeRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const schemeRef = useRef<HTMLDivElement | null>(null);
  const landStateRef = useRef<HTMLDivElement | null>(null);
  const landDistrictRef = useRef<HTMLDivElement | null>(null);
  const landTalukaRef = useRef<HTMLDivElement | null>(null);
  const landVillageRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const offlineAadhaarFileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const states = [
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Rajasthan', label: 'Rajasthan' }
  ];

  const districts = formData.state ? [
    { value: 'Buldhana', label: 'Buldhana' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Mumbai', label: 'Mumbai' }
  ] : [];

  const farmerCategories = [
    { value: 'Small Farmer', label: 'Small Farmer' },
    { value: 'Marginal Farmer', label: 'Marginal Farmer' },
    { value: 'Large Farmer', label: 'Large Farmer' }
  ];

  const classCategories = [
    { value: 'General', label: 'General' },
    { value: 'OBC', label: 'Other Backward Classes (OBC)' },
    { value: 'SC', label: 'Scheduled Caste (SC)' },
    { value: 'ST', label: 'Scheduled Tribe (ST)' },
    { value: 'EWS', label: 'Economically Weaker Section (EWS)' }
  ];

  const schemes = [
    { value: 'PSS BLACK GRAM URAD PROCUREMENT KHARIF 2025', label: 'PSS BLACK GRAM URAD PROCUREMENT KHARIF 2025' },
    { value: 'PSS SOYABEAN PROCUREMENT KHARIF 2025', label: 'PSS SOYABEAN PROCUREMENT KHARIF 2025' },
    { value: 'PSS GREEN GRAM MOONG PROCUREMENT KHARIF 2025', label: 'PSS GREEN GRAM MOONG PROCUREMENT KHARIF 2025' }
  ];

  const landTypes = [
    { value: 'Owned', label: 'Owned' },
    { value: 'Leased', label: 'Leased' },
    { value: 'Other', label: 'Other' }
  ];

  const centers = [
    { value: 'Center 1', label: 'Center 1' },
    { value: 'Center 2', label: 'Center 2' },
    { value: 'Center 3', label: 'Center 3' },
    { value: 'Center 4', label: 'Center 4' }
  ];

  // OCR Service - Simulated AI/OCR processing
  const processOCR = async (file: File, documentType: 'aadhaar' | 'bank' | 'land'): Promise<any> => {
    setIsProcessingOCR(true);
    setOcrProgress('Scanning document...');

    // Simulate OCR processing
    return new Promise((resolve) => {
      setTimeout(() => {
        setOcrProgress('Extracting data...');
        setTimeout(() => {
          let extractedData: any = {};

          if (documentType === 'aadhaar') {
            extractedData = {
              farmerName: 'Farmer One',
              dateOfBirth: '1990-05-15',
              gender: 'Male',
              fatherName: 'Father One',
              address: 'Village: Sample Village, Taluka: Sample Taluka, District: Sample District, State: Maharashtra',
              pincode: '443001',
              aadhaarNumber: formData.aadhaarNumber || '9000 0000 0001'
            };
          } else if (documentType === 'bank') {
            extractedData = {
              accountHolderName: 'FARMER ONE',
              ifscCode: 'BANK0000001',
              bankName: 'SAMPLE BANK OF INDIA',
              bankAccountNumber: '900000000001'
            };
          } else if (documentType === 'land') {
            extractedData = {
              surveyNumber: '123/45',
              khataNumber: '73',
              khataDescription: 'व्यक्तिगत खातेदार',
              totalAreaAcre: '2.471',
              totalAreaHa: '1.0',
              landOwnerName: 'Farmer One'
            };
          }

          setOcrProgress('Data extracted successfully!');
          setIsProcessingOCR(false);
          resolve(extractedData);
        }, 2000);
      }, 1000);
    });
  };

  // Face Verification with Liveness Detection
  const performFaceVerification = async () => {
    setShowFaceCapture(true);
    setFaceVerificationStatus('processing');
  };

  // Capture face image
  const captureFace = () => {
    // Simulate face capture - in real implementation, this would capture from camera
    const mockImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
    setCapturedFaceImage(mockImage);
    setShowFaceCapture(false);
    
    // Simulate processing
    setTimeout(() => {
      setFaceVerificationStatus('success');
      
      // Prepare Aadhaar data for confirmation
      const aadhaarData = {
              farmerName: 'Farmer One',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
              fatherName: 'Father One',
        address: 'Village: Sample Village, Taluka: Sample Taluka, District: Sample District, State: Maharashtra',
        pincode: '443001',
        aadhaarNumber: formData.aadhaarNumber
      };
      
      setPendingAadhaarData(aadhaarData);
      setShowDetailsConfirmation(true);
    }, 2000);
  };

  // Confirm and populate details
  const confirmAadhaarDetails = () => {
    if (pendingAadhaarData) {
      setFormData(prev => ({
        ...prev,
        ...pendingAadhaarData
      }));
      setAadhaarVerified(true);
      setShowDetailsConfirmation(false);
      setPendingAadhaarData(null);
    }
  };

  // Cancel face verification
  const cancelFaceVerification = () => {
    setShowFaceCapture(false);
    setShowDetailsConfirmation(false);
    setFaceVerificationStatus('idle');
    setCapturedFaceImage(null);
    setPendingAadhaarData(null);
  };

  // Handle Offline Aadhaar Verification
  const handleOfflineAadhaarVerification = async (file: File) => {
    // Step 1: Send OTP
    setOfflineVerificationStatus('otp-sent');
    setOfflineProgressMessage('Sending OTP to registered mobile number...');
    setShowOfflineOtpModal(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setOfflineProgressMessage('OTP sent to your registered mobile number');
    }, 1000);
  };

  // Verify OTP for offline verification
  const verifyOfflineOtp = () => {
    const otpString = offlineOtp.join('');
    if (otpString.length === 6) {
      // Simulate OTP verification
      setOfflineVerificationStatus('otp-verified');
      setOfflineProgressMessage('OTP verified successfully');
      setShowOfflineOtpModal(false);
      
      // Step 2: Process OCR
      setTimeout(() => {
        processOfflineAadhaarOCR();
      }, 1000);
    }
  };

  // Process OCR for offline verification
  const processOfflineAadhaarOCR = async () => {
    setOfflineVerificationStatus('ocr-processing');
    setOfflineProgressMessage('Extracting details from Aadhaar document...');
    
    // Simulate OCR processing
    setTimeout(() => {
      setOfflineProgressMessage('Aadhaar details extracted successfully');
      
      // Step 3: Liveness Check
      setTimeout(() => {
        performOfflineLivenessCheck();
      }, 1000);
    }, 2000);
  };

  // Perform Liveness Check
  const performOfflineLivenessCheck = () => {
    setOfflineVerificationStatus('liveness-checking');
    setOfflineProgressMessage('Please look at the camera for liveness detection...');
    setShowFaceCapture(true);
    
    // Simulate liveness check
    setTimeout(() => {
      setOfflineProgressMessage('Liveness check passed');
      
      // Step 4: Face Verification
      setTimeout(() => {
        performOfflineFaceVerification();
      }, 1000);
    }, 2000);
  };

  // Perform Face Verification for offline
  const performOfflineFaceVerification = () => {
    setOfflineVerificationStatus('face-verifying');
    setOfflineProgressMessage('Verifying face match with Aadhaar photo...');
    
    // Simulate face verification
    setTimeout(() => {
      const mockImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      setCapturedFaceImage(mockImage);
      
      setTimeout(() => {
        setOfflineProgressMessage('Face verified successfully');
        
        // Step 5: Complete verification and populate data
        setTimeout(() => {
          completeOfflineVerification();
        }, 1000);
      }, 2000);
    }, 2000);
  };

  // Complete offline verification
  const completeOfflineVerification = () => {
    setOfflineVerificationStatus('completed');
    setOfflineProgressMessage('All verifications completed successfully');
    setShowFaceCapture(false);
    
    // Extract and populate Aadhaar data
    const aadhaarData = {
      farmerName: 'Farmer One',
      dateOfBirth: '1990-05-15',
      gender: 'Male',
      fatherName: 'Father One',
      address: 'Village: Sample Village, Taluka: Sample Taluka, District: Sample District, State: Maharashtra',
      pincode: '443001',
      aadhaarNumber: formData.aadhaarNumber
    };
    
    setPendingAadhaarData(aadhaarData);
    setShowDetailsConfirmation(true);
  };

  // Initialize offline OTP refs
  useEffect(() => {
    if (showOfflineOtpModal) {
      const refs: (HTMLInputElement | null)[] = [];
      for (let i = 0; i < 6; i++) {
        refs.push(null);
      }
      setOfflineOtpRefs(refs);
    }
  }, [showOfflineOtpModal]);

  const handleOfflineOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...offlineOtp];
    newOtp[index] = value;
    setOfflineOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      offlineOtpRefs[index + 1]?.focus();
    }
    
    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      setTimeout(() => verifyOfflineOtp(), 500);
    }
  };

  const handleOfflineOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !offlineOtp[index] && index > 0) {
      offlineOtpRefs[index - 1]?.focus();
    }
  };

  // Handle Aadhaar scan
  const handleAadhaarScan = async (file: File) => {
    const extractedData = await processOCR(file, 'aadhaar');
    setFormData(prev => ({
      ...prev,
      ...extractedData,
      aadhaarNumber: extractedData.aadhaarNumber || prev.aadhaarNumber
    }));
  };

  // Handle Bank Document scan
  const handleBankDocumentScan = async (file: File) => {
    const extractedData = await processOCR(file, 'bank');
    setFormData(prev => ({
      ...prev,
      accountHolderName: extractedData.accountHolderName || prev.accountHolderName,
      ifscCode: extractedData.ifscCode || prev.ifscCode,
      bankName: extractedData.bankName || prev.bankName,
      bankAccountNumber: extractedData.bankAccountNumber || prev.bankAccountNumber,
      confirmBankAccountNumber: extractedData.bankAccountNumber || prev.confirmBankAccountNumber
    }));
  };

  // Handle Land Document scan
  const handleLandDocumentScan = async (file: File) => {
    const extractedData = await processOCR(file, 'land');
    setFormData(prev => ({
      ...prev,
      surveyNumber: extractedData.surveyNumber || prev.surveyNumber,
      khataNumber: extractedData.khataNumber || prev.khataNumber,
      khataDescription: extractedData.khataDescription || prev.khataDescription,
      totalAreaAcre: extractedData.totalAreaAcre || prev.totalAreaAcre,
      totalAreaHa: extractedData.totalAreaHa || prev.totalAreaHa,
      landOwnerName: extractedData.landOwnerName || prev.landOwnerName
    }));
  };

  // Calculate converted area
  useEffect(() => {
    if (formData.actualSowingAreaHa) {
      const acre = parseFloat(formData.actualSowingAreaHa) * 2.471;
      setFormData(prev => ({
        ...prev,
        convertedSowingAreaAcre: acre.toFixed(3)
      }));
    }
  }, [formData.actualSowingAreaHa]);

  // AI-Powered Pincode to Location Auto-fill
  useEffect(() => {
    if (formData.pincode.length === 6) {
      setIsAiProcessing(true);
      // Simulate AI-powered location lookup
      setTimeout(() => {
        const locationMap: any = {
          '443001': { state: 'Maharashtra', district: 'Buldhana', taluka: 'Sangrampur', village: 'Sangrampur' },
          '560001': { state: 'Karnataka', district: 'Bangalore', taluka: 'Bangalore', village: 'Bangalore' },
          '380001': { state: 'Gujarat', district: 'Ahmedabad', taluka: 'Ahmedabad', village: 'Ahmedabad' }
        };
        
        const location = locationMap[formData.pincode];
        if (location) {
          setSmartLocationData(location);
          setAiSuggestions([`📍 Auto-detected: ${location.village}, ${location.district}, ${location.state}`]);
        } else {
          setAiSuggestions(['💡 Enter pincode to auto-fill location details']);
        }
        setIsAiProcessing(false);
      }, 800);
    } else {
      setSmartLocationData(null);
      setAiSuggestions([]);
    }
  }, [formData.pincode]);

  // Apply smart location data
  const applySmartLocation = () => {
    if (smartLocationData) {
      setFormData(prev => ({
        ...prev,
        state: smartLocationData.state,
        district: smartLocationData.district,
        taluka: smartLocationData.taluka,
        village: smartLocationData.village
      }));
      setAiSuggestions([]);
    }
  };

  // Voice search handler
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
      // Handle voice input based on current step
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

  // Play consent audio
  const playConsentAudio = () => {
    setConsentAudioPlaying(true);
    // In real implementation, use Web Speech API or TTS
    const utterance = new SpeechSynthesisUtterance(
      "I hereby consent to ProcureX using my Aadhaar data for the procurement of my commodity as per my understanding and the terms outlined in this form. I understand that my data will be used solely for this purpose and the agency will ensure its security and confidentiality."
    );
    utterance.onend = () => setConsentAudioPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.consentGiven) {
      alert('Please provide consent for authentication');
      return;
    }

    // Submit registration
    console.log('Farmer Registration Data:', formData);
    // Show details view after successful registration
    setShowDetailsView(true);
  };

  // Step validation
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.aadhaarNumber.length === 12 && aadhaarVerified && formData.consentGiven;
      case 2:
        return formData.farmerName && formData.dateOfBirth && formData.gender && formData.fatherName && formData.address && formData.pincode;
      case 3:
        return formData.state && formData.district && formData.taluka && formData.village && formData.farmerCategory && formData.classCategory && formData.fatherName;
      case 4:
        return formData.state && formData.district && formData.taluka && formData.village && formData.surveyNumber && formData.khataNumber && formData.totalAreaAcre && formData.landType && formData.center;
      case 5:
        return formData.accountHolderName && formData.ifscCode && formData.bankAccountNumber && formData.bankAccountNumber === formData.confirmBankAccountNumber;
      case 6:
        return formData.selectedScheme && formData.supportingDocument;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (canProceedToNextStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render Step 1: Aadhaar Authentication
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
          Aadhaar Authentication
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Verify your identity using Aadhaar
        </p>
      </div>

      {/* Authentication Method */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
          Authentication Method <span style={{ color: '#E94545' }}>*</span>
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, authenticationMethod: 'face' }))}
            className="flex-1 p-4 rounded-lg border-2 transition-all"
            style={{
              borderColor: formData.authenticationMethod === 'face' ? '#027F83' : '#E5EBEF',
              backgroundColor: formData.authenticationMethod === 'face' ? '#E6F7F7' : '#FFFFFF'
            }}
          >
            <User className="w-6 h-6 mx-auto mb-2" style={{ color: formData.authenticationMethod === 'face' ? '#027F83' : '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: formData.authenticationMethod === 'face' ? '#027F83' : '#666' }}>
              Face Authentication
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, authenticationMethod: 'fingerprint' }))}
            className="flex-1 p-4 rounded-lg border-2 transition-all"
            style={{
              borderColor: formData.authenticationMethod === 'fingerprint' ? '#027F83' : '#E5EBEF',
              backgroundColor: formData.authenticationMethod === 'fingerprint' ? '#E6F7F7' : '#FFFFFF'
            }}
          >
            <Shield className="w-6 h-6 mx-auto mb-2" style={{ color: formData.authenticationMethod === 'fingerprint' ? '#027F83' : '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: formData.authenticationMethod === 'fingerprint' ? '#027F83' : '#666' }}>
              Fingerprint Authentication
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, authenticationMethod: 'offline' }))}
            className="flex-1 p-4 rounded-lg border-2 transition-all"
            style={{
              borderColor: formData.authenticationMethod === 'offline' ? '#027F83' : '#E5EBEF',
              backgroundColor: formData.authenticationMethod === 'offline' ? '#E6F7F7' : '#FFFFFF'
            }}
          >
            <FileText className="w-6 h-6 mx-auto mb-2" style={{ color: formData.authenticationMethod === 'offline' ? '#027F83' : '#666' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: formData.authenticationMethod === 'offline' ? '#027F83' : '#666' }}>
              Offline Aadhaar Verification
            </span>
          </button>
        </div>
      </div>

      {/* Aadhaar Number */}
      <div>
        <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
          Aadhaar Number <span style={{ color: '#E94545' }}>*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            maxLength={12}
            value={formData.aadhaarNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData(prev => ({ ...prev, aadhaarNumber: value }));
            }}
            placeholder="Enter 12-digit Aadhaar Number"
            className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
            style={{
              borderColor: aadhaarVerified ? '#10B981' : '#CCD8DF',
              color: '#222222',
              fontSize: '14px',
              backgroundColor: '#FFFFFF'
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all"
            style={{ backgroundColor: '#F2FCFB' }}
            title="Scan Aadhaar Card"
          >
            <Scan className="w-5 h-5" style={{ color: '#027F83' }} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAadhaarScan(file);
            }}
          />
        </div>
        {aadhaarVerified && (
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
            <span style={{ fontSize: '12px', color: '#10B981' }}>Aadhaar verified successfully</span>
          </div>
        )}
      </div>

      {/* Face Verification */}
      {formData.authenticationMethod === 'face' && formData.aadhaarNumber.length === 12 && !aadhaarVerified && (
        <div>
          <button
            type="button"
            onClick={performFaceVerification}
            disabled={faceVerificationStatus === 'processing'}
            className="w-full h-12 rounded-lg transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: faceVerificationStatus === 'processing' ? '#CCD8DF' : '#027F83',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: faceVerificationStatus === 'processing' ? 'not-allowed' : 'pointer'
            }}
          >
            {faceVerificationStatus === 'processing' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Start Face Verification
              </>
            )}
          </button>
        </div>
      )}

      {/* Offline Aadhaar Verification */}
      {formData.authenticationMethod === 'offline' && formData.aadhaarNumber.length === 12 && !aadhaarVerified && (
        <div className="space-y-4">
          {/* Upload Aadhaar Document */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Upload Aadhaar Document <span style={{ color: '#E94545' }}>*</span>
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#CCD8DF', backgroundColor: '#F7F9FA' }}>
              <input
                ref={offlineAadhaarFileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleOfflineAadhaarVerification(file);
                }}
              />
              <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#027F83' }} />
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                Upload Aadhaar card image or PDF
              </p>
              <button
                type="button"
                onClick={() => offlineAadhaarFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                style={{ backgroundColor: '#027F83', color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}
              >
                <Upload className="w-4 h-4" />
                Choose File
              </button>
            </div>
          </div>

          {/* Progress Status */}
          {offlineVerificationStatus !== 'idle' && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F7F7', border: '1px solid #027F83' }}>
              <div className="flex items-center gap-3 mb-2">
                {offlineVerificationStatus === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                ) : offlineVerificationStatus === 'failed' ? (
                  <AlertCircle className="w-5 h-5" style={{ color: '#E94545' }} />
                ) : (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#027F83' }} />
                )}
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
                  {offlineVerificationStatus === 'otp-sent' ? 'OTP Sent' :
                   offlineVerificationStatus === 'otp-verified' ? 'OTP Verified' :
                   offlineVerificationStatus === 'ocr-processing' ? 'Extracting Aadhaar Details' :
                   offlineVerificationStatus === 'liveness-checking' ? 'Checking Liveness' :
                   offlineVerificationStatus === 'face-verifying' ? 'Verifying Face' :
                   offlineVerificationStatus === 'completed' ? 'Verification Completed' :
                   offlineVerificationStatus === 'failed' ? 'Verification Failed' : 'Processing...'}
                </span>
              </div>
              {offlineProgressMessage && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {offlineProgressMessage}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {aadhaarVerified && (
        <div className="p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#E6F7F7', border: '1px solid #10B981' }}>
          <CheckCircle2 className="w-6 h-6" style={{ color: '#10B981' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
              {formData.authenticationMethod === 'offline' ? 'Offline Aadhaar Verified Successfully' : 'Face Verified Successfully'}
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>Aadhaar details have been verified and confirmed</p>
          </div>
        </div>
      )}

      {/* Consent for Authentication */}
      <div className="p-5 rounded-xl border-2" style={{ borderColor: '#027F83', backgroundColor: '#E6F7F7' }}>
        <div className="flex items-start gap-3 mb-4">
          <input
            type="checkbox"
            id="consent"
            checked={formData.consentGiven}
            onChange={(e) => setFormData(prev => ({ ...prev, consentGiven: e.target.checked }))}
            className="mt-1 w-5 h-5 rounded border-2"
            style={{ borderColor: '#027F83', accentColor: '#027F83' }}
          />
          <div className="flex-1">
            <label htmlFor="consent" style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D', cursor: 'pointer' }}>
              Consent for Authentication
            </label>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px', lineHeight: '1.5' }}>
              I hereby consent to ProcureX using my Aadhaar data for the procurement of my commodity as per my understanding and the terms outlined in this form. I understand that my data will be used solely for this purpose and the agency will ensure its security and confidentiality.
            </p>
            <p style={{ fontSize: '12px', color: '#027F83', marginTop: '8px', fontWeight: '600' }}>
              Your profile details (Name, DOB, Gender, Father Name and Address etc) will be updated as per the Aadhaar.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={playConsentAudio}
            disabled={consentAudioPlaying}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: consentAudioPlaying ? '#CCD8DF' : '#FFFFFF',
              color: '#027F83',
              fontSize: '12px',
              fontWeight: '600',
              border: '1px solid #027F83'
            }}
          >
            <Volume2 className="w-4 h-4" />
            Listen
          </button>
        </div>
      </div>
    </div>
  );

  // Render Step 2: Personal Details (Auto-filled from Aadhaar)
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
          Details As Per Aadhaar
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Verify and update your personal information
        </p>
      </div>

      {/* Profile Picture Placeholder */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center border-4" style={{ borderColor: '#027F83', backgroundColor: '#E6F7F7' }}>
          <User className="w-12 h-12" style={{ color: '#027F83' }} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Farmer Name as per Aadhaar Card <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.farmerName}
              onChange={(e) => setFormData(prev => ({ ...prev, farmerName: e.target.value }))}
              maxLength={100}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter farmer name"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Aadhaar Number <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.aadhaarNumber}
              readOnly
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#666', fontSize: '14px', backgroundColor: '#F7F9FA' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Date of Birth <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Gender <span style={{ color: '#E94545' }}>*</span>
            </label>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Pincode <span style={{ color: '#E94545' }}>*</span>
              {isAiProcessing && (
                <span className="ml-2 inline-flex items-center gap-1" style={{ fontSize: '10px', color: '#027F83' }}>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  AI detecting location...
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, pincode: value }));
                }}
                className="w-full h-12 px-4 pr-12 rounded-lg border transition-all outline-none"
                style={{ 
                  borderColor: smartLocationData ? '#10B981' : '#CCD8DF', 
                  color: '#222222', 
                  fontSize: '14px', 
                  backgroundColor: '#FFFFFF' 
                }}
                placeholder="Enter pincode"
              />
              {smartLocationData && (
                <button
                  type="button"
                  onClick={applySmartLocation}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs font-medium transition-all"
                  style={{ backgroundColor: '#E6F7F7', color: '#027F83' }}
                  title="Click to auto-fill location"
                >
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Apply
                </button>
              )}
            </div>
            {aiSuggestions.length > 0 && (
              <div className="mt-2 p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7', border: '1px solid #027F83' }}>
                {aiSuggestions.map((suggestion, idx) => (
                  <p key={idx} style={{ fontSize: '12px', color: '#027F83', marginBottom: '4px' }}>
                    {suggestion}
                  </p>
                ))}
                {smartLocationData && (
                  <button
                    type="button"
                    onClick={applySmartLocation}
                    className="mt-2 text-xs font-medium underline"
                    style={{ color: '#027F83' }}
                  >
                    Click here to auto-fill State, District, Taluka & Village
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-3">
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Address <span style={{ color: '#E94545' }}>*</span>
              <span className="ml-2 text-xs font-normal" style={{ color: '#666' }}>
                💡 AI can auto-generate from location details
              </span>
            </label>
            <div className="relative">
              <textarea
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
                maxLength={200}
                className="w-full px-4 py-3 pr-20 rounded-lg border transition-all outline-none resize-none"
                style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF', minHeight: '60px' }}
                placeholder="Enter complete address"
              />
              {formData.state && formData.district && formData.taluka && formData.village && !formData.address && (
                <button
                  type="button"
                  onClick={() => {
                    const autoAddress = `Village: ${formData.village}, Taluka: ${formData.taluka}, District: ${formData.district}, State: ${formData.state}`;
                    setFormData(prev => ({ ...prev, address: autoAddress }));
                  }}
                  className="absolute right-2 top-2 px-2 py-1 rounded text-xs font-medium transition-all"
                  style={{ backgroundColor: '#E6F7F7', color: '#027F83', border: '1px solid #027F83' }}
                  title="AI: Auto-generate address"
                >
                  ✨ AI Fill
                </button>
              )}
            </div>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              {formData.address.length}/200 characters
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Mobile Number <span style={{ color: '#E94545' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                maxLength={10}
                value={formData.mobileNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, mobileNumber: value }));
                }}
                className="w-full h-12 pl-14 pr-12 rounded-lg border transition-all outline-none"
                style={{ borderColor: mobileVerified ? '#10B981' : '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                placeholder="Enter mobile number"
              />
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#666' }} />
              {mobileVerified ? (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#10B981' }} />
              ) : (
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded transition-all"
                  style={{ backgroundColor: isListening ? '#FF6B6B' : 'transparent' }}
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" style={{ color: isListening ? '#FFFFFF' : '#666' }} />
                </button>
              )}
            </div>
            {!mobileVerified && formData.mobileNumber.length === 10 && (
              <button
                type="button"
                onClick={() => setShowOtpModal(true)}
                className="mt-2 text-sm font-medium flex items-center gap-1"
                style={{ color: '#027F83' }}
              >
                <Shield className="w-4 h-4" />
                Verify Mobile Number
              </button>
            )}
            {formData.mobileNumber.length > 0 && formData.mobileNumber.length < 10 && (
              <p style={{ fontSize: '11px', color: '#E94545', marginTop: '4px' }}>
                ⚠️ Enter 10-digit mobile number
              </p>
            )}
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Email ID
            </label>
            <input
              type="email"
              value={formData.emailId}
              onChange={(e) => setFormData(prev => ({ ...prev, emailId: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter email (optional)"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render Step 3: Location & Agristack Details
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
          Details As Per Agristack/Portal
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Enter your location and farmer category details
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Agristack Farmer Id
            </label>
            <input
              type="text"
              value={formData.agristackFarmerId}
              onChange={(e) => setFormData(prev => ({ ...prev, agristackFarmerId: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Agristack Farmer ID (optional)"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              State <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.state}
              onChange={(value) => setFormData(prev => ({ ...prev, state: value, district: '', taluka: '', village: '' }))}
              options={[{ value: '', label: 'Select State' }, ...states]}
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
              onChange={(value) => setFormData(prev => ({ ...prev, district: value, taluka: '', village: '' }))}
              options={[{ value: '', label: 'Select District' }, ...districts]}
              placeholder="Select District"
              isOpen={districtDropdownOpen}
              onToggle={() => !formData.state || setDistrictDropdownOpen(!districtDropdownOpen)}
              dropdownRef={districtRef}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Taluka <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.taluka}
              onChange={(e) => setFormData(prev => ({ ...prev, taluka: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Taluka"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Village <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Village"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Father Name <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.fatherName}
              onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
              maxLength={100}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter father's name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Farmer Category <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.farmerCategory}
              onChange={(value) => setFormData(prev => ({ ...prev, farmerCategory: value }))}
              options={[{ value: '', label: 'Select Category' }, ...farmerCategories]}
              placeholder="Select Farmer Category"
              isOpen={farmerCategoryDropdownOpen}
              onToggle={() => setFarmerCategoryDropdownOpen(!farmerCategoryDropdownOpen)}
              dropdownRef={farmerCategoryRef}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Class Category <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.classCategory}
              onChange={(value) => setFormData(prev => ({ ...prev, classCategory: value }))}
              options={[{ value: '', label: 'Select Class Category' }, ...classCategories]}
              placeholder="Select Class Category"
              isOpen={classCategoryDropdownOpen}
              onToggle={() => setClassCategoryDropdownOpen(!classCategoryDropdownOpen)}
              dropdownRef={classCategoryRef}
            />
          </div>

          {/* <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Other Backward Classes
            </label>
            <input
              type="text"
              value={formData.otherBackwardClasses}
              onChange={(e) => setFormData(prev => ({ ...prev, otherBackwardClasses: e.target.value }))}
              maxLength={50}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter OBC category (if applicable)"
            />
          </div> */}
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
            Supporting Document <span style={{ color: '#E94545' }}>*</span>
          </label>
          <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#CCD8DF' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({ ...prev, supportingDocument: file }));
                }
              }}
            />
            {formData.supportingDocument ? (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', color: '#222' }}>{formData.supportingDocument.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, supportingDocument: null }))}
                  className="text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-4"
              >
                <Upload className="w-8 h-8" style={{ color: '#027F83' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>Click to upload document</span>
              </button>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#E94545', marginTop: '4px' }}>
            Note: Please select a valid JPEG or PDF file less than 10MB in size.
          </p>
        </div>
      </div>
    </div>
  );

  // Render Step 4: Land Details
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
          Land Details
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Enter your land information
        </p>
      </div>

      <div className="space-y-4">
        {/* Location Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              State <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.state}
              onChange={(value) => setFormData(prev => ({ ...prev, state: value, district: '', taluka: '', village: '' }))}
              options={[{ value: '', label: 'Select State' }, ...states]}
              placeholder="Select State"
              isOpen={landStateDropdownOpen}
              onToggle={() => setLandStateDropdownOpen(!landStateDropdownOpen)}
              dropdownRef={landStateRef}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              District <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.district}
              onChange={(value) => setFormData(prev => ({ ...prev, district: value, taluka: '', village: '' }))}
              options={[{ value: '', label: 'Select District' }, ...districts]}
              placeholder="Select District"
              isOpen={landDistrictDropdownOpen}
              onToggle={() => !formData.state || setLandDistrictDropdownOpen(!landDistrictDropdownOpen)}
              dropdownRef={landDistrictRef}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Taluka <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.taluka}
              onChange={(e) => setFormData(prev => ({ ...prev, taluka: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Taluka"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Village <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Village"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Survey No <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.surveyNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, surveyNumber: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Survey No"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Khata No <span style={{ color: '#E94545' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.khataNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, khataNumber: e.target.value }))}
                className="w-full h-12 px-4 pr-12 rounded-lg border transition-all outline-none"
                style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                placeholder="Enter Khata No"
              />
              <button
                type="button"
                onClick={() => {
                  // Simulate fetching Khata details
                  setFormData(prev => ({
                    ...prev,
                    khataNumber: '73',
                    khataDescription: 'व्यक्तिगत खातेदार',
                    totalAreaAcre: '2.471',
                    totalAreaHa: '1.0'
                  }));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                style={{ backgroundColor: '#F2FCFB' }}
                title="Fetch Khata Details"
              >
                <Package className="w-4 h-4" style={{ color: '#027F83' }} />
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Khata Description
            </label>
            <input
              type="text"
              value={formData.khataDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, khataDescription: e.target.value }))}
              maxLength={100}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter Khata Description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Total Area (Acre)
            </label>
            <input
              type="text"
              value={formData.totalAreaAcre}
              onChange={(e) => setFormData(prev => ({ ...prev, totalAreaAcre: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="0.000"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Total Area (Ha)
            </label>
            <input
              type="text"
              value={formData.totalAreaHa}
              onChange={(e) => setFormData(prev => ({ ...prev, totalAreaHa: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="0.000"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Actual Sowing Area (Ha) <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.actualSowingAreaHa}
              onChange={(e) => setFormData(prev => ({ ...prev, actualSowingAreaHa: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter sowing area in hectares"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Converted Sowing Area (Acre)
            </label>
            <input
              type="text"
              value={formData.convertedSowingAreaAcre}
              readOnly
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#666', fontSize: '14px', backgroundColor: '#F7F9FA' }}
              placeholder="Auto-calculated"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Land Type <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.landType}
              onChange={(value) => setFormData(prev => ({ ...prev, landType: value }))}
              options={[{ value: '', label: 'Select Land Type' }, ...landTypes]}
              placeholder="Select Land Type"
              isOpen={landTypeDropdownOpen}
              onToggle={() => setLandTypeDropdownOpen(!landTypeDropdownOpen)}
              dropdownRef={landTypeRef}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Center <span style={{ color: '#E94545' }}>*</span>
            </label>
            <CustomDropdown
              value={formData.center}
              onChange={(value) => setFormData(prev => ({ ...prev, center: value }))}
              options={[{ value: '', label: 'Select Center' }, ...centers]}
              placeholder="Select Center"
              isOpen={centerDropdownOpen}
              onToggle={() => setCenterDropdownOpen(!centerDropdownOpen)}
              dropdownRef={centerRef}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Land Owner Name
            </label>
            <input
              type="text"
              value={formData.landOwnerName}
              onChange={(e) => setFormData(prev => ({ ...prev, landOwnerName: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter land owner name"
            />
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F7F7', border: '1px solid #027F83' }}>
          <div className="flex items-center gap-3 mb-3">
            <Scan className="w-5 h-5" style={{ color: '#027F83' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
              Scan Land Document
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Upload land record document to auto-fill land details using OCR
          </p>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            id="land-document"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLandDocumentScan(file);
            }}
          />
          <label
            htmlFor="land-document"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all"
            style={{ backgroundColor: '#FFFFFF', color: '#027F83', fontSize: '14px', fontWeight: '600', border: '1px solid #027F83' }}
          >
            <Upload className="w-4 h-4" />
            Upload Land Document
          </label>
        </div>
      </div>
    </div>
  );

  // Render Step 5: Bank Details
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
          Bank Details
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Enter your bank account information
        </p>
      </div>

      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#FFF3CD', border: '1px solid #FFC107' }}>
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#856404' }} />
          <p style={{ fontSize: '12px', color: '#856404', lineHeight: '1.5' }}>
            <strong>Note:</strong> From this procurement season, payments will be made through Aadhaar-enabled mode; hence, there is no need to add or update bank account details. However, you may still provide bank details for other purposes.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Farmer Name
            </label>
            <input
              type="text"
              value={formData.farmerName}
              readOnly
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#666', fontSize: '14px', backgroundColor: '#F7F9FA' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Account Holder Name <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.accountHolderName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountHolderName: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter account holder name"
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              IFSC Code <span style={{ color: '#E94545' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                className="w-full h-12 px-4 pr-12 rounded-lg border transition-all outline-none"
                style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                placeholder="Enter IFSC Code"
                maxLength={11}
              />
              <button
                type="button"
                onClick={() => {
                  // Simulate IFSC validation and bank name fetch
                  if (formData.ifscCode.length === 11) {
                    setFormData(prev => ({ ...prev, bankName: 'SAMPLE BANK OF INDIA' }));
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                style={{ backgroundColor: '#F2FCFB' }}
                title="Validate IFSC"
              >
                <Package className="w-4 h-4" style={{ color: '#027F83' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter bank name"
            />
          </div>

          <div className="relative">
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Bank Account Number <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.bankAccountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, bankAccountNumber: value }));
              }}
              className="w-full h-12 px-4 pr-12 rounded-lg border transition-all outline-none"
              style={{ borderColor: '#CCD8DF', color: '#222222', fontSize: '14px', backgroundColor: '#FFFFFF' }}
              placeholder="Enter account number"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-9"
            >
              {showPassword ? <EyeOff className="w-5 h-5" style={{ color: '#666' }} /> : <Eye className="w-5 h-5" style={{ color: '#666' }} />}
            </button>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
              Confirm Bank Account Number <span style={{ color: '#E94545' }}>*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmBankAccountNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, confirmBankAccountNumber: value }));
              }}
              className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
              style={{
                borderColor: formData.bankAccountNumber && formData.bankAccountNumber === formData.confirmBankAccountNumber ? '#10B981' : '#CCD8DF',
                color: '#222222',
                fontSize: '14px',
                backgroundColor: '#FFFFFF'
              }}
              placeholder="Re-enter account number"
            />
            {formData.bankAccountNumber && formData.bankAccountNumber === formData.confirmBankAccountNumber && formData.confirmBankAccountNumber && (
              <div className="flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                <span style={{ fontSize: '12px', color: '#10B981' }}>Account numbers match</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F7F7', border: '1px solid #027F83' }}>
          <div className="flex items-center gap-3 mb-3">
            <Scan className="w-5 h-5" style={{ color: '#027F83' }} />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#003A5D' }}>
              Scan Bank Passbook/Cheque
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Upload bank passbook or cheque to auto-fill bank details using OCR
          </p>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            id="bank-document"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleBankDocumentScan(file);
            }}
          />
          <label
            htmlFor="bank-document"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all"
            style={{ backgroundColor: '#FFFFFF', color: '#027F83', fontSize: '14px', fontWeight: '600', border: '1px solid #027F83' }}
          >
            <Upload className="w-4 h-4" />
            Upload Bank Document
          </label>
          <p style={{ fontSize: '12px', color: '#E94545', marginTop: '8px' }}>
            Note: Please select a valid JPEG or PDF file less than 10MB in size.
          </p>
        </div>
      </div>
    </div>
  );

  // Render Step 6: Scheme Participation
  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
          Scheme Participation
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Select the scheme you want to participate in
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
            Scheme <span style={{ color: '#E94545' }}>*</span>
          </label>
          <CustomDropdown
            value={formData.selectedScheme}
            onChange={(value) => setFormData(prev => ({ ...prev, selectedScheme: value }))}
            options={[{ value: '', label: 'Select Scheme' }, ...schemes]}
            placeholder="Select Scheme"
            isOpen={schemeDropdownOpen}
            onToggle={() => setSchemeDropdownOpen(!schemeDropdownOpen)}
            dropdownRef={schemeRef}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', display: 'block' }}>
            Upload Supporting Document <span style={{ color: '#E94545' }}>*</span>
          </label>
          <div className="border-2 border-dashed rounded-lg p-4" style={{ borderColor: '#CCD8DF' }}>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="supporting-document"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({ ...prev, supportingDocument: file }));
                }
              }}
            />
            {formData.supportingDocument ? (
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '14px', color: '#222' }}>{formData.supportingDocument.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, supportingDocument: null }))}
                  className="text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="supporting-document"
                className="w-full flex flex-col items-center gap-2 py-4 cursor-pointer"
              >
                <Upload className="w-8 h-8" style={{ color: '#027F83' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>Click to upload document</span>
              </label>
            )}
          </div>
          <p style={{ fontSize: '12px', color: '#E94545', marginTop: '4px' }}>
            Note: Please select a valid JPEG or PDF file less than 10MB in size.
          </p>
        </div>

        <div className="p-5 rounded-xl border-2" style={{ borderColor: '#10B981', backgroundColor: '#E6F7F7' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
            Total Area (Acre): {formData.totalAreaAcre || '0.000'}
          </h3>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#666' }}>State:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{formData.state || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#666' }}>District:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{formData.district || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#666' }}>Taluka:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{formData.taluka || 'Not entered'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#666' }}>Village:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{formData.village || 'Not entered'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#666' }}>Land Owner Name:</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{formData.landOwnerName || 'Not entered'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show details view if registration is complete
  if (showDetailsView) {
    return (
      <FarmerDetailsView
        farmerData={{
          ...formData,
          registrationDate: new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          status: 'Active'
        }}
        onBack={() => setShowDetailsView(false)}
        onEdit={() => setShowDetailsView(false)}
      />
    );
  }

  return (
    <div className="p-8 pb-20 overflow-y-auto" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2" style={{ fontSize: '14px', color: '#666' }}>
        <Home className="w-4 h-4" style={{ color: '#027F83' }} />
        <button className="hover:underline transition-colors cursor-pointer" style={{ color: '#027F83', fontWeight: '500', background: 'none', border: 'none', padding: 0 }}>
          Home
        </button>
        <ChevronRight className="w-4 h-4" />
        <span style={{ fontWeight: '600', color: '#222' }}>Farmer Registration</span>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
                  style={{
                    backgroundColor: step <= currentStep ? '#027F83' : '#E5EBEF',
                    color: step <= currentStep ? '#FFFFFF' : '#666',
                    fontSize: '14px'
                  }}
                >
                  {step < currentStep ? <CheckCircle2 className="w-6 h-6" /> : step}
                </div>
                <span style={{ fontSize: '10px', color: '#666', marginTop: '4px', textAlign: 'center' }}>
                  {step === 1 ? 'Aadhaar' : step === 2 ? 'Personal' : step === 3 ? 'Location' : step === 4 ? 'Land' : step === 5 ? 'Bank' : 'Scheme'}
                </span>
              </div>
              {step < 6 && (
                <div
                  className="h-1 flex-1 mx-2"
                  style={{ backgroundColor: step < currentStep ? '#027F83' : '#E5EBEF' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}>
        <div className="p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>

        {/* Navigation Buttons */}
        <div className="px-8 py-6 border-t flex items-center justify-between" style={{ borderColor: '#E5EBEF' }}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all"
            style={{
              backgroundColor: currentStep === 1 ? '#F7F9FA' : '#FFFFFF',
              color: currentStep === 1 ? '#999' : '#027F83',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid #027F83',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNextStep()}
              className="px-6 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: canProceedToNextStep() ? '#027F83' : '#CCD8DF',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: canProceedToNextStep() ? 'pointer' : 'not-allowed'
              }}
            >
              Next
              <ChevronRight className="w-4 h-4 inline-block ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceedToNextStep()}
              className="px-6 py-3 rounded-lg transition-all"
              style={{
                backgroundColor: canProceedToNextStep() ? '#027F83' : '#CCD8DF',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: canProceedToNextStep() ? 'pointer' : 'not-allowed'
              }}
            >
              Submit Registration
            </button>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>Verify Mobile Number</h3>
              <button onClick={() => setShowOtpModal(false)} className="p-1">
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '6' }}>
              Enter the 6-digit OTP sent to {formData.mobileNumber}
            </p>
            <div className="flex gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    if (value && index < 5) {
                      otpRefs.current[index + 1]?.focus();
                    }
                    if (newOtp.every(d => d) && newOtp.join('').length === 6) {
                      setMobileVerified(true);
                      setShowOtpModal(false);
                    }
                  }}
                  className="flex-1 h-12 text-center rounded-lg border-2 transition-all outline-none"
                  style={{ borderColor: '#CCD8DF', fontSize: '18px', fontWeight: '600' }}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setMobileVerified(true);
                setShowOtpModal(false);
              }}
              className="w-full h-12 rounded-lg"
              style={{ backgroundColor: '#027F83', color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}
            >
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {/* Offline Aadhaar OTP Modal */}
      {showOfflineOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>Verify OTP</h3>
              <button onClick={() => {
                setShowOfflineOtpModal(false);
                setOfflineVerificationStatus('idle');
                setOfflineOtp(['', '', '', '', '', '']);
              }} className="p-1">
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Enter the 6-digit OTP sent to your registered mobile number
            </p>
            <div className="flex gap-1.5 sm:gap-2 mb-6 w-full">
              {offlineOtp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { offlineOtpRefs[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOfflineOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOfflineOtpKeyDown(index, e)}
                  className="flex-1 min-w-0 h-12 text-center rounded-lg border-2 transition-all outline-none"
                  style={{ 
                    borderColor: '#CCD8DF', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    maxWidth: '100%'
                  }}
                />
              ))}
            </div>
            <div className="space-y-3">
              <button
                type="button"
                onClick={verifyOfflineOtp}
                disabled={offlineOtp.join('').length !== 6}
                className="w-full h-12 rounded-lg transition-all"
                style={{
                  backgroundColor: offlineOtp.join('').length === 6 ? '#027F83' : '#CCD8DF',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: offlineOtp.join('').length === 6 ? 'pointer' : 'not-allowed'
                }}
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setOfflineProgressMessage('Resending OTP...');
                  setTimeout(() => setOfflineProgressMessage('OTP sent to your registered mobile number'), 1000);
                }}
                className="w-full text-sm py-2"
                style={{ color: '#027F83', fontWeight: '600', background: 'none', border: 'none' }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OCR Processing Modal */}
      {isProcessingOCR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#027F83' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D', marginBottom: '8px' }}>
                Processing Document
              </h3>
              <p style={{ fontSize: '14px', color: '#666' }}>{ocrProgress}</p>
            </div>
          </div>
        </div>
      )}

      {/* Face Capture Modal */}
      {showFaceCapture && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>
                {formData.authenticationMethod === 'offline' && offlineVerificationStatus === 'liveness-checking' ? 'Liveness Check' :
                 formData.authenticationMethod === 'offline' && offlineVerificationStatus === 'face-verifying' ? 'Face Verification' :
                 'Face Capture'}
              </h3>
              {formData.authenticationMethod !== 'offline' && (
                <button onClick={cancelFaceVerification} className="p-1">
                  <X className="w-5 h-5" style={{ color: '#666' }} />
                </button>
              )}
            </div>
            
            <div className="mb-6">
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 mb-4" style={{ borderColor: '#027F83', backgroundColor: '#F7F9FA' }}>
                {capturedFaceImage ? (
                  <img src={capturedFaceImage} alt="Captured Face" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Camera className="w-16 h-16 mb-4" style={{ color: '#027F83' }} />
                    <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                      {formData.authenticationMethod === 'offline' && offlineVerificationStatus === 'liveness-checking' 
                        ? 'Please look at the camera for liveness detection'
                        : 'Position your face within the frame'}
                    </p>
                    <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                      Ensure good lighting and look directly at the camera
                    </p>
                  </div>
                )}
              </div>
              
              {(faceVerificationStatus === 'processing' || offlineVerificationStatus === 'liveness-checking' || offlineVerificationStatus === 'face-verifying') && !capturedFaceImage && (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" style={{ color: '#027F83' }} />
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {offlineVerificationStatus === 'liveness-checking' ? 'Checking liveness...' :
                     offlineVerificationStatus === 'face-verifying' ? 'Verifying face...' :
                     'Detecting face...'}
                  </p>
                </div>
              )}
            </div>

            {formData.authenticationMethod !== 'offline' && (
              <div className="flex gap-3">
                {!capturedFaceImage ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelFaceVerification}
                      className="flex-1 h-12 rounded-lg transition-all"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#027F83',
                        fontSize: '14px',
                        fontWeight: '600',
                        border: '1px solid #027F83'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={captureFace}
                      className="flex-1 h-12 rounded-lg transition-all"
                      style={{
                        backgroundColor: '#027F83',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      <Camera className="w-4 h-4 inline-block mr-2" />
                      Capture
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={cancelFaceVerification}
                    className="w-full h-12 rounded-lg transition-all"
                    style={{
                      backgroundColor: '#027F83',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Processing...
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Details Confirmation Modal */}
      {showDetailsConfirmation && pendingAadhaarData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#003A5D' }}>Details As Per Aadhaar</h3>
              <button onClick={cancelFaceVerification} className="p-1">
                <X className="w-5 h-5" style={{ color: '#666' }} />
              </button>
            </div>

            {capturedFaceImage && (
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4" style={{ borderColor: '#027F83' }}>
                  <img src={capturedFaceImage} alt="Captured Face" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Farmer Name as per Aadhaar Card
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.farmerName}</p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Aadhaar Number
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.aadhaarNumber}</p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Date of Birth
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.dateOfBirth}</p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Gender
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.gender}</p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Father Name
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.fatherName}</p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Address
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.address}</p>
              </div>

              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F7F9FA' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#666', display: 'block', marginBottom: '4px' }}>
                  Pincode
                </label>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{pendingAadhaarData.pincode}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelFaceVerification}
                className="flex-1 h-12 rounded-lg transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#027F83',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: '1px solid #027F83'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAadhaarDetails}
                className="flex-1 h-12 rounded-lg transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#027F83',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Confirm Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
