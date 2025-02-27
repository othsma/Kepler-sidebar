import React, { useState } from 'react';
import { useThemeStore, useClientsStore } from '../lib/store';
import { Printer, X } from 'lucide-react';

interface InvoiceFormProps {
  ticket: {
    ticketNumber: string;
    deviceType: string;
    brand: string;
    tasks: string[];
    cost: number;
    createdAt: string;
  };
  clientId: string;
  onClose: () => void;
  type: 'quote' | 'invoice';
}

export default function InvoiceForm({ ticket, clientId, onClose, type }: InvoiceFormProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { clients } = useClientsStore();
  const client = clients.find(c => c.id === clientId);
  const [notes, setNotes] = useState('');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className={`relative max-w-3xl w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {type === 'quote' ? 'Quote' : 'Invoice'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="receipt-content">
            <div className="flex justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-2">O'MEGA SERVICES</h1>
                <p>400 Rue nationale</p>
                <p>69400 Villefranche s/s</p>
                <p>Tel: 0986608980</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold mb-2">{type === 'quote' ? 'QUOTE' : 'INVOICE'}</h2>
                <p>#{ticket.ticketNumber}</p>
                <p>Date: {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-2">Bill To:</h3>
              <p>{client?.name}</p>
              <p>{client?.address}</p>
              <p>Tel: {client?.phone}</p>
              <p>{client?.email}</p>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">
                    <p className="font-semibold">{ticket.deviceType} {ticket.brand}</p>
                    <p className="text-sm text-gray-600">Tasks:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {ticket.tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="text-right py-2">${ticket.cost}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td className="py-2 font-bold">Total</td>
                  <td className="text-right py-2 font-bold">${ticket.cost}</td>
                </tr>
              </tfoot>
            </table>

            <div className="mb-8">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={4}
              />
            </div>

            <div className="text-sm text-gray-600">
              <p>Terms and Conditions:</p>
              <ul className="list-disc list-inside">
                <li>Payment is due within 30 days</li>
                <li>This {type === 'quote' ? 'quote' : 'invoice'} is valid for 30 days</li>
                <li>Warranty information provided separately</li>
              </ul>
            </div>
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