import React, { useState } from 'react';
import { useThemeStore, useClientsStore, useTicketsStore, useOrdersStore } from '../lib/store';
import { Search, Plus, Edit2, Trash2, History, PenTool as Tool, ShoppingBag, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import TicketForm from '../components/TicketForm';

export default function Clients() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { clients, searchQuery, setSearchQuery, addClient, updateClient } = useClientsStore();
  const { tickets } = useTicketsStore();
  const { orders } = useOrdersStore();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketClientId, setTicketClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower) ||
      client.address.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateClient(editingClient, formData);
      setEditingClient(null);
    } else {
      addClient(formData);
      setIsAddingClient(false);
    }
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const getClientHistory = (clientId: string) => {
    const clientTickets = tickets.filter(ticket => ticket.clientId === clientId);
    const clientOrders = orders.filter(order => order.clientId === clientId);
    return { tickets: clientTickets, orders: clientOrders };
  };

  const startNewTicket = (clientId: string) => {
    setIsCreatingTicket(true);
    setTicketClientId(clientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Clients
        </h1>
        <button
          onClick={() => setIsAddingClient(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      {(isAddingClient || editingClient) && (
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingClient(false);
                  setEditingClient(null);
                  setFormData({ name: '', email: '', phone: '', address: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingClient ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isCreatingTicket && ticketClientId && (
        <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Ticket for {clients.find(c => c.id === ticketClientId)?.name}
          </h2>
          <TicketForm
            clientId={ticketClientId}
            onSubmit={() => {
              setIsCreatingTicket(false);
              setTicketClientId(null);
            }}
            onCancel={() => {
              setIsCreatingTicket(false);
              setTicketClientId(null);
            }}
          />
        </div>
      )}

      <div className="grid gap-6">
        {filteredClients.map((client) => {
          const { tickets: clientTickets, orders: clientOrders } = getClientHistory(client.id);
          const isSelected = selectedClient === client.id;

          return (
            <div
              key={client.id}
              className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client.name}
                    </h3>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ID: {client.id}
                    </span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {client.email}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {client.phone}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {client.address}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Member since: {format(new Date(client.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startNewTicket(client.id)}
                    className="p-2 text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-full"
                    title="Create New Ticket"
                  >
                    <Tool className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClient(isSelected ? null : client.id);
                    }}
                    className={`p-2 rounded-full ${
                      isSelected
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <History className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingClient(client.id);
                      setFormData({
                        name: client.name,
                        email: client.email,
                        phone: client.phone,
                        address: client.address,
                      });
                    }}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this client?')) {
                        // Implement delete functionality
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {isSelected && (
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Client History
                    </h4>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h5 className={`text-sm font-medium mb-2 flex items-center gap-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <Tool className="h-4 w-4" />
                        Repair Tickets
                      </h5>
                      <div className="space-y-2">
                        {clientTickets.length > 0 ? (
                          clientTickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className={`p-3 rounded-md ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                  {ticket.deviceType} - {ticket.brand}
                                </span>
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  ${ticket.cost}
                                </span>
                              </div>
                              <p className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Tasks: {ticket.tasks.join(', ')}
                              </p>
                              {ticket.issue && (
                                <p className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Issue: {ticket.issue}
                                </p>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Status: {ticket.status}
                                </span>
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No repair tickets yet
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className={`text-sm font-medium mb-2 flex items-center gap-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <ShoppingBag className="h-4 w-4" />
                        Purchase History
                      </h5>
                      <div className="space-y-2">
                        {clientOrders.length > 0 ? (
                          clientOrders.map((order) => (
                            <div
                              key={order.id}
                              className={`p-3 rounded-md ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between">
                                <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                  Order #{order.id}
                                </span>
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  ${order.total}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  Status: {order.status}
                                </span>
                                <span className={`text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No purchase history yet
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}