import { ChevronDown } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  isOpen: boolean;
  onToggle: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select',
  isOpen,
  onToggle,
  dropdownRef
}: CustomDropdownProps) {
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 px-4 rounded-lg border transition-all w-full h-12"
        style={{
          borderColor: isOpen ? '#027F83' : '#CCD8DF',
          backgroundColor: '#FFFFFF',
          fontSize: '14px',
          color: '#315B78'
        }}
      >
        <span className="flex-1 text-left">{displayText}</span>
        <ChevronDown 
          className="w-4 h-4 transition-transform flex-shrink-0" 
          style={{ 
            color: isOpen ? '#027F83' : '#999',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl overflow-hidden z-50 border-2"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#027F83' }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
              className="w-full px-5 py-3 text-left transition-all"
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#222',
                backgroundColor: value === option.value ? '#E6F7F7' : '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
