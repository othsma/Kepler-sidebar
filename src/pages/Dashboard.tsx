import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wrench, DollarSign, Clock, CheckCircle, ShoppingCart, Users } from 'lucide-react';
import { useThemeStore, useTicketsStore, useClientsStore, useProductsStore } from '../lib/store';
import { format, subDays } from 'date-fns';
import DailySalesWidget from '../components/DailySalesWidget';

const data = [
  { name: 'Mon', sales: 4000, repairs: 2400 },
  { name: 'Tue', sales: 3000, repairs: 1398 },
  { name: 'Wed', sales: 2000, repairs: 9800 },
  { name: 'Thu', sales: 2780, repairs: 3908 },
  { name: 'Fri', sales: 1890, repairs: 4800 },
  { name: 'Sat', sales: 2390, repairs: 3800 },
  { name: 'Sun', sales: 3490, repairs: 4300 },
];

export default function Dashboard() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { tickets } = useTicketsStore();
  const { clients } = useClientsStore();
  const { products } = useProductsStore();
  
  // Calculate stats
  const pendingTickets = tickets.filter(ticket => ticket.status === 'pending').length;
  const completedTickets = tickets.filter(ticket => ticket.status === 'completed').length;
  const lowStockProducts = products.filter(product => product.stock < 5).length;
  
  const stats = [
    { name: 'Daily Sales', value: '$2,435', icon: DollarSign, color: 'bg-green-500' },
    { name: 'Pending Repairs', value: pendingTickets.toString(), icon: Clock, color: 'bg-yellow-500' },
    { name: 'Completed Repairs', value: completedTickets.toString(), icon: CheckCircle, color: 'bg-blue-500' },
    { name: 'Low Stock Items', value: lowStockProducts.toString(), icon: ShoppingCart, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow p-6`}
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {stat.name}
                </p>
                <p className={`text-2xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DailySalesWidget />

      <div className={`rounded-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Weekly Performance
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#4F46E5" name="Sales ($)" />
              <Bar dataKey="repairs" fill="#10B981" name="Repairs ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Repair Tickets
          </h2>
          <div className="space-y-4">
            {tickets.slice(0, 5).map((ticket) => {
              const client = clients.find(c => c.id === ticket.clientId);
              return (
                <div key={ticket.id} className="flex items-start">
                  <div className={`p-2 rounded-full mr-4 ${
                    ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {client?.name} - {ticket.deviceType} {ticket.brand}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Status: {ticket.status} | ${ticket.cost}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-lg ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow p-6`}>
          <h2 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent Clients
          </h2>
          <div className="space-y-4">
            {clients.slice(0, 5).map((client) => (
              <div key={client.id} className="flex items-start">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full mr-4">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {client.name}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {client.phone} | {format(new Date(client.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}