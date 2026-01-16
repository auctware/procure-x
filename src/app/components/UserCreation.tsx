import { useState } from 'react';
import { Home, ChevronRight, User, Smartphone, Mail, Shield, Building2 } from 'lucide-react';

interface UserFormData {
  userCategory: string;
  userId: string;
  orgName: string;
  nameAsPerAadhaar: string;
  aadhaarNo: string;
  mobileNo: string;
  emailId: string;
  scheme: string;
  address: string;
}

export default function UserCreation() {
  const [formData, setFormData] = useState<UserFormData>({
    userCategory: '',
    userId: '',
    orgName: '',
    nameAsPerAadhaar: '',
    aadhaarNo: '',
    mobileNo: '',
    emailId: '',
    scheme: '',
    address: '',
  });

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User created:', formData);
  };

  const handleReset = () => {
    setFormData({
      userCategory: '',
      userId: '',
      orgName: '',
      nameAsPerAadhaar: '',
      aadhaarNo: '',
      mobileNo: '',
      emailId: '',
      scheme: '',
      address: '',
    });
  };

  return (
    <div className="p-8" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
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
        <span style={{ fontWeight: '600', color: '#222' }}>User Creation</span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5EBEF' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b flex items-center gap-3"
          style={{ borderColor: '#E5EBEF' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#E6F7F7' }}
          >
            <User className="w-5 h-5" style={{ color: '#027F83' }} />
          </div>
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#777777',
              }}
            >
              User Creation
            </h2>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
              Fill in the details to create a new user for the selected organization.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User Category */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                User Category <span style={{ color: '#E94545' }}>*</span>
              </label>
              <select
                value={formData.userCategory}
                onChange={(e) => handleChange('userCategory', e.target.value)}
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="">Select Category</option>
                <option value="Admin">Admin</option>
                <option value="Operator">Operator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            {/* User ID */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => handleChange('userId', e.target.value)}
                placeholder="Enter User ID"
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {/* Org Name */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Org Name <span style={{ color: '#E94545' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.orgName}
                onChange={(e) => handleChange('orgName', e.target.value)}
                placeholder="Enter Organization Name"
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name as per Aadhaar */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Name As Per Aadhaar Card <span style={{ color: '#E94545' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.nameAsPerAadhaar}
                onChange={(e) => handleChange('nameAsPerAadhaar', e.target.value)}
                placeholder="Enter Name"
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {/* Aadhaar No */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Aadhaar No <span style={{ color: '#E94545' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.aadhaarNo}
                onChange={(e) => handleChange('aadhaarNo', e.target.value)}
                placeholder="XXXX XXXX XXXX"
                maxLength={14}
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {/* Mobile No */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Mobile No <span style={{ color: '#E94545' }}>*</span>
              </label>
              <div className="flex gap-3">
                <div
                  className="h-12 px-3 rounded-lg flex items-center gap-2"
                  style={{
                    backgroundColor: '#F7F9FA',
                    border: '1px solid #E5EBEF',
                    fontSize: '14px',
                    color: '#315B78',
                  }}
                >
                  <Smartphone className="w-4 h-4" style={{ color: '#027F83' }} />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) => handleChange('mobileNo', e.target.value)}
                  placeholder="10-digit Mobile"
                  maxLength={10}
                  className="flex-1 h-12 px-4 rounded-lg border transition-all outline-none"
                  style={{
                    borderColor: '#CCD8DF',
                    color: '#222222',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Email ID <span style={{ color: '#E94545' }}>*</span>
              </label>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 mt-3" style={{ color: '#027F83' }} />
                <input
                  type="email"
                  value={formData.emailId}
                  onChange={(e) => handleChange('emailId', e.target.value)}
                  placeholder="Enter Email"
                  className="flex-1 h-12 px-4 rounded-lg border transition-all outline-none"
                  style={{
                    borderColor: '#CCD8DF',
                    color: '#222222',
                    fontSize: '14px',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>

            {/* Scheme */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Scheme
              </label>
              <select
                value={formData.scheme}
                onChange={(e) => handleChange('scheme', e.target.value)}
                className="w-full h-12 px-4 rounded-lg border transition-all outline-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="">Select Scheme</option>
                <option value="MMFT FOR ETHANGK KHARIF 2025">MMFT FOR ETHANGK KHARIF 2025</option>
                <option value="PMFBY 2024">PMFBY 2024</option>
                <option value="KISAN CREDIT 2025">KISAN CREDIT 2025</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#777777',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Complete address"
                rows={2}
                className="w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none"
                style={{
                  borderColor: '#CCD8DF',
                  color: '#222222',
                  fontSize: '14px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E5EBEF' }}>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 h-11 rounded-lg transition-all"
              style={{
                backgroundColor: '#F7F9FA',
                border: '1px solid #CCD8DF',
                color: '#666',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 h-11 rounded-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #027F83',
                color: '#027F83',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              <Shield className="w-4 h-4" style={{ color: '#027F83' }} />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


