import React from 'react';
import { Settings, Percent, Calendar, Ruler } from 'lucide-react';

interface CalculationParametersProps {
  parameters: {
    renovationPercent: number;
    sellingTimeMonths: number;
    areaMatchTolerance: number;
  };
  onParameterChange: (field: string, value: number) => void;
}

const CalculationParameters: React.FC<CalculationParametersProps> = ({ 
  parameters, 
  onParameterChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Settings size={20} className="mr-2 text-blue-600" />
          Calculation Parameters
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="renovation-percent" className="text-sm font-medium text-gray-700 flex items-center">
              <Percent size={16} className="mr-1 text-gray-400" />
              Renovation Cost (% of purchase)
            </label>
            <span className="text-sm text-gray-500">{parameters.renovationPercent}%</span>
          </div>
          <input
            type="range"
            id="renovation-percent"
            min="5"
            max="30"
            step="1"
            value={parameters.renovationPercent}
            onChange={(e) => onParameterChange('renovationPercent', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5%</span>
            <span>30%</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="selling-time" className="text-sm font-medium text-gray-700 flex items-center">
              <Calendar size={16} className="mr-1 text-gray-400" />
              Selling Time (months)
            </label>
            <span className="text-sm text-gray-500">{parameters.sellingTimeMonths} months</span>
          </div>
          <input
            type="range"
            id="selling-time"
            min="1"
            max="12"
            step="1"
            value={parameters.sellingTimeMonths}
            onChange={(e) => onParameterChange('sellingTimeMonths', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>12</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="area-tolerance" className="text-sm font-medium text-gray-700 flex items-center">
              <Ruler size={16} className="mr-1 text-gray-400" />
              Area Match Tolerance (±%)
            </label>
            <span className="text-sm text-gray-500">±{parameters.areaMatchTolerance}%</span>
          </div>
          <input
            type="range"
            id="area-tolerance"
            min="5"
            max="25"
            step="5"
            value={parameters.areaMatchTolerance}
            onChange={(e) => onParameterChange('areaMatchTolerance', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5%</span>
            <span>25%</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            These parameters affect the ROI calculation. Adjust them to see different scenarios.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculationParameters;