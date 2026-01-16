import { useState, useRef } from 'react';
import { User, ArrowRight, Languages, Zap, Shield, Brain } from 'lucide-react';
import logoImage from '../../assets/logo.png';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      // Simulate OTP verification
      onLoginSuccess();
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    otpRefs.current[0]?.focus();
    // Add resend OTP logic here
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left Side - Smart AI Content */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative items-center p-12"
        style={{ 
          backgroundColor: '#0A111A'
        }}
      >
        {/* Content */}
        <div className="relative z-10 max-w-2xl w-full mx-auto">
          {/* Main Heading */}
          <h1 
            style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              color: '#FFFFFF', 
              lineHeight: '1.2',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Intelligent Procurement</span>
            <span style={{ display: 'block', whiteSpace: 'nowrap', color: '#4FD1C7' }}>Powered by AI</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="mb-12"
            style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#4FD1C7', 
              lineHeight: '1.5',
              marginBottom: '48px'
            }}
          >
            Smart decisions, real results.
          </p>

          {/* Feature List */}
          <div className="space-y-6 flex flex-col" style={{ gap: '24px' }}>
            {/* Feature 1: Natural language based operation */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Languages className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: '400', color: '#FFFFFF', lineHeight: '1.5' }}>
                Natural language based operations
              </span>
            </div>

            {/* Feature 2: Smart Automation */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Zap className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: '400', color: '#FFFFFF', lineHeight: '1.5' }}>
                Smart Automation
              </span>
            </div>

            {/* Feature 3: Risk Detection */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Shield className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: '400', color: '#FFFFFF', lineHeight: '1.5' }}>
                Risk Detection
              </span>
            </div>

            {/* Feature 4: AI Insights */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Brain className="w-6 h-6" style={{ color: '#FFFFFF' }} />
              </div>
              <span style={{ fontSize: '16px', fontWeight: '400', color: '#FFFFFF', lineHeight: '1.5' }}>
                AI Insights
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6 text-center">
            <img 
              src={logoImage} 
              alt="ProcureX" 
              className="h-24 w-auto mx-auto"
            />
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 
              style={{ fontSize: '28px', fontWeight: '600', color: '#222222', marginBottom: '8px' }}
            >
              {step === 'credentials' ? 'Sign In' : 'Verify OTP'}
            </h2>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {step === 'credentials' 
                ? 'Enter your credentials to access your account'
                : `We've sent a 6-digit OTP to ${userId}`
              }
            </p>
          </div>

          {/* Step 1: Credentials Form */}
          {step === 'credentials' && (
            <form onSubmit={handleSubmitCredentials} className="space-y-5">
              {/* User ID Input */}
              <div>
                <label 
                  htmlFor="userId"
                  className="block mb-2"
                  style={{ fontSize: '13px', fontWeight: '500', color: '#222222' }}
                >
                  User ID / Mobile Number
                </label>
                <div className="relative">
                  <div 
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ backgroundColor: '#F2FCFB' }}
                  >
                    <User className="w-4 h-4" style={{ color: '#027F83' }} />
                  </div>
                  <input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your user ID or mobile number"
                    className="w-full h-12 pl-14 pr-4 rounded-lg border transition-all outline-none"
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

              {/* Consent Text */}
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F2FCFB', border: '1px solid #E5EBEF' }}>
                <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.7' }}>
                  By transacting on this platform you agree to the{' '}
                  <a 
                    href="#" 
                    className="transition-colors"
                    style={{ color: '#027F83', textDecoration: 'none', fontWeight: '500' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Terms And Conditions
                  </a>
                  . By entry into this system you confirm that you have explicit permission for access. Unauthorized access to this system is{' '}
                  <span style={{ color: '#E94545', fontWeight: '500' }}>Forbidden</span>, and subject to legal proceedings.{' '}
                  <a 
                    href="#" 
                    className="transition-colors"
                    style={{ color: '#027F83', textDecoration: 'none', fontWeight: '500' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Get OTP Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-lg font-medium transition-all flex items-center justify-center gap-2 mt-6"
                style={{
                  backgroundColor: '#027F83',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(2, 127, 131, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#003a5d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 127, 131, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#027F83';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 127, 131, 0.2)';
                }}
              >
                Get OTP
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Input Boxes */}
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 text-center rounded-lg border-2 transition-all outline-none"
                    style={{
                      borderColor: digit ? '#027F83' : '#CCD8DF',
                      color: '#222222',
                      fontSize: '20px',
                      fontWeight: '600',
                      backgroundColor: '#FFFFFF'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#027F83';
                      e.target.style.boxShadow = '0 0 0 3px rgba(2, 127, 131, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = digit ? '#027F83' : '#CCD8DF';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <p style={{ fontSize: '13px', color: '#666' }}>
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="transition-colors"
                    style={{ color: '#027F83', textDecoration: 'none', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#003a5d'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#027F83'}
                  >
                    Resend OTP
                  </button>
                </p>
              </div>

              {/* Consent Text */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F2FCFB', border: '1px solid #E5EBEF' }}>
                <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.7' }}>
                  By transacting on this platform you agree to the{' '}
                  <a 
                    href="#" 
                    className="transition-colors"
                    style={{ color: '#027F83', textDecoration: 'none', fontWeight: '500' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Terms And Conditions
                  </a>
                  . By entry into this system you confirm that you have explicit permission for access. Unauthorized access to this system is{' '}
                  <span style={{ color: '#E94545', fontWeight: '500' }}>Forbidden</span>, and subject to legal proceedings.{' '}
                  <a 
                    href="#" 
                    className="transition-colors"
                    style={{ color: '#027F83', textDecoration: 'none', fontWeight: '500' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="w-full h-12 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#027F83',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(2, 127, 131, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#003a5d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 127, 131, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#027F83';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 127, 131, 0.2)';
                }}
              >
                Verify & Login
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtp(['', '', '', '', '', '']);
                }}
                className="w-full text-center transition-colors"
                style={{ fontSize: '13px', color: '#666', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#027F83'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              >
                ← Back to login
              </button>
            </form>
          )}

          {/* Divider - Only show in credentials step */}
          {step === 'credentials' && (
            <>
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5EBEF' }} />
                <span style={{ fontSize: '12px', color: '#999' }}>OR</span>
                <div className="flex-1 h-px" style={{ backgroundColor: '#E5EBEF' }} />
              </div>

              {/* Register Link */}
              <div className="text-center">
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Don't have an account?{' '}
                  <a 
                    href="#" 
                    className="transition-colors"
                    style={{ color: '#027F83', textDecoration: 'none', fontWeight: '600' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#003a5d'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#027F83'}
                  >
                    Register Now
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Google reCAPTCHA v3 Badge */}
      <div 
        className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5EBEF'
        }}
      >
        <svg width="32" height="32" viewBox="0 0 256 256" fill="none">
          <rect width="256" height="256" rx="16" fill="#4285F4"/>
          <path d="M128 32C74.9 32 32 74.9 32 128C32 181.1 74.9 224 128 224C181.1 224 224 181.1 224 128C224 74.9 181.1 32 128 32ZM128 208C83.8 208 48 172.2 48 128C48 83.8 83.8 48 128 48C172.2 48 208 83.8 208 128C208 172.2 172.2 208 128 208Z" fill="white"/>
          <path d="M128 64C92.7 64 64 92.7 64 128C64 163.3 92.7 192 128 192C163.3 192 192 163.3 192 128C192 92.7 163.3 64 128 64ZM128 176C101.5 176 80 154.5 80 128C80 101.5 101.5 80 128 80C154.5 80 176 101.5 176 128C176 154.5 154.5 176 128 176Z" fill="white"/>
          <circle cx="128" cy="128" r="32" fill="white"/>
        </svg>
        <div>
          <div style={{ fontSize: '9px', color: '#999', lineHeight: '1.2' }}>Protected by</div>
          <div style={{ fontSize: '11px', color: '#222', fontWeight: '600', lineHeight: '1.2' }}>reCAPTCHA</div>
        </div>
      </div>
    </div>
  );
}