import React from 'react';
import { TrendingUp, DollarSign, Clock, Hammer, BarChart2 } from 'lucide-react';

interface AnalysisResultsProps {
  calculations: {
    estimatedSalePrice: number;
    acquisitionCosts: number;
    holdingCosts: number;
    renovationCosts: number;
    sellingCosts: number;
    totalCosts: number;
    profit: number;
    roi: number;
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ calculations }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getRoiColorClass = (roi: number) => {
    if (roi >= 25) return 'text-green-600';
    if (roi >= 15) return 'text-blue-600';
    if (roi >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <BarChart2 size={20} className="mr-2 text-blue-600" />
          Investment Analysis
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-gray-200">
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Estimated Sale Price</div>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(calculations.estimatedSalePrice)}</div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b sm:border-b-0 sm:border-r border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Total Investment</div>
              <div className="text-xl font-semibold text-gray-900">{formatCurrency(calculations.totalCosts)}</div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">Return on Investment</div>
              <div className={`text-xl font-semibold ${getRoiColorClass(calculations.roi)}`}>
                {calculations.roi.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Investment Breakdown</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Acquisition Costs</h5>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Purchase Price</span>
                  <p className="text-sm font-medium text-gray-900">R$ 500,000.00</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Transfer Taxes (ITBI)</span>
                  <p className="text-sm font-medium text-gray-900">R$ 15,000.00</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Registration</span>
                  <p className="text-sm font-medium text-gray-900">R$ 8,000.00</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Appraisal</span>
                  <p className="text-sm font-medium text-gray-900">R$ 2,000.00</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Acquisition Costs</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(calculations.acquisitionCosts)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Holding Costs</h5>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Condo Fee ({calculations.sellingTimeMonths} months)</span>
                  <p className="text-sm font-medium text-gray-900">R$ 1,500.00</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Property Tax (pro-rated)</span>
                  <p className="text-sm font-medium text-gray-900">R$ 500.00</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Utilities</span>
                  <p className="text-sm font-medium text-gray-900">R$ 300.00</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Insurance</span>
                  <p className="text-sm font-medium text-gray-900">R$ 200.00</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Holding Costs</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(calculations.holdingCosts)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Renovation Costs</h5>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Estimated at {calculations.renovationPercent}% of purchase price</span>
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(calculations.renovationCosts)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Selling Costs</h5>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-gray-500">Broker Commission (5%)</span>
                  <p className="text-sm font-medium text-gray-900">R$ 32,500.00</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Selling Costs</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(calculations.sellingCosts)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-base font-medium text-gray-900">Estimated Profit</h5>
            <span className="text-lg font-semibold text-green-600">{formatCurrency(calculations.profit)}</span>
          </div>
          <p className="text-sm text-gray-500">
            Based on an estimated sale price of {formatCurrency(calculations.estimatedSalePrice)} and 
            total costs of {formatCurrency(calculations.totalCosts)}, this investment is projected to yield 
            a {calculations.roi.toFixed(1)}% return on investment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;