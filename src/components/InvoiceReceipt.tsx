import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';
import { useThemeStore } from '../lib/store';
import { Printer, Mail, X } from 'lucide-react';
import A4InvoicePDF from './A4InvoicePDF';

interface InvoiceReceiptProps {
  invoice: {
    invoiceNumber: string;
    date: string;
    customer: {
      name: string;
      email: string;
      address: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
  };
  onClose: () => void;
  format: 'thermal' | 'a4';
}

export default function InvoiceReceipt({ invoice, onClose, format }: InvoiceReceiptProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const handlePrint = () => window.print();
  
  const handleEmail = () => {
    window.location.href = `mailto:${invoice.customer.email}?subject=Invoice ${invoice.invoiceNumber}&body=Attached is your invoice`;
  };

  const thermalContent = (
    <div className="p-4 bg-white text-xs" style={{ width: '80mm' }}>
      <div className="text-center mb-2">
        <h1 className="font-bold text-sm">O'MEGA SERVICES</h1>
        <p className="text-[10px]">400 Rue nationale, 69400 Villefranche s/s</p>
        <p className="text-[10px]">Tel: 0986608980 | TVA: FR123456789</p>
      </div>

      <div className="border-y border-dashed py-2 my-1">
        <div className="flex justify-between">
          <span>Invoice #:</span>
          <span>{invoice.invoiceNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date(invoice.date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mb-2">
        <p className="font-bold">Bill to:</p>
        <p>{invoice.customer.name}</p>
        <p className="text-[10px]">{invoice.customer.address}</p>
      </div>

      <div className="border-y border-dashed py-2 my-1">
        {invoice.items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} x{item.quantity}</span>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="text-right space-y-1">
        <p>Subtotal: €{invoice.subtotal.toFixed(2)}</p>
        <p>Tax (20%): €{invoice.tax.toFixed(2)}</p>
        <p className="font-bold">Total: €{invoice.total.toFixed(2)}</p>
      </div>

      <div className="mt-2 text-center">
        <QRCodeSVG
          value={JSON.stringify({
            invoice: invoice.invoiceNumber,
            total: invoice.total,
            date: invoice.date
          })}
          size={64}
          className="mx-auto"
        />
        <p className="text-[10px] mt-1">Scan to verify invoice</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`relative ${format === 'a4' ? 'w-[210mm]' : 'w-96'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {format === 'thermal' ? 'Invoice Receipt' : 'A4 Invoice'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {format === 'thermal' ? thermalContent : (
            <PDFViewer width="100%" height="500px">
              <A4InvoicePDF invoice={invoice} />
            </PDFViewer>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <PDFDownloadLink
            document={<A4InvoicePDF invoice={invoice} />}
            fileName={`invoice_${invoice.invoiceNumber}.pdf`}
            className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download PDF
          </PDFDownloadLink>
          <button
            onClick={handleEmail}
            className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
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
