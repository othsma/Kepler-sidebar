import React, { useState, useMemo } from 'react';
import { useThemeStore, useTicketsStore, useClientsStore } from '../lib/store';
import { Search, Plus, Clock, AlertTriangle, CheckCircle, FileText, Filter, Calendar, User, Edit, Printer, FileText as FileIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import TicketForm from '../components/TicketForm';
import UnifiedTicketReceipt from '../components/UnifiedTicketReceipt';
import ClientForm from '../components/ClientForm';

export default function Tickets() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { tickets, updateTicket, filterStatus, setFilterStatus } = useTicketsStore();
  const { clients } = useClientsStore();
  const [isAddingTicket, setIsAddingTicket] = useState(true); // Default to true to show the form first
  const [editingTicket, setEditingTicket] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [newTicketNumber, setNewTicketNumber] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      client.email.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  const filteredTickets = tickets.filter(
    (ticket) => {
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      const matchesSearch = searchQuery 
        ? ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clients.find(c => c.id === ticket.clientId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          false
        : true;
      return matchesStatus && matchesSearch;
    }
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Completed</span>;
      default:
        return null;
    }
  };

  const handleNewClient = (clientId: string) => {
    // Find the client name to display in the search field
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClientId(clientId);
      setClientSearch(client.name);
    } else {
      // If client not found in the current state, fetch it directly from the store
      const storeClients = useClientsStore.getState().clients;
      const storeClient = storeClients.find(c => c.id === clientId);
      if (storeClient) {
        setSelectedClientId(clientId);
        setClientSearch(storeClient.name);
      }
    }
    setIsAddingClient(false);
  };

  const handleTicketSubmit = (ticketNumber: string) => {
    setIsAddingTicket(false);
    setEditingTicket(null);
    setClientSearch('');
    
    if (ticketNumber) {
      setNewTicketNumber(ticketNumber);
      setShowReceipt(true);
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      // In a real app, you would implement the delete functionality here
      console.log('Deleting ticket:', ticketId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Repair Tickets
        </h1>
        <button
          onClick={() => setIsAddingTicket(!isAddingTicket)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {isAddingTicket ? 'Hide Form' : 'New Ticket'}
        </button>
      </div>

      {/* Create New Ticket Section - Now displayed first */}
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
              onSubmit={handleTicketSubmit}
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

      {/* Tickets Table Section */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ticket #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Device
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tasks
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Cost
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const client = clients.find((c) => c.id === ticket.clientId);
                  
                  // Display task prices if available
                  const taskPriceDisplay = ticket.taskPrices ? 
                    ticket.taskPrices.map(tp => `${tp.name} ($${tp.price})`).join(', ') :
                    ticket.tasks.join(', ');
                  
                  return (
                    <tr key={ticket.id} className={`hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        #{ticket.ticketNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {client?.name || 'Unknown Client'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {ticket.deviceType} - {ticket.brand}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                        {taskPriceDisplay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${ticket.cost}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={ticket.status}
                          onChange={(e) =>
                            updateTicket(ticket.id, {
                              status: e.target.value as 'pending' | 'in-progress' | 'completed',
                            })
                          }
                          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-3">
                          {/* Edit button */}
                          <button
                            onClick={() => setEditingTicket(ticket.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          
                          {/* Thermal Receipt button */}
                          <button
                            onClick={() => {
                              setNewTicketNumber(ticket.ticketNumber);
                              setSelectedClientId(ticket.clientId);
                              setShowReceipt(true);
                            }}
                            className="text-green-600 hover:text-green-800"
                            title="Print Receipt"
                          >
                            <Printer className="h-5 w-5" />
                          </button>
                          
                          {/* Invoice button */}
                          <button
                            onClick={() => {
                              setNewTicketNumber(ticket.ticketNumber);
                              setSelectedClientId(ticket.clientId);
                              setShowInvoice(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Generate Invoice"
                          >
                            <FileIcon className="h-5 w-5" />
                          </button>
                          
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showReceipt && newTicketNumber && (
        <UnifiedTicketReceipt
          ticket={tickets.find(t => t.ticketNumber === newTicketNumber)!}
          clientId={selectedClientId}
          onClose={() => {
            setShowReceipt(false);
            setNewTicketNumber('');
          }}
          type="receipt"
        />
      )}

      {showQuote && newTicketNumber && (
        <UnifiedTicketReceipt
          ticket={tickets.find(t => t.ticketNumber === newTicketNumber)!}
          clientId={selectedClientId}
          onClose={() => setShowQuote(false)}
          type="quote"
        />
      )}

      {showInvoice && newTicketNumber && (
        <UnifiedTicketReceipt
          ticket={tickets.find(t => t.ticketNumber === newTicketNumber)!}
          clientId={selectedClientId}
          onClose={() => setShowInvoice(false)}
          type="invoice"
        />
      )}
    </div>
  );
}