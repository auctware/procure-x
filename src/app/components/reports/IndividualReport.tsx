import React, { useState, useEffect } from 'react';
import { Home, ChevronRight, Filter, Download, Table2, BarChart3, LineChart, MapPin } from 'lucide-react';
import BaseReportViewer from './BaseReportViewer';

interface IndividualReportProps {
  reportId: string;
  reportName: string;
  category: 'daily' | 'farmer' | 'procurement' | 'payment';
  columns: string[];
  defaultView?: 'table' | 'chart' | 'graph' | 'map';
}

export default function IndividualReport({
  reportId,
  reportName,
  category,
  columns,
  defaultView = 'table'
}: IndividualReportProps) {
  const [currentView, setCurrentView] = useState<'table' | 'chart' | 'graph' | 'map'>(defaultView);
  const [data, setData] = useState<any[]>([]);

  // Generate mock data for the report
  useEffect(() => {
    const generateData = () => {
      const mockData: any[] = [];
      const states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'];
      const districts = ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Bangalore', 'Ahmedabad', 'Jaipur', 'Ludhiana'];
      const commodities = ['Wheat', 'Rice', 'Paddy', 'Cotton', 'Sugarcane'];
      
      for (let i = 1; i <= 20; i++) {
        mockData.push({
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
      setData(mockData);
    };

    generateData();
  }, [reportId]);

  const categoryColors = {
    daily: { bg: '#E6F7F7', text: '#027F83' },
    farmer: { bg: '#F0FDF4', text: '#00A040' },
    procurement: { bg: '#FFFBF0', text: '#FFA200' },
    payment: { bg: '#FFF5F5', text: '#E94545' }
  };

  return (
    <div className="p-8 overflow-y-auto pb-20" style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', height: '100vh', maxHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Home className="w-4 h-4" style={{ color: '#666' }} />
        <ChevronRight className="w-4 h-4" style={{ color: '#CCD8DF' }} />
        <span style={{ color: '#666' }}>Reports</span>
        <ChevronRight className="w-4 h-4" style={{ color: '#CCD8DF' }} />
        <span style={{ color: '#003A5D', fontWeight: '600' }}>{reportName}</span>
      </div>

      {/* Report Header */}
      <div className="rounded-2xl border-2 shadow-lg overflow-hidden mb-6" style={{ 
        borderColor: '#E5EBEF',
        backgroundColor: '#FFFFFF'
      }}>
        <div className="px-6 py-5 border-b flex items-center justify-between" style={{ 
          borderColor: '#E5EBEF',
          background: `linear-gradient(135deg, ${categoryColors[category].bg} 0%, #FFFFFF 100%)`
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003A5D', marginBottom: '4px' }}>
              {reportName}
            </h1>
            <p style={{ fontSize: '14px', color: '#666' }}>
              {category.charAt(0).toUpperCase() + category.slice(1)} Report
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
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
                const csv = [
                  columns.join(','),
                  ...data.map((row: any) => 
                    columns.map(col => row[col] || '').join(',')
                  )
                ].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${reportName.replace(/\s+/g, '-')}.csv`;
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
              {data.length} records
            </span>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          <BaseReportViewer
            reportId={reportId}
            reportName={reportName}
            category={category}
            data={data}
            columns={columns}
            currentView={currentView}
          />
        </div>
      </div>
    </div>
  );
}
