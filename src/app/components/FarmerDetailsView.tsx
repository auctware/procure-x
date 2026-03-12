import { 
  User, Mail, MapPin, Calendar, Shield, FileText, 
  LandPlot, Building2, CreditCard, Package, CheckCircle2,
  Edit, Download, Share2, ArrowLeft, Smartphone, IdCard
} from 'lucide-react';

interface FarmerDetailsViewProps {
  farmerData: {
    // Aadhaar & Authentication
    aadhaarNumber: string;
    authenticationMethod: 'face' | 'fingerprint' | 'offline';
    consentGiven: boolean;
    
    // Personal Details
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
    
    // Scheme Participation
    selectedScheme: string;
    registrationDate?: string;
    status?: string;
  };
  onBack?: () => void;
  onEdit?: () => void;
}

export default function FarmerDetailsView({ farmerData, onBack, onEdit }: FarmerDetailsViewProps) {
  const formatAadhaar = (aadhaar: string) => {
    if (aadhaar.length === 12) {
      return `${aadhaar.slice(0, 4)} ${aadhaar.slice(4, 8)} ${aadhaar.slice(8, 12)}`;
    }
    return aadhaar;
  };

  const formatAccountNumber = (account: string) => {
    if (account.length > 4) {
      return `****${account.slice(-4)}`;
    }
    return account;
  };

  const getAuthMethodLabel = (method: string) => {
    switch (method) {
      case 'face': return 'Face Authentication';
      case 'fingerprint': return 'Fingerprint Authentication';
      case 'offline': return 'Offline Aadhaar Verification';
      default: return method;
    }
  };

  const InfoCard = ({ icon: Icon, title, children, className = '' }: { icon: any; title: string; children: React.ReactNode; className?: string }) => (
    <div className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${className}`} style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
          <Icon className="w-5 h-5" style={{ color: '#027F83' }} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#315B78' }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0" style={{ borderColor: '#E5EBEF' }}>
      {Icon && (
        <Icon className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#027F83' }} />
      )}
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#777777', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
          {value || '—'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      {/* Header */}
      <div className="bg-white border-b-2" style={{ borderColor: '#E5EBEF' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg transition-all hover:bg-gray-100"
                  style={{ color: '#027F83' }}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#315B78', marginBottom: '4px' }}>
                  Farmer Details
                </h1>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Complete profile information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {farmerData.status && (
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
                      backgroundColor: farmerData.status === 'Active' ? '#00A040' : farmerData.status === 'Pending' ? '#FFA200' : '#E94545'
                    }}
                  ></div>
                  {farmerData.status}
                </span>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                  style={{ backgroundColor: '#027F83', color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border-2"
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: '#027F83',
                  color: '#027F83',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
                title="Export"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E6F7F7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                className="p-2 rounded-lg transition-all hover:bg-gray-100"
                style={{ color: '#027F83' }}
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-20 flex-1" style={{ width: '100%' }}>
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border-2" style={{ borderColor: '#027F83' }}>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center border-4" style={{ borderColor: '#FFFFFF', backgroundColor: '#E6F7F7' }}>
              <User className="w-12 h-12" style={{ color: '#027F83' }} />
            </div>
            <div className="flex-1">
              <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#315B78', marginBottom: '8px' }}>
                {farmerData.farmerName || 'Farmer Name'}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" style={{ color: '#027F83' }} />
                  <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>
                    {farmerData.mobileNumber || '—'}
                  </span>
                </div>
                {farmerData.emailId && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: '#027F83' }} />
                    <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>
                      {farmerData.emailId}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4" style={{ color: '#027F83' }} />
                  <span style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>
                    {formatAadhaar(farmerData.aadhaarNumber)}
                  </span>
                </div>
              </div>
              {farmerData.agristackFarmerId && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: '#027F83' }} />
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Agristack ID: <span style={{ fontWeight: '600' }}>{farmerData.agristackFarmerId}</span>
                  </span>
                </div>
              )}
            </div>
            <div className="text-right">
              {farmerData.registrationDate && (
                <div>
                  <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Registered On</p>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78' }}>
                    {farmerData.registrationDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details */}
          <InfoCard icon={User} title="Personal Details">
            <div className="space-y-0">
              <InfoRow label="Full Name" value={farmerData.farmerName} icon={User} />
              <InfoRow label="Father's Name" value={farmerData.fatherName} />
              <InfoRow label="Date of Birth" value={farmerData.dateOfBirth} icon={Calendar} />
              <InfoRow label="Gender" value={farmerData.gender} />
              <InfoRow label="Address" value={farmerData.address} icon={MapPin} />
              <InfoRow label="Pincode" value={farmerData.pincode} />
            </div>
          </InfoCard>

          {/* Authentication & Verification */}
          <InfoCard icon={Shield} title="Authentication & Verification">
            <div className="space-y-0">
              <InfoRow label="Aadhaar Number" value={formatAadhaar(farmerData.aadhaarNumber)} icon={IdCard} />
              <InfoRow label="Authentication Method" value={getAuthMethodLabel(farmerData.authenticationMethod)} icon={Shield} />
              <div className="flex items-center gap-2 py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>
                  Aadhaar Verified
                </span>
              </div>
              <div className="flex items-center gap-2 py-3">
                <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#10B981' }}>
                  Consent Given
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Location Details */}
          <InfoCard icon={MapPin} title="Location Details">
            <div className="space-y-0">
              <InfoRow label="State" value={farmerData.state} icon={MapPin} />
              <InfoRow label="District" value={farmerData.district} />
              <InfoRow label="Taluka" value={farmerData.taluka} />
              <InfoRow label="Village" value={farmerData.village} />
            </div>
          </InfoCard>

          {/* Farmer Category */}
          <InfoCard icon={FileText} title="Farmer Category">
            <div className="space-y-0">
              <InfoRow label="Farmer Category" value={farmerData.farmerCategory} />
              <InfoRow label="Class Category" value={farmerData.classCategory} />
              {farmerData.otherBackwardClasses && (
                <InfoRow label="Other Backward Classes" value={farmerData.otherBackwardClasses} />
              )}
            </div>
          </InfoCard>

          {/* Land Details */}
          <InfoCard icon={LandPlot} title="Land Details">
            <div className="space-y-0">
              <InfoRow label="Survey Number" value={farmerData.surveyNumber} />
              <InfoRow label="Khata Number" value={farmerData.khataNumber} />
              <InfoRow label="Khata Description" value={farmerData.khataDescription} />
              <InfoRow label="Total Area (Acre)" value={farmerData.totalAreaAcre ? `${farmerData.totalAreaAcre} Acre` : '—'} />
              <InfoRow label="Total Area (Ha)" value={farmerData.totalAreaHa ? `${farmerData.totalAreaHa} Ha` : '—'} />
              <InfoRow label="Actual Sowing Area (Ha)" value={farmerData.actualSowingAreaHa ? `${farmerData.actualSowingAreaHa} Ha` : '—'} />
              <InfoRow label="Converted Sowing Area (Acre)" value={farmerData.convertedSowingAreaAcre ? `${farmerData.convertedSowingAreaAcre} Acre` : '—'} />
              <InfoRow label="Land Type" value={farmerData.landType} />
              <InfoRow label="Center" value={farmerData.center} />
              {farmerData.landOwnerName && (
                <InfoRow label="Land Owner Name" value={farmerData.landOwnerName} />
              )}
            </div>
          </InfoCard>

          {/* Bank Details */}
          <InfoCard icon={CreditCard} title="Bank Details">
            <div className="space-y-0">
              <InfoRow label="Account Holder Name" value={farmerData.accountHolderName} />
              <InfoRow label="Bank Name" value={farmerData.bankName} icon={Building2} />
              <InfoRow label="IFSC Code" value={farmerData.ifscCode} />
              <InfoRow label="Account Number" value={formatAccountNumber(farmerData.bankAccountNumber)} />
            </div>
          </InfoCard>

          {/* Scheme Participation */}
          {farmerData.selectedScheme && (
            <InfoCard icon={Package} title="Scheme Participation" className="lg:col-span-2">
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F7F7' }}>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 mt-0.5" style={{ color: '#027F83' }} />
                  <div className="flex-1">
                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#315B78', marginBottom: '4px' }}>
                      Selected Scheme
                    </p>
                    <p style={{ fontSize: '14px', color: '#315B78' }}>
                      {farmerData.selectedScheme}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: '#027F83', color: '#FFFFFF' }}
                  >
                    Active
                  </span>
                </div>
              </div>
            </InfoCard>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777' }}>Total Land Area</span>
              <LandPlot className="w-4 h-4" style={{ color: '#027F83' }} />
            </div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#315B78' }}>
              {farmerData.totalAreaHa || '0'} Ha
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {farmerData.totalAreaAcre || '0'} Acres
            </p>
          </div>
          <div className="p-4 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777' }}>Sowing Area</span>
              <Package className="w-4 h-4" style={{ color: '#027F83' }} />
            </div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#315B78' }}>
              {farmerData.actualSowingAreaHa || '0'} Ha
            </p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {farmerData.convertedSowingAreaAcre || '0'} Acres
            </p>
          </div>
          <div className="p-4 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777' }}>Land Type</span>
              <FileText className="w-4 h-4" style={{ color: '#027F83' }} />
            </div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#315B78' }}>
              {farmerData.landType || '—'}
            </p>
          </div>
          <div className="p-4 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#777777' }}>Center</span>
              <Building2 className="w-4 h-4" style={{ color: '#027F83' }} />
            </div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: '#315B78' }}>
              {farmerData.center || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
