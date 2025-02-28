import React from 'react';
import { useThemeStore } from '../lib/store';
import { Printer, FileText } from 'lucide-react';

interface ReceiptFormatSelectorProps {
  selectedFormat: 'thermal' | 'a4' | 'both';
  onFormatChange: (format: 'thermal' | 'a4' | 'both') => void;
}

export default function ReceiptFormatSelector({ selectedFormat, onFormatChange }: ReceiptFormatSelectorProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Receipt Format
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onFormatChange('thermal')}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md ${
            selectedFormat === 'thermal'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Printer className="h-5 w-5" />
          <span className="text-sm">Thermal Receipt</span>
        </button>
        <button
          type="button"
          onClick={() => onFormatChange('a4')}
          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md ${
            selectedFormat === 'a4'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-sm">A4 Invoice</span>
        </button>
      </div>
    </div>
  );
}