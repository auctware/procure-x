import React from 'react';
import {
  BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { Chart } from 'react-google-charts';
import { Table2, BarChart3, LineChart, MapPin } from 'lucide-react';

export interface ReportViewerProps {
  reportId: string;
  reportName: string;
  category: 'daily' | 'farmer' | 'procurement' | 'payment';
  data: any[];
  columns: string[];
  currentView: 'table' | 'chart' | 'graph' | 'map';
}

export default function BaseReportViewer({
  reportId,
  reportName,
  category,
  data,
  columns,
  currentView
}: ReportViewerProps) {
  // Transform data based on report ID (report-specific)
  const transformData = () => {
    if (!data || data.length === 0) return [];

    // Report-specific transformations based on reportId
    if (reportId.includes('procurementStatus') && category === 'daily') {
      return transformProcurementStatusData();
    } else if (reportId.includes('lotPendingPayment')) {
      return transformLotPendingPaymentData();
    } else if (reportId.includes('dispatchReport')) {
      return transformDispatchReportData();
    } else if (reportId.includes('districtProcurement')) {
      return transformDistrictProcurementData();
    } else if (reportId.includes('whrReport') || reportId.includes('whrTracker')) {
      return transformWHRData();
    } else if (reportId.includes('provisionalRegistration')) {
      return transformProvisionalRegistrationData();
    } else if (reportId.includes('farmerSummary')) {
      return transformFarmerSummaryData();
    } else if (reportId.includes('farmerLandDetails')) {
      return transformFarmerLandDetailsData();
    } else if (reportId.includes('schemeWiseFarmer')) {
      return transformSchemeWiseFarmerData();
    } else if (reportId.includes('stateCommodityFarmer')) {
      return transformStateCommodityFarmerData();
    } else if (reportId.includes('procurementStatus') && category === 'procurement') {
      return transformProcurementStatusProcurementData();
    } else if (reportId.includes('slaProcurement')) {
      return transformSLAProcurementData();
    } else if (reportId.includes('pendingPayment') || reportId.includes('successfulPayment') || reportId.includes('failedPayment')) {
      return transformPaymentData();
    }

    // Fallback to category-specific transformations
    switch (category) {
      case 'daily':
        return transformDailyData();
      case 'farmer':
        return transformFarmerData();
      case 'procurement':
        return transformProcurementData();
      case 'payment':
        return transformPaymentData();
      default:
        return data.slice(0, 10);
    }
  };

  // Report-specific transformation functions for Daily Reports
  const transformProcurementStatusData = () => {
    // Group by state/district for procurement status
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.state || item.district || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          quantityQtl: 0,
          bags: 0,
          valueRs: 0,
          pendingAmount: 0,
          dispatchQuantityQtl: 0,
          pendingQuantityQtl: 0,
          lots: 0
        };
      }
      acc[key].quantityQtl += item.quantityQtl || 0;
      acc[key].bags += item.bags || 0;
      acc[key].valueRs += item.valueRs || 0;
      acc[key].pendingAmount += item.pendingAmount || 0;
      acc[key].dispatchQuantityQtl += item.dispatchQuantityQtl || 0;
      acc[key].pendingQuantityQtl += item.pendingQuantityQtl || 0;
      acc[key].lots += 1;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformLotPendingPaymentData = () => {
    // Group by payment status and date
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.paymentStatus || item.status || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          pendingAmount: 0,
          count: 0,
          quantityQtl: 0,
          valueRs: 0,
          ageInDays: 0
        };
      }
      acc[key].pendingAmount += item.pendingAmount || 0;
      acc[key].count += 1;
      acc[key].quantityQtl += item.quantityQtl || 0;
      acc[key].valueRs += item.valueRs || 0;
      acc[key].ageInDays += item.ageInDays || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformDispatchReportData = () => {
    // Group by center/warehouse for dispatch
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.center || item.warehouse || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          dispatchQtyQtl: 0,
          dispatchBag: 0,
          noOfLots: 0,
          valueRs: 0,
          replacedLotDispatchQty: 0
        };
      }
      acc[key].dispatchQtyQtl += item.dispatchQtyQtl || 0;
      acc[key].dispatchBag += item.dispatchBag || 0;
      acc[key].noOfLots += item.noOfLots || 0;
      acc[key].valueRs += item.valueRs || 0;
      acc[key].replacedLotDispatchQty += item.replacedLotDispatchQty || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformDistrictProcurementData = () => {
    // Group by district for geographic analysis
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.district || item.state || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          quantityPurchasedMt: 0,
          noOfFarmersRegistered: 0,
          noOfFarmersBenefited: 0,
          registeredPacsFpos: 0
        };
      }
      acc[key].quantityPurchasedMt += item.quantityPurchasedMt || 0;
      acc[key].noOfFarmersRegistered += item.noOfFarmersRegistered || 0;
      acc[key].noOfFarmersBenefited += item.noOfFarmersBenefited || 0;
      acc[key].registeredPacsFpos += item.registeredPacsFpos || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformWHRData = () => {
    // Group by warehouse/status for WHR
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.warehouse || item.status || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          dispatchQuantityQtl: 0,
          acceptedQuantity: 0,
          quantityLossQtl: 0,
          quantityGainQtl: 0,
          rejectedQuantityQtl: 0
        };
      }
      acc[key].dispatchQuantityQtl += item.dispatchQuantityQtl || 0;
      acc[key].acceptedQuantity += item.acceptedQuantity || 0;
      acc[key].quantityLossQtl += item.quantityLossQtl || 0;
      acc[key].quantityGainQtl += item.quantityGainQtl || 0;
      acc[key].rejectedQuantityQtl += item.rejectedQuantityQtl || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Report-specific transformation functions for Farmer Reports
  const transformProvisionalRegistrationData = () => {
    // Group by state/district for provisional registrations
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.stateName || item.districtName || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          registrations: 0,
          farmers: 0,
          commodities: new Set()
        };
      }
      acc[key].registrations += 1;
      acc[key].farmers += 1;
      if (item.commodity) acc[key].commodities.add(item.commodity);
      return acc;
    }, {});
    return Object.values(grouped).map((item: any) => ({
      ...item,
      commodityCount: item.commodities.size,
      commodities: undefined
    }));
  };

  const transformFarmerSummaryData = () => {
    // Group by PACS/FPO for farmer summary
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.pacsFpo || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          appliedRegistrations: 0,
          approvedRegistrations: 0,
          revertedRegistrations: 0,
          deemedApproved: 0,
          totalRegistrations: 0
        };
      }
      acc[key].appliedRegistrations += item.appliedRegistrations || 0;
      acc[key].approvedRegistrations += item.approvedRegistrations || 0;
      acc[key].revertedRegistrations += item.revertedRegistrations || 0;
      acc[key].deemedApproved += item.deemedApproved || 0;
      acc[key].totalRegistrations += item.totalRegistrations || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformFarmerLandDetailsData = () => {
    // Group by commodity/season for land details
    const grouped = data.reduce((acc: any, item: any) => {
      const key = `${item.commodity || 'Unknown'}-${item.season || 'Unknown'}`;
      if (!acc[key]) {
        acc[key] = {
          name: item.commodity || 'Unknown',
          season: item.season || 'Unknown',
          sowingAreaHectare: 0,
          sowingAreaAcre: 0,
          farmers: 0
        };
      }
      acc[key].sowingAreaHectare += item.sowingAreaHectare || 0;
      acc[key].sowingAreaAcre += item.sowingAreaAcre || 0;
      acc[key].farmers += 1;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformSchemeWiseFarmerData = () => {
    // Group by scheme status
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.schemeStatus || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          farmers: 0,
          applications: 0
        };
      }
      acc[key].farmers += 1;
      acc[key].applications += 1;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformStateCommodityFarmerData = () => {
    // Group by state and commodity
    const grouped = data.reduce((acc: any, item: any) => {
      const key = `${item.state || 'Unknown'}-${item.commodity || 'Unknown'}`;
      if (!acc[key]) {
        acc[key] = {
          name: `${item.state || 'Unknown'} - ${item.commodity || 'Unknown'}`,
          totalFarmersRegistered: 0,
          activeFarmers: 0,
          totalLandAreaHectare: 0,
          totalProcurementQuantityQtl: 0
        };
      }
      acc[key].totalFarmersRegistered += item.totalFarmersRegistered || 0;
      acc[key].activeFarmers += item.activeFarmers || 0;
      acc[key].totalLandAreaHectare += item.totalLandAreaHectare || 0;
      acc[key].totalProcurementQuantityQtl += item.totalProcurementQuantityQtl || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Report-specific transformation functions for Procurement Reports
  const transformProcurementStatusProcurementData = () => {
    // Group by commodity/center
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.commodity || item.center || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          totalQuantityQtl: 0,
          totalBags: 0,
          totalValueRs: 0,
          completionPercentage: 0,
          totalLots: 0
        };
      }
      acc[key].totalQuantityQtl += item.totalQuantityQtl || 0;
      acc[key].totalBags += item.totalBags || 0;
      acc[key].totalValueRs += item.totalValueRs || 0;
      acc[key].completionPercentage += item.completionPercentage || 0;
      acc[key].totalLots += item.totalLots || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformSLAProcurementData = () => {
    // Group by SLA name
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.slaName || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          totalQuantityQtl: 0,
          slaTargetQuantityQtl: 0,
          achievementPercentage: 0,
          onTimeCompletionRate: 0
        };
      }
      acc[key].totalQuantityQtl += item.totalQuantityQtl || 0;
      acc[key].slaTargetQuantityQtl += item.slaTargetQuantityQtl || 0;
      acc[key].achievementPercentage += item.achievementPercentage || 0;
      acc[key].onTimeCompletionRate += item.onTimeCompletionRate || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  // Fallback transformation functions
  const transformDailyData = () => {
    // Group by date for time series
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.date || item.lotCreatedDate || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          date: key,
          quantity: 0,
          value: 0,
          lots: 0,
          pendingAmount: 0
        };
      }
      acc[key].quantity += item.quantity || item.quantityQtl || 0;
      acc[key].value += item.value || item.valueRs || 0;
      acc[key].lots += 1;
      acc[key].pendingAmount += item.pendingAmount || 0;
      return acc;
    }, {});
    return Object.values(grouped).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const transformFarmerData = () => {
    // Group by state/district for farmer distribution
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.state || item.district || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          farmers: 0,
          registrations: 0,
          landArea: 0,
          procurement: 0
        };
      }
      acc[key].farmers += item.farmers || item.totalFarmersRegistered || 1;
      acc[key].registrations += item.registrations || item.appliedRegistrations || 0;
      acc[key].landArea += item.landArea || item.totalLandAreaHectare || 0;
      acc[key].procurement += item.procurement || item.totalProcurementQuantityQtl || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformProcurementData = () => {
    // Group by commodity/state for procurement analysis
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.commodity || item.state || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          quantity: 0,
          value: 0,
          lots: 0,
          completion: 0
        };
      }
      acc[key].quantity += item.quantity || item.totalQuantityQtl || 0;
      acc[key].value += item.value || item.totalValueRs || 0;
      acc[key].lots += item.lots || item.totalLots || 0;
      acc[key].completion += item.completionPercentage || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformPaymentData = () => {
    // Group by status/date for payment analysis
    const grouped = data.reduce((acc: any, item: any) => {
      const key = item.status || item.paymentStatus || item.date || 'Unknown';
      if (!acc[key]) {
        acc[key] = {
          name: key,
          amount: 0,
          count: 0,
          success: 0,
          failed: 0
        };
      }
      acc[key].amount += item.amount || item.value || item.totalValueRs || 0;
      acc[key].count += 1;
      if (item.status === 'Success' || item.paymentStatus === 'Success') {
        acc[key].success += 1;
      } else if (item.status === 'Failed' || item.paymentStatus === 'Failed') {
        acc[key].failed += 1;
      }
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const transformDataForMap = () => {
    const stateMap: Record<string, { name: string; value: number; farmers?: number }> = {};
    
    data.forEach((item: any) => {
      const state = item.state || item.stateName || 'Unknown';
      if (!stateMap[state]) {
        stateMap[state] = { name: state, value: 0, farmers: 0 };
      }
      
      // Report-specific value calculation
      if (reportId.includes('procurementStatus') && category === 'daily') {
        stateMap[state].value += item.quantityQtl || item.valueRs || 0;
      } else if (reportId.includes('lotPendingPayment')) {
        stateMap[state].value += item.pendingAmount || 0;
      } else if (reportId.includes('dispatchReport')) {
        stateMap[state].value += item.dispatchQtyQtl || 0;
      } else if (reportId.includes('districtProcurement')) {
        stateMap[state].value += item.quantityPurchasedMt || 0;
        stateMap[state].farmers += item.noOfFarmersRegistered || 0;
      } else if (reportId.includes('whrReport') || reportId.includes('whrTracker')) {
        stateMap[state].value += item.dispatchQuantityQtl || item.acceptedQuantity || 0;
      } else {
        stateMap[state].value += item.quantity || item.totalQuantityQtl || item.value || item.valueRs || 0;
        stateMap[state].farmers += item.farmers || item.totalFarmersRegistered || 0;
      }
    });

    return stateMap;
  };

  const getChartColors = () => {
    return [
      '#027F83', '#00A040', '#FFA200', '#E94545', '#6B46C1',
      '#0EA5E9', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'
    ];
  };

  const chartData = transformData();
  const mapData = transformDataForMap();

  // Table View
  if (currentView === 'table') {
    return (
      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: '#E5EBEF' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: '#F7F9FA' }}>
            <tr>
              {columns.slice(0, 10).map((col) => (
                <th 
                  key={col}
                  className="px-4 py-3 text-left"
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: '700', 
                    color: '#777777', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 15).map((row: any, idx: number) => (
              <tr 
                key={idx}
                className="border-t transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E5EBEF' }}
              >
                {columns.slice(0, 10).map((col) => (
                  <td 
                    key={col}
                    className="px-4 py-3"
                    style={{ fontSize: '14px', color: '#315B78' }}
                  >
                    {row[col] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Chart View - Report Specific
  if (currentView === 'chart') {
    return (
      <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF', minHeight: '500px' }}>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Procurement Status Report (Daily) */}
            {reportId.includes('procurementStatus') && category === 'daily' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Procurement Status by Location
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="quantityQtl" fill="#027F83" name="Quantity (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="bags" fill="#00A040" name="Bags" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pendingAmount" fill="#FFA200" name="Pending (₹)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Lot Wise Pending Payment */}
            {reportId.includes('lotPendingPayment') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Pending Payment Analysis
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="pendingAmount" fill="#E94545" name="Pending Amount (₹)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="count" fill="#FFA200" name="Lot Count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                    Payment Status Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="pendingAmount"
                      >
                        {chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {/* Dispatch Report */}
            {reportId.includes('dispatchReport') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Dispatch by Center/Warehouse
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#666' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="dispatchQtyQtl" fill="#027F83" name="Dispatch Qty (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar yAxisId="left" dataKey="dispatchBag" fill="#00A040" name="Dispatch Bags" radius={[8, 8, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="noOfLots" stroke="#6B46C1" strokeWidth={3} dot={{ fill: '#6B46C1', r: 5 }} name="No. of Lots" />
                  </ComposedChart>
                </ResponsiveContainer>
              </>
            )}

            {/* District Wise Procurement */}
            {reportId.includes('districtProcurement') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  District Wise Procurement
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="quantityPurchasedMt" fill="#027F83" name="Quantity (MT)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="noOfFarmersRegistered" fill="#00A040" name="Farmers Registered" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="noOfFarmersBenefited" fill="#6B46C1" name="Farmers Benefited" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {/* WHR Report */}
            {(reportId.includes('whrReport') || reportId.includes('whrTracker')) && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  WHR Status Analysis
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="dispatchQuantityQtl" fill="#027F83" name="Dispatch (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="acceptedQuantity" fill="#00A040" name="Accepted (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="quantityLossQtl" fill="#E94545" name="Loss (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="quantityGainQtl" fill="#6B46C1" name="Gain (QTL)" radius={[8, 8, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Default Daily Reports */}
            {category === 'daily' && !reportId.includes('procurementStatus') && !reportId.includes('lotPendingPayment') && !reportId.includes('dispatchReport') && !reportId.includes('districtProcurement') && !reportId.includes('whr') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Daily Report Overview
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="quantity" fill="#027F83" name="Quantity (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="lots" fill="#00A040" name="Lots" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="pendingAmount" fill="#FFA200" name="Pending (₹)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}

            {category === 'farmer' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Farmer Distribution
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="farmers" fill="#027F83" name="Farmers" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="registrations" fill="#00A040" name="Registrations" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="procurement" fill="#6B46C1" name="Procurement (QTL)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                    Registration Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="farmers"
                      >
                        {chartData.slice(0, 6).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {category === 'procurement' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Procurement by Commodity
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#666' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="quantity" fill="#027F83" name="Quantity (QTL)" radius={[8, 8, 0, 0]} />
                    <Bar yAxisId="left" dataKey="lots" fill="#00A040" name="Lots" radius={[8, 8, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="completion" stroke="#FFA200" strokeWidth={3} dot={{ fill: '#FFA200', r: 5 }} name="Completion %" />
                  </ComposedChart>
                </ResponsiveContainer>
              </>
            )}

            {category === 'payment' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Payment Status Analysis
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Bar dataKey="success" fill="#00A040" name="Successful" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="failed" fill="#E94545" name="Failed" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="count" fill="#027F83" name="Total" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                    Payment Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={chartData.slice(0, 5)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {chartData.slice(0, 5).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCD8DF' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>No Data Available</p>
              <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>Generate a report to view charts</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Graph View - Report Specific
  if (currentView === 'graph') {
    return (
      <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF', minHeight: '500px' }}>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Procurement Status Report (Daily) - Graph */}
            {reportId.includes('procurementStatus') && category === 'daily' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Procurement Status Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="quantityQtl" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Quantity (QTL)" />
                    <Line type="monotone" dataKey="valueRs" stroke="#00A040" strokeWidth={3} dot={{ fill: '#00A040', r: 5 }} activeDot={{ r: 8 }} name="Value (₹)" />
                    <Line type="monotone" dataKey="pendingAmount" stroke="#FFA200" strokeWidth={3} dot={{ fill: '#FFA200', r: 5 }} activeDot={{ r: 8 }} name="Pending (₹)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Lot Wise Pending Payment - Graph */}
            {reportId.includes('lotPendingPayment') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Pending Payment Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="pendingAmount" stroke="#E94545" strokeWidth={3} dot={{ fill: '#E94545', r: 5 }} activeDot={{ r: 8 }} name="Pending Amount (₹)" />
                    <Line type="monotone" dataKey="ageInDays" stroke="#FFA200" strokeWidth={3} dot={{ fill: '#FFA200', r: 5 }} activeDot={{ r: 8 }} name="Avg Age (Days)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Dispatch Report - Graph */}
            {reportId.includes('dispatchReport') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Dispatch Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="dispatchQtyQtl" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Dispatch Qty (QTL)" />
                    <Line type="monotone" dataKey="noOfLots" stroke="#6B46C1" strokeWidth={3} dot={{ fill: '#6B46C1', r: 5 }} activeDot={{ r: 8 }} name="No. of Lots" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {/* District Wise Procurement - Graph */}
            {reportId.includes('districtProcurement') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  District Procurement Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="quantityPurchasedMt" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Quantity (MT)" />
                    <Line type="monotone" dataKey="noOfFarmersBenefited" stroke="#00A040" strokeWidth={3} dot={{ fill: '#00A040', r: 5 }} activeDot={{ r: 8 }} name="Farmers Benefited" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {/* WHR Report - Graph */}
            {(reportId.includes('whrReport') || reportId.includes('whrTracker')) && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  WHR Processing Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="dispatchQuantityQtl" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Dispatch (QTL)" />
                    <Line type="monotone" dataKey="acceptedQuantity" stroke="#00A040" strokeWidth={3} dot={{ fill: '#00A040', r: 5 }} activeDot={{ r: 8 }} name="Accepted (QTL)" />
                    <Line type="monotone" dataKey="quantityLossQtl" stroke="#E94545" strokeWidth={3} dot={{ fill: '#E94545', r: 5 }} activeDot={{ r: 8 }} name="Loss (QTL)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {/* Default Daily Reports - Graph */}
            {category === 'daily' && !reportId.includes('procurementStatus') && !reportId.includes('lotPendingPayment') && !reportId.includes('dispatchReport') && !reportId.includes('districtProcurement') && !reportId.includes('whr') && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Daily Procurement Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="quantity" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Quantity (QTL)" />
                    <Line type="monotone" dataKey="lots" stroke="#00A040" strokeWidth={3} dot={{ fill: '#00A040', r: 5 }} activeDot={{ r: 8 }} name="Lots" />
                  </RechartsLineChart>
                </ResponsiveContainer>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                    Cumulative Procurement
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#027F83" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#027F83" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#666' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="quantity" stroke="#027F83" fillOpacity={1} fill="url(#colorQuantity)" name="Quantity (QTL)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}

            {category === 'farmer' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Farmer Registration Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="farmers" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Farmers" />
                    <Line type="monotone" dataKey="registrations" stroke="#00A040" strokeWidth={3} dot={{ fill: '#00A040', r: 5 }} activeDot={{ r: 8 }} name="Registrations" />
                    <Line type="monotone" dataKey="procurement" stroke="#6B46C1" strokeWidth={3} dot={{ fill: '#6B46C1', r: 5 }} activeDot={{ r: 8 }} name="Procurement (QTL)" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {category === 'procurement' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Procurement Progress Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="quantity" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Quantity (QTL)" />
                    <Line type="monotone" dataKey="completion" stroke="#FFA200" strokeWidth={3} dot={{ fill: '#FFA200', r: 5 }} activeDot={{ r: 8 }} name="Completion %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}

            {category === 'payment' && (
              <>
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#003A5D' }}>
                  Payment Trends
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5EBEF" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#666' }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 12, fill: '#666' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5EBEF', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#027F83" strokeWidth={3} dot={{ fill: '#027F83', r: 5 }} activeDot={{ r: 8 }} name="Amount (₹)" />
                    <Line type="monotone" dataKey="success" stroke="#00A040" strokeWidth={3} dot={{ fill: '#00A040', r: 5 }} activeDot={{ r: 8 }} name="Successful" />
                    <Line type="monotone" dataKey="failed" stroke="#E94545" strokeWidth={3} dot={{ fill: '#E94545', r: 5 }} activeDot={{ r: 8 }} name="Failed" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <LineChart className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCD8DF' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>No Data Available</p>
              <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>Generate a report to view graphs</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Map View - Report Specific
  if (currentView === 'map') {
    const getMapTitle = () => {
      if (reportId.includes('procurementStatus') && category === 'daily') return 'Procurement Status by State';
      if (reportId.includes('lotPendingPayment')) return 'Pending Payments by State';
      if (reportId.includes('dispatchReport')) return 'Dispatch Distribution by State';
      if (reportId.includes('districtProcurement')) return 'District Wise Procurement Map';
      if (reportId.includes('whrReport') || reportId.includes('whrTracker')) return 'WHR Distribution by State';
      if (category === 'farmer') return 'Farmer Distribution by State';
      return 'Geographic Distribution';
    };

    const getMapLabel = () => {
      if (reportId.includes('procurementStatus') && category === 'daily') return 'Procurement (QTL)';
      if (reportId.includes('lotPendingPayment')) return 'Pending Amount (₹)';
      if (reportId.includes('dispatchReport')) return 'Dispatch (QTL)';
      if (reportId.includes('districtProcurement')) return 'Procurement (MT)';
      if (reportId.includes('whrReport') || reportId.includes('whrTracker')) return 'WHR Quantity (QTL)';
      if (category === 'farmer') return 'Farmers';
      return 'Value';
    };

    return (
      <div className="p-6 rounded-xl border-2" style={{ borderColor: '#E5EBEF', backgroundColor: '#FFFFFF', minHeight: '500px' }}>
        {Object.keys(mapData).length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#003A5D' }}>
                {getMapTitle()}
              </h3>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#666' }}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E5EBEF' }}></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B3C9F9' }}></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6B46C1' }}></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#027F83' }}></div>
                  <span>Very High</span>
                </div>
              </div>
            </div>
            <div style={{ height: '500px', width: '100%' }}>
              <Chart
                chartType="GeoChart"
                width="100%"
                height="500px"
                data={[
                  ['State', getMapLabel()],
                  ...Object.entries(mapData).map(([code, info]) => [
                    info.name,
                    category === 'farmer' || reportId.includes('districtProcurement') ? info.farmers || 0 : info.value
                  ])
                ]}
                options={{
                  region: 'IN',
                  displayMode: 'regions',
                  resolution: 'provinces',
                  colorAxis: {
                    colors: ['#E5EBEF', '#B3C9F9', '#6B46C1', '#027F83']
                  },
                  backgroundColor: '#FAFBFC',
                  datalessRegionColor: '#E5EBEF',
                  defaultColor: '#E5EBEF',
                  tooltip: {
                    textStyle: {
                      fontSize: 13,
                      color: '#222'
                    },
                    showColorCode: false
                  },
                  legend: {
                    textStyle: {
                      color: '#666',
                      fontSize: 12
                    }
                  },
                  keepAspectRatio: true
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: '#CCD8DF' }} />
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#666' }}>No Data Available</p>
              <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>Generate a report to view geographic distribution</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
