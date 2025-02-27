import React, { useState, useMemo } from 'react';
import { useThemeStore, useTicketsStore, useClientsStore } from '../lib/store';
import { Search, Plus, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import TicketForm from '../components/TicketForm';
import ThermalReceipt from '../components/ThermalReceipt';
import InvoiceForm from '../components/InvoiceForm';
import ClientForm from '../components/ClientForm';

export default function Tickets() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { tickets, updateTicket, filterStatus, setFilterStatus } = useTicketsStore();
  const { clients } = useClientsStore();
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [newTicketNumber, setNewTicketNumber] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  const filteredTickets = tickets.filter(
    (ticket) => filterStatus === 'all' || ticket.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleNewClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setClientSearch(clients.find(c => c.id === clientId)?.name || '');
    setIsAddingClient(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Repair Tickets
        </h1>
        <button
          onClick={() => setIsAddingTicket(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-md ${
            filterStatus === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-md ${
            filterStatus === 'pending'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('in-progress')}
          className={`px-4 py-2 rounded-md ${
            filterStatus === 'in-progress'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-md ${
            filterStatus === 'completed'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {(isAddingTicket || editingTicket) && (
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {editingTicket ? 'Edit Ticket' : 'Create New Ticket'}
          </h2>
          
          {!editingTicket && !isAddingClient && (
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Client
              </label>
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setSelectedClientId('');
                    }}
                    placeholder="Search for a client..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIsAddingClient(true)}
                    className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    New Client
                  </button>
                </div>
                {clientSearch && !selectedClientId && !isAddingClient && filteredClients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setClientSearch(client.name);
                        }}
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {isAddingClient ? (
            <ClientForm
              onSubmit={handleNewClient}
              onCancel={() => setIsAddingClient(false)}
            />
          ) : (
            <TicketForm
              clientId={editingTicket ? tickets.find(t => t.id === editingTicket)?.clientId : selectedClientId}
              onSubmit={(ticketNumber) => {
                setIsAddingTicket(false);
                setEditingTicket(null);
                setClientSearch('');
                if (ticketNumber) {
                  setNewTicketNumber(ticketNumber);
                  setShowReceipt(true);
                }
              }}
              onCancel={() => {
                setIsAddingTicket(false);
                setEditingTicket(null);
                setClientSearch('');
                setSelectedClientId('');
              }}
              editingTicket={editingTicket}
              initialData={editingTicket ? tickets.find(t => t.id === editingTicket) : undefined}
            />
          )}
        </div>
      )}

      {showReceipt && (
        <ThermalReceipt
          ticket={tickets.find(t => t.ticketNumber === newTicketNumber)!}
          clientId={selectedClientId}
          onClose={() => {
            setShowReceipt(false);
            setNewTicketNumber('');
          }}
        />
      )}

      {showQuote && (
        <InvoiceForm
          ticket={tickets.find(t => t.ticketNumber === newTicketNumber)!}
          clientId={selectedClientId}
          onClose={() => setShowQuote(false)}
          type="quote"
        />
      )}

      {showInvoice && (
        <InvoiceForm
          ticket={tickets.find(t => t.ticketNumber === newTicketNumber)!}
          clientId={selectedClientId}
          onClose={() => setShowInvoice(false)}
          type="invoice"
        />
      )}

      <div className="grid gap-6">
        {filteredTickets.map((ticket) => {
          const client = clients.find((c) => c.id === ticket.clientId);
          return (
            <div
              key={ticket.id}
              className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client?.name} - #{ticket.ticketNumber}
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Device: {ticket.deviceType} ({ticket.brand})
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Tasks: {ticket.tasks.join(', ')}
                    </p>
                    {ticket.issue && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Issue: {ticket.issue}
                      </p>
                    )}
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Cost: ${ticket.cost}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNewTicketNumber(ticket.ticketNumber);
                      setSelectedClientId(ticket.clientId);
                      setShowReceipt(true);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Receipt
                  </button>
                  <button
                    onClick={() => {
                      setNewTicketNumber(ticket.ticketNumber);
                      setSelectedClientId(ticket.clientId);
                      setShowQuote(true);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Quote
                  </button>
                  {ticket.status === 'completed' && (
                    <button
                      onClick={() => {
                        setNewTicketNumber(ticket.ticketNumber);
                        setSelectedClientId(ticket.clientId);
                        setShowInvoice(true);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Invoice
                    </button>
                  )}
                  <button
                    onClick={() => setEditingTicket(ticket.id)}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Edit
                  </button>
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateTicket(ticket.id, {
                        status: e.target.value as 'pending' | 'in-progress' | 'completed',
                      })
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}