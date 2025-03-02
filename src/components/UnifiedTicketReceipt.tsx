import React, { useState } from 'react';
import { useThemeStore, useClientsStore, useTicketsStore, TaskWithPrice } from '../lib/store';
import { Printer, Mail, Download, X, FileText, Receipt } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

interface UnifiedTicketReceiptProps {
  ticket: {
    ticketNumber: string;
    deviceType: string;
    brand: string;
    model: string;
    tasks: string[];
    taskPrices?: TaskWithPrice[]; // Add task prices
    cost: number;
    passcode?: string;
    createdAt: string;
    status: string;
  };
  clientId: string;
  onClose: () => void;
  type?: 'receipt' | 'quote' | 'invoice';
}

export default function UnifiedTicketReceipt({ 
  ticket, 
  clientId, 
  onClose,
  type = 'receipt'
}: UnifiedTicketReceiptProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { clients } = useClientsStore();
  const client = clients.find(c => c.id === clientId);
  
  const [receiptFormat, setReceiptFormat] = useState<'thermal' | 'a4'>('thermal');
  const receiptRef = React.useRef<HTMLDivElement>(null);

  // Calculate tax and total
  const subtotal = ticket.cost;
  const taxRate = 0.20; // 20% VAT
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (client?.email) {
      const subject = `${type === 'quote' ? 'Quote' : type === 'invoice' ? 'Invoice' : 'Repair Ticket'} ${ticket.ticketNumber}`;
      const body = `Please find attached your ${type === 'quote' ? 'quote' : type === 'invoice' ? 'invoice' : 'repair ticket'} details.`;
      window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
    }
  };

  const handleDownload = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${type}_${ticket.ticketNumber}.png`;
      link.click();
    }
  };

  const toggleFormat = () => {
    setReceiptFormat(prevFormat => prevFormat === 'thermal' ? 'a4' : 'thermal');
  };

  const getTitle = () => {
    switch (type) {
      case 'quote': return 'QUOTE';
      case 'invoice': return 'INVOICE';
      default: return 'REPAIR TICKET';
    }
  };

  const renderThermalReceipt = () => (
    <div className="p-4 bg-white text-black" style={{ width: '80mm', margin: '0 auto' }} ref={receiptRef}>
      <div className="text-center mb-4">
        <h1 className="font-bold text-lg">O'MEGA SERVICES</h1>
        <p className="text-xs">400 Rue nationale, 69400 Villefranche s/s</p>
        <p className="text-xs">Tel: 0986608980 | TVA: FR123456789</p>
      </div>

      <div className="border-y border-dashed py-2 my-2">
        <div className="text-center font-bold mb-2">{getTitle()}</div>
        <div className="flex justify-between text-sm">
          <span>Ticket #:</span>
          <span>{ticket.ticketNumber}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span>{format(new Date(ticket.createdAt), 'dd/MM/yyyy')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Time:</span>
          <span>{format(new Date(ticket.createdAt), 'HH:mm')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Status:</span>
          <span>{ticket.status}</span>
        </div>
      </div>

      <div className="my-2">
        <p className="font-bold">Customer:</p>
        <p className="text-sm">{client?.name}</p>
        <p className="text-sm">Tel: {client?.phone}</p>
        {client?.email && <p className="text-sm">{client.email}</p>}
      </div>

      <div className="border-y border-dashed py-2 my-2">
        <p className="font-bold">Device Information:</p>
        <div className="flex justify-between text-sm">
          <span>Type:</span>
          <span>{ticket.deviceType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Brand:</span>
          <span>{ticket.brand}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Model:</span>
          <span>{ticket.model}</span>
        </div>
      </div>

      <div className="my-2">
        <p className="font-bold">Services:</p>
        {ticket.taskPrices ? (
          // Display tasks with their individual prices
          ticket.taskPrices.map((task, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{task.name}</span>
              <span>€{task.price.toFixed(2)}</span>
            </div>
          ))
        ) : (
          // Fallback to evenly distributed prices if taskPrices not available
          ticket.tasks.map((task, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{task}</span>
              <span>€{(ticket.cost / ticket.tasks.length).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-dashed pt-2 my-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>VAT (20%):</span>
          <span>€{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center my-4">
        <QRCodeSVG
          value={JSON.stringify({
            ticket: ticket.ticketNumber,
            total: total,
            date: ticket.createdAt
          })}
          size={80}
          className="mx-auto"
        />
        <p className="text-xs mt-1">Scan to verify {type}</p>
      </div>

      <div className="text-center text-xs mt-4">
        <p>Thank you for your business!</p>
        <p>This {type} serves as proof of service.</p>
        <p>For any questions, please contact us at contact@omegaservices.com</p>
      </div>
    </div>
  );

  const renderA4Receipt = () => (
    <div className="p-8 bg-white text-black" style={{ width: '210mm', maxWidth: '100%' }} ref={receiptRef}>
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
          <h2 className="text-xl font-bold mb-1 text-gray-900">{getTitle()}</h2>
          <p className="text-sm text-gray-600">#{ticket.ticketNumber}</p>
          <p className="text-sm text-gray-600">Date: {format(new Date(ticket.createdAt), 'dd/MM/yyyy')}</p>
          <p className="text-sm text-gray-600">Time: {format(new Date(ticket.createdAt), 'HH:mm')}</p>
          <p className="text-sm text-gray-600">Status: {ticket.status}</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold mb-2 text-gray-900">Customer Information:</h3>
        <p className="text-gray-800">{client?.name}</p>
        <p className="text-gray-800">{client?.address}</p>
        <p className="text-gray-800">Tel: {client?.phone}</p>
        <p className="text-gray-800">{client?.email}</p>
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold mb-2 text-gray-900">Device Information:</h3>
        <table className="w-full mb-4">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-800">Type:</td>
              <td className="py-2 text-gray-800">{ticket.deviceType}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-800">Brand:</td>
              <td className="py-2 text-gray-800">{ticket.brand}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 font-medium text-gray-800">Model:</td>
              <td className="py-2 text-gray-800">{ticket.model}</td>
            </tr>
            {ticket.passcode && (
              <tr className="border-b border-gray-200">
                <td className="py-2 font-medium text-gray-800">Passcode:</td>
                <td className="py-2 text-gray-800">{ticket.passcode}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mb-8">
        <h3 className="font-bold mb-2 text-gray-900">Services:</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-2 text-gray-900">Service</th>
              <th className="text-right py-2 text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody>
            {ticket.taskPrices ? (
              // Display tasks with their individual prices
              ticket.taskPrices.map((task, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 text-gray-800">{task.name}</td>
                  <td className="text-right py-3 text-gray-800">€{task.price.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              // Fallback to evenly distributed prices if taskPrices not available
              ticket.tasks.map((task, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 text-gray-800">{task}</td>
                  <td className="text-right py-3 text-gray-800">€{(ticket.cost / ticket.tasks.length).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={1} className="text-right py-2 font-medium text-gray-800">Subtotal</td>
              <td className="text-right py-2 text-gray-800">€{subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={1} className="text-right py-2 font-medium text-gray-800">VAT (20%)</td>
              <td className="text-right py-2 text-gray-800">€{taxAmount.toFixed(2)}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td colSpan={1} className="text-right py-2 font-bold text-gray-900">Total</td>
              <td className="text-right py-2 font-bold text-gray-900">€{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="font-bold mb-2 text-gray-900">Terms and Conditions:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 pl-4">
            <li>All repairs come with a 90-day warranty.</li>
            <li>Payment is due upon completion of service.</li>
            <li>Unclaimed devices after 30 days will incur storage fees.</li>
            <li>We are not responsible for data loss during repairs.</li>
            <li>This document serves as proof of service.</li>
          </ol>
        </div>
        <div className="text-center">
          <QRCodeSVG
            value={JSON.stringify({
              ticket: ticket.ticketNumber,
              total: total,
              date: ticket.createdAt,
              business: "O'MEGA SERVICES",
              taxId: "FR123456789"
            })}
            size={100}
          />
          <p className="text-xs text-gray-600 mt-1">Scan to verify {type}</p>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-600 border-t border-gray-300 pt-4">
        <p>Thank you for your business!</p>
        <p>For any questions regarding this {type}, please contact us at contact@omegaservices.com</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`relative ${receiptFormat === 'a4' ? 'w-[210mm] max-h-[90vh]' : 'w-120'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-gray-900">
            {receiptFormat === 'thermal' ? 'Thermal Receipt' : 'A4 Format'} - {getTitle()}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-auto">
          {receiptFormat === 'thermal' ? renderThermalReceipt() : renderA4Receipt()}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={toggleFormat}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1"
          >
            {receiptFormat === 'thermal' ? <FileText className="h-4 w-4" /> : <Receipt className="h-4 w-4" />}
            Switch to {receiptFormat === 'thermal' ? 'A4' : 'Thermal'}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          {client?.email && (
            <button
              onClick={handleEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}