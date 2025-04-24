import React from 'react';

const ROIChart: React.FC = () => {
  // In a real application, this would use a charting library like Chart.js, Recharts, etc.
  // For this demo, we'll create a simple visualization

  // Sample ROI data for the last 6 months
  const roiData = [
    { month: 'Jan', roi: 16.2 },
    { month: 'Feb', roi: 15.8 },
    { month: 'Mar', roi: 17.3 },
    { month: 'Apr', roi: 16.5 },
    { month: 'May', roi: 17.8 },
    { month: 'Jun', roi: 18.7 }
  ];

  // Calculate chart dimensions
  const chartHeight = 220;
  const barWidth = 40;
  const maxROI = Math.max(...roiData.map(d => d.roi));
  const scaleFactor = chartHeight / (maxROI * 1.2); // Leave some space at the top

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex items-end">
        <div className="w-full flex items-end justify-around h-full">
          {roiData.map((data, index) => {
            const barHeight = data.roi * scaleFactor;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 hover:bg-blue-600 rounded-t w-10 transition-all duration-200 relative group"
                  style={{ height: `${barHeight}px` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ROI: {data.roi}%
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2">{data.month}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>6 month trend</div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span>Average ROI: 17.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIChart;