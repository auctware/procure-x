import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function Footer() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <footer
      className="border-t mt-8 transition-all duration-300"
      style={{ backgroundColor: '#F7F9FA', borderColor: '#E5EBEF' }}
    >
      {/* Footer Content - Collapsible */}
      {!isCollapsed && (
        <div className="max-w-6xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)] text-sm">
        {/* Company description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#027F83' }}
            >
              <span
                style={{
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '16px',
                }}
              >
                A
              </span>
            </div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#315B78',
              }}
            >
              Sample Technologies
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#666666',
              lineHeight: 1.7,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          <h4
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#315B78',
              marginBottom: '4px',
            }}
          >
            Links
          </h4>
          <div className="flex flex-col gap-2">
            {['About Us', 'Privacy Policy', 'Terms and Conditions', 'Tiffin Disclaimer'].map(
              (item) => (
                <button
                  key={item}
                  className="text-left transition-colors"
                  style={{
                    fontSize: '13px',
                    color: '#315B78',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#027F83';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#315B78';
                  }}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Contact / downloads */}
        <div className="space-y-3">
          <div>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#315B78',
                marginBottom: '4px',
              }}
            >
              Contact us
            </h4>
            <p style={{ fontSize: '13px', color: '#315B78' }}>+91 90000 00000</p>
            <p style={{ fontSize: '13px', color: '#315B78' }}>
              support@sample.com
            </p>
            <p style={{ fontSize: '12px', color: '#999999', marginTop: '4px' }}>
              09:00 AM - 06:00 PM, Mon - Sat
            </p>
          </div>

          <div>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#315B78',
                marginBottom: '6px',
              }}
            >
              Download App
            </h4>
            <div className="flex flex-wrap gap-3">
              {/* Google Play Button */}
              <button
                className="px-3 py-2 rounded-lg border flex items-center gap-2 transition-all hover:shadow-md"
                style={{ 
                  borderColor: '#E5EBEF', 
                  backgroundColor: '#000000',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#027F83';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5EBEF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Google Play Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z"
                    fill="#00D9FF"
                  />
                  <path
                    d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z"
                    fill="#00FF88"
                  />
                  <path
                    d="M14.54 11.15L6.05 2.66L16.81 8.88L14.54 11.15Z"
                    fill="#FFB000"
                  />
                  <path
                    d="M16.81 8.88L20.16 10.55C20.67 10.83 21 11.38 21 12C21 12.62 20.67 13.17 20.16 13.45L16.81 15.12L14.54 12.85L16.81 8.88Z"
                    fill="#FF3C00"
                  />
                </svg>
                <div className="flex flex-col items-start">
                  <span style={{ fontSize: '8px', color: '#FFFFFF', lineHeight: '1' }}>
                    GET IT ON
                  </span>
                  <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600, lineHeight: '1.2' }}>
                    Google Play
                  </span>
                </div>
              </button>

              {/* App Store Button */}
              <button
                className="px-3 py-2 rounded-lg border flex items-center gap-2 transition-all hover:shadow-md"
                style={{ 
                  borderColor: '#E5EBEF', 
                  backgroundColor: '#000000',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#027F83';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5EBEF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Apple Logo */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="flex flex-col items-start">
                  <span style={{ fontSize: '8px', color: '#FFFFFF', lineHeight: '1' }}>
                    Download on the
                  </span>
                  <span style={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 600, lineHeight: '1.2' }}>
                    App Store
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Copyright Bar - Always Visible */}
      <div className="border-t" style={{ borderColor: '#E5EBEF' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs">
          <span style={{ color: '#999999' }}>
            2026 Sample Technologies © All rights reserved
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-end gap-1 px-2 py-1 rounded transition-all ml-auto"
            style={{
              color: '#666',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#027F83';
              e.currentTarget.style.backgroundColor = '#E6F7F7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isCollapsed ? 'Show Footer' : 'Hide Footer'}
          >
            {isCollapsed ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}


