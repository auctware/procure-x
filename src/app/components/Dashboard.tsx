import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Bell, Search, User, Settings, LogOut, 
  LayoutDashboard, Users, ShoppingCart, DollarSign, 
  TrendingUp, Package, FileText, BarChart3, ChevronDown,
  ArrowUpRight, ArrowDownRight, Home, Briefcase, CreditCard, Building2,
  HelpCircle, MoreVertical
} from 'lucide-react';
import logoImage from '../../assets/logo.png';
import DashboardHome from '@/app/components/DashboardHome';
import OrganizationRegistration from '@/app/components/OrganizationRegistration';
import UserRegistration from '@/app/components/UserRegistration';
import UserRegistrationApproval from '@/app/components/UserRegistrationApproval';
import FarmerRegistration from '@/app/components/FarmerRegistration';
import FarmerDetailsView from '@/app/components/FarmerDetailsView';
import FarmerList from '@/app/components/FarmerList';
import LotEntry from '@/app/components/LotEntry';
import CenterDispatch from '@/app/components/CenterDispatch';
import WHRManagement from '@/app/components/WHRManagement';
import CreateCenter from '@/app/components/CreateCenter';
import CreateWarehouse from '@/app/components/CreateWarehouse';
import CommodityCreation from '@/app/components/CommodityCreation';
import FarmerLimitConfiguration from '@/app/components/FarmerLimitConfiguration';
import CenterLimitConfiguration from '@/app/components/CenterLimitConfiguration';
import StateLimitConfiguration from '@/app/components/StateLimitConfiguration';
import InventoryManagement from '@/app/components/InventoryManagement';
import AIReportingDashboard from '@/app/components/AIReportingDashboard';
import UnifiedReportingDashboard from '@/app/components/UnifiedReportingDashboard';
import IndividualReport from '@/app/components/reports/IndividualReport';
import ViewLotEntry from '@/app/components/ViewLotEntry';

interface DashboardProps {
  onLogout: () => void;
}

interface SubSubMenuItem {
  label: string;
  viewName: string;
}

interface SubMenuItem {
  label: string;
  submenuOpen?: boolean;
  submenu?: SubSubMenuItem[];
}

interface MenuItem {
  icon: any;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  submenuOpen?: boolean;
  submenu?: (string | SubMenuItem)[];
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState('Home');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationMenuOpen(false);
      }
    }
    if (notificationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationMenuOpen]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { icon: Home, label: 'Home', active: true, hasSubmenu: false },
    { 
      icon: Users, 
      label: 'User Registration', 
      active: false, 
      hasSubmenu: true, 
      submenuOpen: false,
      submenu: [
        'Organization Registration',
        'User Registration',
        'User Registration Approval',
        'Farmer Registration',
        'View Farmer Details'
      ]
    },
    { 
      icon: ShoppingCart, 
      label: 'Operations', 
      active: false, 
      hasSubmenu: true, 
      submenuOpen: false,
      submenu: [
        'Lot Entry',
        'View Lot Entry',
        'Center Dispatch',
        'WHR Management',
        'Inventory Management'
      ]
    },
    { 
      icon: BarChart3, 
      label: 'AI Reporting', 
      active: false, 
      hasSubmenu: true,
      submenuOpen: false,
      submenu: [
        'Unified Reporting Dashboard',
        'AI Reporting Dashboard',
        '---',
        {
          label: 'Daily Report',
          submenuOpen: false,
          submenu: [
            { label: 'Procurement Status Report', viewName: 'Procurement Status Report' },
            { label: 'Lot Wise Pending Payment', viewName: 'Lot Wise Pending Payment' },
            { label: 'Dispatch Report', viewName: 'Dispatch Report' },
            { label: 'District Wise Procurement', viewName: 'District Wise Procurement' },
            { label: 'WHR Report', viewName: 'WHR Report' }
          ]
        },
        {
          label: 'Farmer Report',
          submenuOpen: false,
          submenu: [
            { label: 'Provisional Registration', viewName: 'Provisional Registration' },
            { label: 'Farmer Summary', viewName: 'Farmer Summary' },
            { label: 'Farmer Land Details', viewName: 'Farmer Land Details' },
            { label: 'Scheme Wise Farmer', viewName: 'Scheme Wise Farmer' },
            { label: 'State Commodity Wise Farmer', viewName: 'State Commodity Wise Farmer' }
          ]
        },
        {
          label: 'Procurement Report',
          submenuOpen: false,
          submenu: [
            { label: 'Procurement Status', viewName: 'Procurement Status' },
            { label: 'SLA Procurement Summary', viewName: 'SLA Procurement Summary' },
            { label: 'WHR Tracker', viewName: 'WHR Tracker' }
          ]
        },
        {
          label: 'Payment Report',
          submenuOpen: false,
          submenu: [
            { label: 'Pending Payment View', viewName: 'Pending Payment View' },
            { label: 'Successful Payment View', viewName: 'Successful Payment View' },
            { label: 'Failed Payment View', viewName: 'Failed Payment View' }
          ]
        }
      ]
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      active: false, 
      hasSubmenu: true, 
      submenuOpen: false,
      submenu: [
        'Create Center',
        'Create Warehouse',
        'Commodity Creation',
        'Farmer Limit Configuration',
        'Center Limit Configuration',
        'State Limit Configuration'
      ]
    },
  ]);

  const toggleSubmenu = (index: number) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
    setMenuItems(menuItems.map((item, i) => 
      i === index ? { ...item, submenuOpen: !item.submenuOpen } : item
    ));
  };

  const stats = [
    {
      label: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: '#00A040'
    },
    {
      label: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: '#027F83'
    },
    {
      label: 'Active Users',
      value: '892',
      change: '+5.4%',
      trend: 'up',
      icon: Users,
      color: '#FFA200'
    },
    {
      label: 'Products',
      value: '456',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: '#003a5d'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Customer One', amount: '₹12,500', status: 'Completed', date: '2024-01-13' },
    { id: 'ORD-002', customer: 'Customer Two', amount: '₹8,900', status: 'Processing', date: '2024-01-13' },
    { id: 'ORD-003', customer: 'Customer Four', amount: '₹15,200', status: 'Pending', date: '2024-01-12' },
    { id: 'ORD-004', customer: 'Customer Five', amount: '₹6,750', status: 'Completed', date: '2024-01-12' },
    { id: 'ORD-005', customer: 'Customer Three', amount: '₹9,800', status: 'Processing', date: '2024-01-11' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#00A040';
      case 'Processing':
        return '#FFA200';
      case 'Pending':
        return '#ED6A6A';
      default:
        return '#666';
    }
  };

  // Get farmer data by ID (mock data - in production, fetch from API)
  const getFarmerDataById = (farmerId: string) => {
    const farmerDataMap: { [key: string]: any } = {
      '1': {
        aadhaarNumber: '900000000001',
        authenticationMethod: 'face' as const,
        consentGiven: true,
        farmerName: 'Farmer One',
        dateOfBirth: '1990-05-15',
        gender: 'Male',
        fatherName: 'Father One',
        address: 'Village: Sample Village, Taluka: Sample Taluka, District: Sample District, State: Maharashtra',
        pincode: '443001',
        mobileNumber: '9000000001',
        emailId: 'farmer1@dummy.com',
        agristackFarmerId: 'AGR900000001',
        state: 'Maharashtra',
        district: 'Buldhana',
        taluka: 'Sangrampur',
        village: 'Sangrampur',
        farmerCategory: 'Small Farmer',
        classCategory: 'General',
        otherBackwardClasses: '',
        surveyNumber: '123/45',
        khataNumber: '73',
        khataDescription: 'व्यक्तिगत खातेदार',
        totalAreaAcre: '2.471',
        totalAreaHa: '1.0',
        actualSowingAreaHa: '0.8',
        convertedSowingAreaAcre: '1.977',
        landType: 'Owned',
        center: 'Center 1',
        landOwnerName: 'Farmer One',
        accountHolderName: 'FARMER ONE',
        ifscCode: 'BANK0000001',
        bankName: 'SAMPLE BANK OF INDIA',
        bankAccountNumber: '900000000001',
        selectedScheme: 'PSS BLACK GRAM URAD PROCUREMENT KHARIF 2025',
        registrationDate: '15 January 2025',
        status: 'Active'
      },
      '2': {
        aadhaarNumber: '900000000002',
        authenticationMethod: 'fingerprint' as const,
        consentGiven: true,
        farmerName: 'Farmer Two',
        dateOfBirth: '1985-03-20',
        gender: 'Male',
        fatherName: 'Father Two',
        address: 'Village: Sample Village Two, Taluka: Sample Taluka, District: Sample District, State: Maharashtra',
        pincode: '411001',
        mobileNumber: '9000000002',
        emailId: 'farmer2@dummy.com',
        agristackFarmerId: 'AGR900000002',
        state: 'Maharashtra',
        district: 'Pune',
        taluka: 'Pune',
        village: 'Pune City',
        farmerCategory: 'Marginal Farmer',
        classCategory: 'OBC',
        otherBackwardClasses: '',
        surveyNumber: '234/56',
        khataNumber: '45',
        khataDescription: 'व्यक्तिगत खातेदार',
        totalAreaAcre: '1.235',
        totalAreaHa: '0.5',
        actualSowingAreaHa: '0.4',
        convertedSowingAreaAcre: '0.988',
        landType: 'Leased',
        center: 'Center 2',
        landOwnerName: 'Farmer Two',
        accountHolderName: 'FARMER TWO',
        ifscCode: 'BANK0000002',
        bankName: 'SAMPLE BANK TWO',
        bankAccountNumber: '900000000002',
        selectedScheme: 'PSS SOYABEAN PROCUREMENT KHARIF 2025',
        registrationDate: '14 January 2025',
        status: 'Active'
      },
      '3': {
        aadhaarNumber: '900000000003',
        authenticationMethod: 'offline' as const,
        consentGiven: true,
        farmerName: 'Farmer Three',
        dateOfBirth: '1992-07-10',
        gender: 'Female',
        fatherName: 'Father Three',
        address: 'Village: Sample Village Three, Taluka: Sample Taluka, District: Sample District, State: Karnataka',
        pincode: '560001',
        mobileNumber: '9000000003',
        emailId: 'farmer3@dummy.com',
        agristackFarmerId: 'AGR900000003',
        state: 'Karnataka',
        district: 'Bangalore',
        taluka: 'Bangalore',
        village: 'Bangalore South',
        farmerCategory: 'Large Farmer',
        classCategory: 'General',
        otherBackwardClasses: '',
        surveyNumber: '345/67',
        khataNumber: '89',
        khataDescription: 'व्यक्तिगत खातेदार',
        totalAreaAcre: '6.177',
        totalAreaHa: '2.5',
        actualSowingAreaHa: '2.0',
        convertedSowingAreaAcre: '4.942',
        landType: 'Owned',
        center: 'Center 3',
        landOwnerName: 'Farmer Three',
        accountHolderName: 'FARMER THREE',
        ifscCode: 'BANK0000003',
        bankName: 'SAMPLE BANK THREE',
        bankAccountNumber: '900000000003',
        selectedScheme: 'PSS GREEN GRAM MOONG PROCUREMENT KHARIF 2025',
        registrationDate: '13 January 2025',
        status: 'Pending'
      }
    };
    
    return farmerDataMap[farmerId] || farmerDataMap['1'];
  };

  return (
    <div className="flex" style={{ backgroundColor: '#FFFFFF', height: '100vh', overflow: 'hidden' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 transition-all duration-300 z-40 flex flex-col ${
          sidebarOpen ? 'w-72' : 'w-0 lg:w-24'
        } ${!sidebarOpen ? 'lg:overflow-hidden' : ''}`}
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderRight: '1px solid #E5EBEF',
          height: '100vh'
        }}
      >
        {/* Home Menu & Collapse Button */}
        <div className="h-20 flex items-center justify-between px-5 border-b" style={{ borderColor: '#E5EBEF' }}>
          {sidebarOpen ? (
            <>
              {(() => {
                const homeItem = menuItems.find(item => item.label === 'Home');
                return homeItem ? (
                  <button
                    onClick={() => {
                      setActiveView(homeItem.label);
                      setMenuItems(menuItems.map((menu) => ({
                        ...menu,
                        active: menu.label === homeItem.label,
                        submenuOpen: false
                      })));
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all flex-1"
                    style={{
                      backgroundColor: homeItem.active ? '#F2FCFB' : 'transparent',
                      color: homeItem.active ? '#027F83' : '#666',
                    }}
                    onMouseEnter={(e) => {
                      if (!homeItem.active) {
                        e.currentTarget.style.backgroundColor = '#F7F9FA';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!homeItem.active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <homeItem.icon className="w-6 h-6" style={{ minWidth: '24px' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>
                      {homeItem.label}
                    </span>
                  </button>
                ) : null;
              })()}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full transition-colors flex items-center justify-center relative"
                style={{ 
                  color: '#222',
                  backgroundColor: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  border: '1px solid #E5EBEF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginTop: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: '#222', marginTop: '2px' }} />
              </button>
            </>
          ) : (
            <>
              {(() => {
                const homeItem = menuItems.find(item => item.label === 'Home');
                return homeItem ? (
                  <button
                    onClick={() => {
                      setActiveView(homeItem.label);
                      setMenuItems(menuItems.map((menu) => ({
                        ...menu,
                        active: menu.label === homeItem.label,
                        submenuOpen: false
                      })));
                    }}
                    className="hidden lg:flex items-center justify-center flex-1 p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: homeItem.active ? '#F2FCFB' : 'transparent',
                      color: homeItem.active ? '#027F83' : '#666',
                    }}
                    onMouseEnter={(e) => {
                      if (!homeItem.active) {
                        e.currentTarget.style.backgroundColor = '#F7F9FA';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!homeItem.active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <homeItem.icon className="w-6 h-6" />
                  </button>
                ) : null;
              })()}
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden lg:block p-2 rounded-full transition-colors flex items-center justify-center relative"
                style={{ 
                  color: '#222',
                  backgroundColor: '#FFFFFF',
                  width: '36px',
                  height: '36px',
                  border: '1px solid #E5EBEF',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginTop: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F9FA';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: '#222', marginTop: '2px' }} />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          {menuItems.filter(item => item.label !== 'Home').map((item, index) => {
            const originalIndex = menuItems.findIndex(m => m.label === item.label);
            return (
            <div key={item.label} className="mb-2">
              <button
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleSubmenu(originalIndex);
                  } else {
                    // Handle menu item click
                    setActiveView(item.label);
                    setMenuItems(menuItems.map((menu, i) => ({
                      ...menu,
                      active: i === originalIndex,
                      submenuOpen: false
                    })));
                  }
                }}
                className="w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl transition-all group"
                style={{
                  backgroundColor: item.active ? '#F2FCFB' : 'transparent',
                  color: item.active ? '#027F83' : '#666',
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <item.icon className="w-6 h-6" style={{ minWidth: '24px' }} />
                  {sidebarOpen && (
                    <span style={{ fontSize: '15px', fontWeight: '600' }} className="truncate">
                      {item.label}
                    </span>
                  )}
                </div>
                {sidebarOpen && item.hasSubmenu && (
                  <ChevronDown 
                    className="w-5 h-5 transition-transform" 
                    style={{ 
                      transform: item.submenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: item.active ? '#027F83' : '#999'
                    }} 
                  />
                )}
              </button>

              {/* Submenu */}
              {item.submenuOpen && sidebarOpen && item.hasSubmenu && (
                <div className="ml-10 mt-2 space-y-1.5">
                  {item.submenu?.map((submenuItem, subIndex) => {
                    // Handle separator
                    if (submenuItem === '---') {
                      return (
                        <div key={`separator-${subIndex}`} className="my-3">
                          <div className="h-px bg-[#E5EBEF] mx-2"></div>
                        </div>
                      );
                    }
                    
                    // Handle string items (direct menu items like "Unified Reporting Dashboard")
                    if (typeof submenuItem === 'string') {
                      return (
                        <button
                          key={`${submenuItem}-${subIndex}`}
                          className="w-full text-left px-4 py-2.5 rounded-lg transition-colors"
                          style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F7F9FA';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => {
                            setActiveView(submenuItem);
                            setMenuItems(menuItems.map((menu, i) => 
                              i === originalIndex ? { ...menu, active: true } : { ...menu, active: false }
                            ));
                          }}
                        >
                          {submenuItem}
                        </button>
                      );
                    }
                    
                    // Handle SubMenuItem objects (nested submenus)
                    const subMenu = submenuItem as SubMenuItem;
                    return (
                      <div key={`${subMenu.label}-${subIndex}`}>
                        <button
                          className="w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center justify-between"
                          style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F7F9FA';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => {
                            setMenuItems(menuItems.map((menu, i) => {
                              if (i === originalIndex) {
                                const updatedSubmenu = menu.submenu?.map((sub) => {
                                  if (typeof sub === 'object' && sub.label === subMenu.label) {
                                    return { ...sub, submenuOpen: !sub.submenuOpen };
                                  }
                                  return sub;
                                });
                                return { ...menu, submenu: updatedSubmenu };
                              }
                              return menu;
                            }));
                          }}
                        >
                          <span>{subMenu.label}</span>
                          <ChevronRight 
                            className={`w-5 h-5 transition-transform ${subMenu.submenuOpen ? 'rotate-90' : ''}`}
                          />
                        </button>
                        
                        {/* Sub-submenu */}
                        {subMenu.submenuOpen && subMenu.submenu && (
                          <div className="ml-6 mt-1.5 space-y-1">
                            {subMenu.submenu.map((subSubItem) => (
                              <button
                                key={subSubItem.viewName}
                                className="w-full text-left px-4 py-2 rounded-lg transition-colors"
                                style={{ 
                                  fontSize: '13px', 
                                  color: activeView === subSubItem.viewName ? '#027F83' : '#666',
                                  fontWeight: activeView === subSubItem.viewName ? '600' : '500',
                                  backgroundColor: activeView === subSubItem.viewName ? '#E6F7F7' : 'transparent'
                                }}
                                onMouseEnter={(e) => {
                                  if (activeView !== subSubItem.viewName) {
                                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (activeView !== subSubItem.viewName) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }
                                }}
                                onClick={() => {
                                  setActiveView(subSubItem.viewName);
                                  setMenuItems(menuItems.map((menu, i) => 
                                    i === originalIndex ? { ...menu, active: true } : { ...menu, active: false }
                                  ));
                                }}
                              >
                                {subSubItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            );
          })}
        </nav>

        {/* Help Section */}
        <div className={`${sidebarOpen ? 'px-4' : 'lg:px-2'} pb-4`}>
          <button
            className={`w-full flex items-center ${sidebarOpen ? 'gap-4' : 'lg:justify-center'} ${sidebarOpen ? 'px-4' : 'lg:px-2'} py-3.5 rounded-xl transition-all`}
            style={{ color: '#666' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F7F9FA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <HelpCircle className="w-6 h-6 flex-shrink-0" style={{ minWidth: '24px' }} />
            {sidebarOpen && (
              <span style={{ fontSize: '15px', fontWeight: '600' }}>
                Help
              </span>
            )}
          </button>
        </div>

        {/* Profile Section */}
        <div 
          className="border-t px-4 py-4"
          style={{ borderColor: '#E5EBEF' }}
        >
          <div className={`flex items-center gap-4 ${!sidebarOpen && 'lg:justify-center'}`}>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: '#E6F7F7', minWidth: '48px' }}
              onClick={() => !sidebarOpen && setUserMenuOpen(!userMenuOpen)}
            >
              <span style={{ color: '#027F83', fontSize: '16px', fontWeight: '700' }}>
                PX
              </span>
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#222', lineHeight: '1.2' }} className="truncate">
                    ProcureX
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: '#666' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F7F9FA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {/* Profile Dropdown - Expanded State */}
                  {userMenuOpen && (
                    <div
                      className="absolute bottom-full right-0 mb-2 w-48 rounded-lg shadow-lg overflow-hidden"
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF' }}
                    >
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{ fontSize: '14px', color: '#666' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F7F9FA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{ fontSize: '14px', color: '#666' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#F7F9FA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <hr style={{ borderColor: '#E5EBEF' }} />
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                        style={{ fontSize: '14px', color: '#E94545' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FFF5F5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Profile Dropdown - Collapsed State */}
            {!sidebarOpen && userMenuOpen && (
              <div
                className="hidden lg:block fixed bottom-4 left-24 w-48 rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF' }}
              >
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ fontSize: '14px', color: '#666' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ fontSize: '14px', color: '#666' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <hr style={{ borderColor: '#E5EBEF' }} />
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ fontSize: '14px', color: '#E94545' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF5F5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Floating Help Button */}
      <button
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        style={{
          backgroundColor: '#027F83',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(2, 127, 131, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#00897B';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(2, 127, 131, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#027F83';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 127, 131, 0.3)';
        }}
        title="Help"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col min-w-0 w-full" 
        style={{ 
          minHeight: '100vh',
          marginLeft: sidebarOpen && isDesktop ? '288px' : (!sidebarOpen && isDesktop ? '96px' : '0px'),
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Header */}
        <header
          className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30"
          style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5EBEF' }}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <img src={logoImage} alt="ProcureX" className="h-16 sm:h-20 lg:h-24 w-auto" />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors flex-shrink-0"
              style={{ color: '#666' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F7F9FA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Search */}
            {/* <div className="hidden md:flex items-center relative">
              <Search
                className="absolute left-3 w-4 h-4"
                style={{ color: '#999' }}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 h-10 rounded-lg border outline-none transition-all"
                style={{
                  borderColor: '#E5EBEF',
                  backgroundColor: '#F7F9FA',
                  fontSize: '14px',
                  color: '#222',
                  width: '300px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#027F83';
                  e.target.style.backgroundColor = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5EBEF';
                  e.target.style.backgroundColor = '#F7F9FA';
                }}
              />
            </div> */}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                className="relative p-2 rounded-lg transition-colors cursor-pointer"
                style={{ 
                  color: '#666',
                  backgroundColor: notificationMenuOpen ? '#F7F9FA' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!notificationMenuOpen) {
                    e.currentTarget.style.backgroundColor = '#F7F9FA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!notificationMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Bell className="w-5 h-5" />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#E94545' }}
                />
              </button>
              
              {/* Notification Dropdown */}
              {notificationMenuOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-80 rounded-lg shadow-xl overflow-hidden z-50 border-2"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E5EBEF',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#E5EBEF' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#222' }}>
                      Notifications
                    </h3>
                  </div>
                  <div className="py-2">
                    {/* Sample Notifications */}
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b" style={{ borderColor: '#F7F9FA' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                        New farmer registration
                      </p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        2 hours ago
                      </p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b" style={{ borderColor: '#F7F9FA' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                        Payment processed
                      </p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        5 hours ago
                      </p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer" style={{ borderColor: '#F7F9FA' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#222', marginBottom: '4px' }}>
                        System update available
                      </p>
                      <p style={{ fontSize: '12px', color: '#666' }}>
                        1 day ago
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t text-center" style={{ borderColor: '#E5EBEF' }}>
                    <button
                      onClick={() => setNotificationMenuOpen(false)}
                      className="text-sm font-semibold transition-colors hover:text-[#027F83]"
                      style={{ color: '#027F83' }}
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            

            {/* Mobile Profile Avatar */}
            <div
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#027F83' }}
            >
              <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                TT
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {activeView === 'Home' && <DashboardHome />}
        {activeView === 'Organization Registration' && <OrganizationRegistration />}
        {activeView === 'User Registration' && <UserRegistration />}
        {activeView === 'User Registration Approval' && <UserRegistrationApproval />}
        {activeView === 'Farmer Registration' && <FarmerRegistration />}
        {activeView === 'View Farmer Details' && !selectedFarmerId && (
          <FarmerList 
            onViewDetails={(farmerId) => setSelectedFarmerId(farmerId)}
          />
        )}
        {activeView === 'View Farmer Details' && selectedFarmerId && (
          <FarmerDetailsView
            farmerData={getFarmerDataById(selectedFarmerId)}
            onBack={() => setSelectedFarmerId(null)}
            onEdit={() => {
              setSelectedFarmerId(null);
              setActiveView('Farmer Registration');
            }}
          />
        )}
        {activeView === 'Lot Entry' && <LotEntry />}
        {activeView === 'View Lot Entry' && <ViewLotEntry />}
        {activeView === 'Center Dispatch' && <CenterDispatch />}
        {activeView === 'WHR Management' && <WHRManagement />}
        {activeView === 'Inventory Management' && <InventoryManagement />}
        {activeView === 'Create Center' && <CreateCenter />}
        {activeView === 'Create Warehouse' && <CreateWarehouse />}
        {activeView === 'Commodity Creation' && <CommodityCreation />}
        {activeView === 'Farmer Limit Configuration' && <FarmerLimitConfiguration />}
        {activeView === 'Center Limit Configuration' && <CenterLimitConfiguration />}
        {activeView === 'State Limit Configuration' && <StateLimitConfiguration />}
        {activeView === 'Unified Reporting Dashboard' && <UnifiedReportingDashboard />}
        {activeView === 'AI Reporting Dashboard' && <AIReportingDashboard />}
        {activeView === 'AI Reporting' && <UnifiedReportingDashboard />}
        
        {/* Daily Reports */}
        {activeView === 'Procurement Status Report' && (
          <IndividualReport
            reportId="procurementStatus"
            reportName="Procurement Status Report"
            category="daily"
            columns={['state', 'season', 'commodity', 'slaName', 'societyName', 'center', 'district', 'centerName', 'farmerId', 'farmerName', 'farmerMobile', 'lotId', 'lotCreatedDate', 'quantityQtl', 'bags', 'valueRs', 'pendingAmount', 'dispatchQuantityQtl', 'pendingQuantityQtl', 'ageInDays', 'whrNumber', 'wspName', 'pendingStageStatus', 'lastPaymentDate', 'lastLiquidationDate', 'symRefNoWithUtrNo']}
            defaultView="graph"
          />
        )}
        {activeView === 'Lot Wise Pending Payment' && (
          <IndividualReport
            reportId="lotPendingPayment"
            reportName="Lot Wise Pending Payment"
            category="daily"
            columns={['lotId', 'farmerId', 'farmerName', 'commodity', 'quantityQtl', 'bags', 'valueRs', 'pendingAmount', 'paymentStatus', 'ageInDays', 'lastPaymentDate', 'paymentStage', 'utrNumber']}
            defaultView="table"
          />
        )}
        {activeView === 'Dispatch Report' && (
          <IndividualReport
            reportId="dispatchReport"
            reportName="Dispatch Report"
            category="daily"
            columns={['state', 'stateAgency', 'pacsFpo', 'district', 'center', 'warehouse', 'dispatchId', 'dispatchQtyQtl', 'dispatchBag', 'replacedLotDispatchQty', 'replacedLotDispatchBag', 'noOfLots', 'valueRs', 'createdDate', 'status']}
            defaultView="table"
          />
        )}
        {activeView === 'District Wise Procurement' && (
          <IndividualReport
            reportId="districtProcurement"
            reportName="District Wise Procurement Status"
            category="daily"
            columns={['state', 'district', 'registeredPacsFpos', 'noOfFarmersRegistered', 'quantityPurchasedMt', 'noOfFarmersBenefited']}
            defaultView="map"
          />
        )}
        {activeView === 'WHR Report' && (
          <IndividualReport
            reportId="whrReport"
            reportName="WHR Report"
            category="daily"
            columns={['state', 'season', 'scheme', 'commodity', 'district', 'sla', 'pacsFpos', 'center', 'warehouse', 'whrDate', 'whrNumber', 'status', 'whrCreatedDate', 'dispatchQuantityQtl', 'dispatchBags', 'acceptedQuantity', 'acceptedBags', 'quantityLossQtl', 'bagsLoss', 'replacedQuantity', 'replacedBags', 'replacedWhrNo', 'rejectedQuantityQtl', 'rejectedBags', 'quantityGainQtl', 'bagsGain', 'creatorRemark', 'rejectRemark']}
            defaultView="table"
          />
        )}
        
        {/* Farmer Reports */}
        {activeView === 'Provisional Registration' && (
          <IndividualReport
            reportId="provisionalRegistration"
            reportName="Provisional Registration"
            category="farmer"
            columns={['stateName', 'districtName', 'taluka', 'village', 'pacsName', 'mobileNumber', 'aadhaarNo', 'farmerName', 'commodity', 'registeredForScheme', 'dataSource', 'registrationDate']}
            defaultView="table"
          />
        )}
        {activeView === 'Farmer Summary' && (
          <IndividualReport
            reportId="farmerSummary"
            reportName="Farmer Summary"
            category="farmer"
            columns={['pacsFpo', 'appliedRegistrations', 'approvedRegistrations', 'revertedRegistrations', 'deemedApproved', 'totalRegistrations']}
            defaultView="chart"
          />
        )}
        {activeView === 'Farmer Land Details' && (
          <IndividualReport
            reportId="farmerLandDetails"
            reportName="Farmer Land Details"
            category="farmer"
            columns={['farmerId', 'farmerName', 'state', 'district', 'taluka', 'village', 'season', 'commodity', 'khataNo', 'surveyNo', 'sowingAreaHectare', 'sowingAreaAcre', 'marketCode']}
            defaultView="table"
          />
        )}
        {activeView === 'Scheme Wise Farmer' && (
          <IndividualReport
            reportId="schemeWiseFarmer"
            reportName="Scheme Wise Farmer Details"
            category="farmer"
            columns={['applicationId', 'farmerId', 'farmerName', 'mobileNumber', 'farmerState', 'farmerDistrict', 'gender', 'casteCategory', 'accountNo', 'ifscCode', 'bankName', 'branchCode', 'branchName', 'schemeStatus', 'pacsFpo', 'center', 'basicDocument', 'bankDocument', 'originalSchemeApplicationReceipt', 'modifiedSchemeApplicationReceipt', 'cropDetails']}
            defaultView="table"
          />
        )}
        {activeView === 'State Commodity Wise Farmer' && (
          <IndividualReport
            reportId="stateCommodityFarmer"
            reportName="State and Commodity Wise Farmer"
            category="farmer"
            columns={['state', 'commodity', 'totalFarmersRegistered', 'activeFarmers', 'totalLandAreaHectare', 'totalProcurementQuantityQtl', 'averageProcurementPerFarmerQtl']}
            defaultView="chart"
          />
        )}
        
        {/* Procurement Reports */}
        {activeView === 'Procurement Status' && (
          <IndividualReport
            reportId="procurementStatus"
            reportName="Procurement Status"
            category="procurement"
            columns={['state', 'district', 'center', 'commodity', 'scheme', 'totalLots', 'totalQuantityQtl', 'totalBags', 'totalValueRs', 'pendingQuantityQtl', 'completedQuantityQtl', 'completionPercentage', 'averageLotSizeQtl', 'status']}
            defaultView="chart"
          />
        )}
        {activeView === 'SLA Procurement Summary' && (
          <IndividualReport
            reportId="slaProcurement"
            reportName="SLA Procurement Summary"
            category="procurement"
            columns={['slaName', 'state', 'district', 'center', 'totalLots', 'totalQuantityQtl', 'slaTargetQuantityQtl', 'achievementPercentage', 'onTimeCompletionRate', 'averageProcessingTimeDays', 'slaComplianceStatus']}
            defaultView="chart"
          />
        )}
        {activeView === 'WHR Tracker' && (
          <IndividualReport
            reportId="whrTracker"
            reportName="WHR Tracker"
            category="procurement"
            columns={['whrNumber', 'whrDate', 'status', 'state', 'district', 'center', 'warehouse', 'dispatchQuantityQtl', 'acceptedQuantityQtl', 'quantityLossQtl', 'quantityGainQtl', 'processingStage', 'currentStageDuration', 'estimatedCompletionDate', 'creator', 'checker', 'approver']}
            defaultView="table"
          />
        )}
        
        {/* Payment Reports */}
        {activeView === 'Pending Payment View' && (
          <IndividualReport
            reportId="pendingPayment"
            reportName="Pending Payment View"
            category="payment"
            columns={['lotId', 'farmerId', 'farmerName', 'commodity', 'quantityQtl', 'valueRs', 'pendingAmount', 'paymentStatus', 'ageInDays', 'lastPaymentDate']}
            defaultView="table"
          />
        )}
        {activeView === 'Successful Payment View' && (
          <IndividualReport
            reportId="successfulPayment"
            reportName="Successful Payment View"
            category="payment"
            columns={['lotId', 'farmerId', 'farmerName', 'commodity', 'quantityQtl', 'valueRs', 'paymentAmount', 'paymentStatus', 'paymentDate', 'utrNumber']}
            defaultView="chart"
          />
        )}
        {activeView === 'Failed Payment View' && (
          <IndividualReport
            reportId="failedPayment"
            reportName="Failed Payment View"
            category="payment"
            columns={['lotId', 'farmerId', 'farmerName', 'commodity', 'quantityQtl', 'valueRs', 'paymentAmount', 'paymentStatus', 'failureReason', 'retryCount']}
            defaultView="table"
          />
        )}
      </div>
    </div>
  );
}