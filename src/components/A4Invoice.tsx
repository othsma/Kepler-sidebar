import React from 'react';
import { useThemeStore } from '../lib/store';
import { format } from 'date-fns';
import { Printer, Mail, Download, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';

interface A4InvoiceProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    customer?: {
      name: string;
      email: string;
      address: string;
      phone: string;
      taxId?: string;
    };
    items: Array<{
      id: string;
      name: string;
      sku: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    note?: string;
  };
  onClose: () => void;
}

export default function A4Invoice({ invoice, onClose }: A4InvoiceProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const invoiceRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (invoice.customer?.email) {
      window.location.href = `mailto:${invoice.customer.email}?subject=Invoice ${invoice.invoiceNumber}&body=Please find attached your invoice.`;
    }
  };

  const handleDownload = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `invoice_${invoice.invoiceNumber}.png`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`relative w-[210mm] max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-white' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            A4 Invoice
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 invoice-content" ref={invoiceRef}>
          <div className="flex justify-between mb-8">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-indigo-600 rounded-full"></div>
                  <div className="ml-2">
                    <div className="h-3 w-3 bg-indigo-600 rounded-full"></div>
                    <div className="h-3 w-3 bg-indigo-600 rounded-full mt-1"></div>
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1 text-gray-900">O'MEGA SERVICES</h1>
                <p className="text-sm text-gray-600">400 Rue nationale, 69400 Villefranche s/s</p>
                <p className="text-sm text-gray-600">Tel: 0986608980</p>
                <p className="text-sm text-gray-600">Email: contact@omegaservices.com</p>
                <p className="text-sm text-gray-600">TVA: FR123456789</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-1 text-gray-900">INVOICE</h2>
              <p className="text-sm text-gray-600">#{invoice.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Date: {format(new Date(invoice.date), 'dd/MM/yyyy')}</p>
              <p className="text-sm text-gray-600">Time: {format(new Date(invoice.date), 'HH:mm')}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-bold mb-2 text-gray-900">Bill To:</h3>
            {invoice.customer ? (
              <>
                <p className="text-gray-800">{invoice.customer.name}</p>
                <p className="text-gray-800">{invoice.customer.address}</p>
                <p className="text-gray-800">Tel: {invoice.customer.phone}</p>
                <p className="text-gray-800">{invoice.customer.email}</p>
                {invoice.customer.taxId && (
                  <p className="text-gray-800">Tax ID: {invoice.customer.taxId}</p>
                )}
              </>
            ) : (
              <p className="text-gray-800">Walk-in Customer</p>
            )}
          </div>
          
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 text-gray-900">Item</th>
                <th className="text-center py-2 text-gray-900">Quantity</th>
                <th className="text-right py-2 text-gray-900">Unit Price</th>
                <th className="text-right py-2 text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 text-gray-800">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.sku}</p>
                  </td>
                  <td className="text-center py-3 text-gray-800">{item.quantity}</td>
                  <td className="text-right py-3 text-gray-800">€{item.price.toFixed(2)}</td>
                  <td className="text-right py-3 text-gray-800">€{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right py-2 font-medium text-gray-800">Subtotal</td>
                <td className="text-right py-2 text-gray-800">€{invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right py-2 font-medium text-gray-800">VAT (20%)</td>
                <td className="text-right py-2 text-gray-800">€{invoice.tax.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-gray-300">
                <td colSpan={3} className="text-right py-2 font-bold text-gray-900">Total</td>
                <td className="text-right py-2 font-bold text-gray-900">€{invoice.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div className="mb-8">
            <h3 className="font-bold mb-2 text-gray-900">Payment Information:</h3>
            <p className="text-gray-800">Method: {invoice.paymentMethod}</p>
            <p className="text-gray-800">Status: {invoice.paymentStatus}</p>
          </div>
          
          {invoice.note && (
            <div className="mb-8">
              <h3 className="font-bold mb-2 text-gray-900">Notes:</h3>
              <p className="text-gray-800">{invoice.note}</p>
            </div>
          )}
          
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-bold mb-2 text-gray-900">Terms and Conditions:</h3>
              <ol className="list-decimal list-inside text-sm text-gray-600 pl-4">
                <li>Payment is due within 30 days of invoice date.</li>
                <li>Late payments are subject to a 2% monthly interest charge.</li>
                <li>All products come with a standard 1-year warranty.</li>
                <li>Returns accepted within 14 days with original packaging.</li>
                <li>This invoice serves as proof of purchase.</li>
              </ol>
            </div>
            <div className="text-center">
              <QRCodeSVG
                value={JSON.stringify({
                  invoice: invoice.invoiceNumber,
                  total: invoice.total,
                  date: invoice.date,
                  business: "O'MEGA SERVICES",
                  taxId: "FR123456789"
                })}
                size={100}
              />
              <p className="text-xs text-gray-600 mt-1">Scan to verify invoice</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
            <p>Thank you for your business!</p>
            <p>For any questions regarding this invoice, please contact us at contact@omegaservices.com</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          {invoice.customer?.email && (
            <button
              onClick={handleEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}