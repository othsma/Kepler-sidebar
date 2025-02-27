import React from 'react';
import { useThemeStore } from '../lib/store';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface DailySalesWidgetProps {
  date?: Date;
}

export default function DailySalesWidget({ date = new Date() }: DailySalesWidgetProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  
  // Sample data - in a real app, this would come from your database
  const todaySales = Math.floor(Math.random() * 2000) + 500;
  const yesterdaySales = Math.floor(Math.random() * 2000) + 500;
  const percentChange = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
  const isPositive = percentChange >= 0;
  
  const transactions = Math.floor(Math.random() * 20) + 5;
  const averageTicket = todaySales / transactions;
  
  const paymentMethods = [
    { method: 'Cash', amount: Math.floor(Math.random() * 1000) + 100 },
    { method: 'Credit Card', amount: Math.floor(Math.random() * 1000) + 100 },
    { method: 'Bank Transfer', amount: Math.floor(Math.random() * 500) + 50 },
    { method: 'Digital Payment', amount: Math.floor(Math.random() * 500) + 50 },
  ];
  
  const topProducts = [
    { name: 'iPhone 14', quantity: 3, amount: 2997 },
    { name: 'Samsung Galaxy Tab S8', quantity: 2, amount: 1598 },
    { name: 'Screen Protector', quantity: 5, amount: 99.95 },
    { name: 'USB-C Cable', quantity: 8, amount: 159.92 },
  ];
  
  return (
    <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Daily Sales Summary
        </h2>
        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {format(date, 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Total Sales
          </h3>
          <div className="flex items-center mt-2">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${todaySales.toLocaleString()}
            </p>
            <div className={`ml-2 flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">{Math.abs(percentChange).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Transactions
          </h3>
          <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {transactions}
          </p>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Average Ticket
          </h3>
          <p className={`text-2xl font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ${averageTicket.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Payment Methods
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((payment) => (
              <div key={payment.method} className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {payment.method}
                </span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${payment.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Top Products
          </h3>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div key={product.name} className="flex justify-between items-center">
                <div>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {product.name}
                  </span>
                  <span className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    x{product.quantity}
                  </span>
                </div>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${product.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}