import React from 'react';
import { useThemeStore, useClientsStore } from '../lib/store';
import { Printer, Mail, X } from 'lucide-react';

interface TicketReceiptProps {
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

export default function TicketReceipt({ ticket, clientId, onClose }: TicketReceiptProps) {
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
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50`}>
      <div className={`relative max-w-2xl w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ticket Receipt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              O'MEGA SERVICES
            </h1>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              400 Rue nationale, 69400 Villefranche s/s
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Tel: 0986608980
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Date: {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Number: {ticket.ticketNumber}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Client Information
            </h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Name: {client?.name}
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Phone: {client?.phone}
            </p>
          </div>

          <div className="mb-6">
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Device Information
            </h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Type: {ticket.deviceType}
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Brand: {ticket.brand}
            </p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Tasks: {ticket.tasks.join(', ')}
            </p>
            {ticket.passcode && (
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Passcode: {ticket.passcode}
              </p>
            )}
          </div>

          <div className="mb-6">
            <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Cost
            </h3>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ${ticket.cost}
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="mb-4">
              <img
                src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${ticket.ticketNumber}&scale=2&includetext&backgroundcolor=ffffff00`}
                alt="Barcode"
                className="mx-auto"
              />
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This ticket asserts your guarantee.
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Thank you for your trust.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleEmail}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
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