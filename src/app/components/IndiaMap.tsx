import { Chart } from 'react-google-charts';

interface StateData {
  name: string;
  value: number;
  farmers?: number;
}

interface IndiaMapProps {
  stateData: Record<string, StateData>;
  viewType: 'farmers' | 'procurement';
  onStateClick?: (stateName: string) => void;
}

export default function IndiaMap({ stateData, viewType, onStateClick }: IndiaMapProps) {
  // Convert stateData to Google Charts format
  const data = [
    ['State', viewType === 'procurement' ? 'Procurement (MT)' : 'Farmers'],
    ...Object.entries(stateData).map(([code, info]) => {
      const value = viewType === 'procurement' ? info.value : (info.farmers || 0);
      return [info.name, value];
    })
  ];

  const options = {
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
    legend: 'none'
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Chart
        chartType="GeoChart"
        width="100%"
        height="100%"
        data={data}
        options={options}
        chartEvents={[
          {
            eventName: 'select',
            callback: ({ chartWrapper }) => {
              if (!chartWrapper) return;
              const chart = chartWrapper.getChart();
              const selection = chart.getSelection();
              if (selection.length > 0) {
                const rowIndex = selection[0].row;
                if (rowIndex !== null && rowIndex !== undefined) {
                  const stateName = data[rowIndex + 1]?.[0];
                  if (stateName && onStateClick) {
                    onStateClick(stateName as string);
                  }
                }
              }
            },
          },
        ]}
      />
    </div>
  );
}
