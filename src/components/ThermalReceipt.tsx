import React from 'react';
import { useThemeStore } from '../lib/store';
import { Printer, Mail, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ThermalReceiptProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    customer?: {
      name: string;
      email: string;
      address: string;
      phone: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
  };
  onClose: () => void;
}

export default function ThermalReceipt({ invoice, onClose }: ThermalReceiptProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (invoice.customer?.email) {
      window.location.href = `mailto:${invoice.customer.email}?subject=Receipt ${invoice.invoiceNumber}&body=Please find attached your receipt.`;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`relative w-96 ${isDarkMode ? 'bg-white' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Receipt
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="receipt-content" style={{ width: '80mm', margin: '0 auto' }}>
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">O'MEGA SERVICES</h1>
              <div className="text-sm text-gray-600">
                <p>400 Rue nationale</p>
                <p>69400 Villefranche s/s</p>
                <p>Tel: 0986608980</p>
                <p>TVA: FR123456789</p>
              </div>
            </div>

            <div className="border-t border-b border-dashed py-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">Date:</span>
                <span className="text-gray-800">{new Date(invoice.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">Time:</span>
                <span className="text-gray-800">{new Date(invoice.date).toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">Receipt:</span>
                <span className="text-gray-800">#{invoice.invoiceNumber}</span>
              </div>
            </div>

            {invoice.customer && (
              <div className="mb-4 text-sm text-gray-800">
                <p className="font-bold">Customer:</p>
                <p>{invoice.customer.name}</p>
                {invoice.customer.phone && <p>Tel: {invoice.customer.phone}</p>}
              </div>
            )}

            <div className="mb-4">
              <div className="border-b border-dashed pb-2 mb-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-800">Item</span>
                  <span className="text-gray-800">Total</span>
                </div>
              </div>
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span className="text-gray-800">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-gray-800">€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed pt-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">Subtotal:</span>
                <span className="text-gray-800">€{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-800">VAT (20%):</span>
                <span className="text-gray-800">€{invoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-1">
                <span className="text-gray-900">TOTAL:</span>
                <span className="text-gray-900">€{invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-800">Payment Method:</span>
                <span className="text-gray-800">{invoice.paymentMethod}</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <QRCodeSVG
                value={JSON.stringify({
                  receipt: invoice.invoiceNumber,
                  total: invoice.total,
                  date: invoice.date
                })}
                size={80}
                className="mx-auto"
              />
              <p className="text-xs text-gray-600 mt-1">Scan to verify receipt</p>
            </div>

            <div className="text-center text-xs text-gray-600">
              <p>Thank you for your purchase!</p>
              <p>Please keep this receipt for your records</p>
              <p>Returns accepted within 14 days with receipt</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          {invoice.customer?.email && (
            <button
              onClick={handleEmail}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}