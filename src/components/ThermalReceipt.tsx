import React from 'react';
import { useThemeStore, useClientsStore } from '../lib/store';
import { Printer, Mail, X } from 'lucide-react';

interface ThermalReceiptProps {
  ticket: {
    ticketNumber: string;
    deviceType: string;
    brand: string;
    tasks: string[];
    cost: number;
    passcode?: string;
    createdAt: string;
  };
  clientId: string;
  onClose: () => void;
}

export default function ThermalReceipt({ ticket, clientId, onClose }: ThermalReceiptProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { clients } = useClientsStore();
  const client = clients.find(c => c.id === clientId);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    if (client?.email) {
      window.location.href = `mailto:${client.email}?subject=Repair Ticket ${ticket.ticketNumber}&body=Please find attached your repair ticket details.`;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`relative w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Repair Ticket
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="receipt-content" style={{ width: '80mm', margin: '0 auto' }}>
            <div className="text-center mb-4">
              <h1 className="text-xl font-bold">O'MEGA SERVICES</h1>
              <div className="text-sm">
                <p>400 Rue nationale</p>
                <p>69400 Villefranche s/s</p>
                <p>Tel: 0986608980</p>
              </div>
            </div>

            <div className="border-t border-b border-dashed py-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Date:</span>
                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ticket:</span>
                <span>#{ticket.ticketNumber}</span>
              </div>
            </div>

            <div className="mb-4 text-sm">
              <p className="font-bold">{client?.name}</p>
              <p>Tel: {client?.phone}</p>
            </div>

            <div className="mb-4 text-sm">
              <p>Device: {ticket.deviceType} {ticket.brand}</p>
              <p>Tasks:</p>
              <ul className="list-disc list-inside">
                {ticket.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
              {ticket.passcode && <p>Passcode: {ticket.passcode}</p>}
            </div>

            <div className="border-t border-b border-dashed py-2 mb-4">
              <div className="flex justify-between font-bold">
                <span>TOTAL</span>
                <span>${ticket.cost}</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <img
                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${ticket.ticketNumber}&scale=2&includetext&backgroundcolor=ffffff00`}
                alt="Barcode"
                className="mx-auto mb-2"
              />
              <p className="text-xs">This ticket asserts your guarantee</p>
              <p className="text-xs">Thank you for your trust</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
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