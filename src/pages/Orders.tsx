import React, { useState, useEffect } from 'react';
import { useThemeStore, useOrdersStore, useClientsStore } from '../lib/store';
import { ShoppingCart, Plus, Minus, Trash2, Calendar, Search, X, Save, Filter } from 'lucide-react';
import { format, addDays, isBefore, parseISO } from 'date-fns';

export default function Orders() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { orders, createOrder } = useOrdersStore();
  const { clients } = useClientsStore();
  
  // Order form state
  const [selectedClient, setSelectedClient] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  
  const [orderDate, setOrderDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [deliveryDate, setDeliveryDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [orderStatus, setOrderStatus] = useState('pending');
  const [paymentStatus, setPaymentStatus] = useState('not_paid');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  
  // Order items state
  const [orderItems, setOrderItems] = useState([
    { id: Date.now(), name: '', description: '', quantity: 1, unitPrice: 0, lineTotal: 0 }
  ]);
  
  // Order totals
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate] = useState(0.20); // 20% tax rate
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  // Order list filters
  const [orderListSearch, setOrderListSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Filter clients based on search
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const client = clients.find(c => c.id === order.clientId);
    const matchesSearch = orderListSearch 
      ? (client?.name.toLowerCase().includes(orderListSearch.toLowerCase()) || 
         order.id.toLowerCase().includes(orderListSearch.toLowerCase()))
      : true;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Calculate line totals and order totals
  useEffect(() => {
    const newOrderItems = orderItems.map(item => ({
      ...item,
      lineTotal: item.quantity * item.unitPrice
    }));
    
    const newSubtotal = newOrderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const newTaxAmount = newSubtotal * taxRate;
    const newGrandTotal = newSubtotal + newTaxAmount;
    
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setGrandTotal(newGrandTotal);
    
    // Only update orderItems if they've actually changed
    // This prevents the infinite loop
    if (JSON.stringify(newOrderItems) !== JSON.stringify(orderItems)) {
      setOrderItems(newOrderItems);
    }
  }, [orderItems, taxRate]);
  
  // Handle delivery date validation
  useEffect(() => {
    if (orderDate && deliveryDate) {
      const orderDateObj = parseISO(orderDate);
      const deliveryDateObj = parseISO(deliveryDate);
      
      if (isBefore(deliveryDateObj, orderDateObj)) {
        setDeliveryDate(orderDate);
      }
    }
  }, [orderDate, deliveryDate]);
  
  // Add a new item row
  const addItemRow = () => {
    setOrderItems([
      ...orderItems,
      { id: Date.now(), name: '', description: '', quantity: 1, unitPrice: 0, lineTotal: 0 }
    ]);
  };
  
  // Remove an item row
  const removeItemRow = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };
  
  // Update item quantity
  const updateItemQuantity = (id: number, quantity: number) => {
    if (quantity < 1) quantity = 1;
    
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  // Update item name
  const updateItemName = (id: number, name: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, name } : item
    ));
  };
  
  // Update item description
  const updateItemDescription = (id: number, description: string) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, description } : item
    ));
  };
  
  // Update item price
  const updateItemPrice = (id: number, unitPrice: number) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, unitPrice } : item
    ));
  };
  
  // Save the order
  const saveOrder = () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    
    if (orderItems.some(item => !item.name)) {
      alert('Please provide a name for all items');
      return;
    }
    
    if (orderItems.some(item => item.unitPrice <= 0)) {
      alert('Please provide a valid price for all items');
      return;
    }
    
    // In a real app, you would save this to a database
    const orderData = {
      clientId: selectedClient,
      orderDate,
      deliveryDate,
      orderStatus,
      paymentStatus,
      paymentMethod,
      amountPaid: paymentStatus === 'partially_paid' ? amountPaid : (paymentStatus === 'paid' ? grandTotal : 0),
      items: orderItems.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      subtotal,
      taxAmount,
      grandTotal
    };
    
    console.log('Order saved:', orderData);
    
    // Reset form
    setSelectedClient('');
    setClientSearch('');
    setOrderDate(format(new Date(), 'yyyy-MM-dd'));
    setDeliveryDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
    setOrderStatus('pending');
    setPaymentStatus('not_paid');
    setPaymentMethod('cash');
    setAmountPaid(0);
    setOrderItems([
      { id: Date.now(), name: '', description: '', quantity: 1, unitPrice: 0, lineTotal: 0 }
    ]);
    
    alert('Order saved successfully!');
  };
  
  // Cancel the order form
  const cancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? All data will be lost.')) {
      setSelectedClient('');
      setClientSearch('');
      setOrderDate(format(new Date(), 'yyyy-MM-dd'));
      setDeliveryDate(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
      setOrderStatus('pending');
      setPaymentStatus('not_paid');
      setPaymentMethod('cash');
      setAmountPaid(0);
      setOrderItems([
        { id: Date.now(), name: '', description: '', quantity: 1, unitPrice: 0, lineTotal: 0 }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          In-Store Orders
        </h1>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          New Order
        </h2>
        
        {/* Section 1: Order Details */}
        <div className="mb-8">
          <h3 className={`text-md font-medium mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Order Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Selection */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Customer *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                    if (!e.target.value) {
                      setSelectedClient('');
                    }
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder="Search for a customer..."
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                {selectedClient && (
                  <button
                    onClick={() => {
                      setSelectedClient('');
                      setClientSearch('');
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                
                {showClientDropdown && clientSearch && (
                  <div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto ${
                    isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className={`px-4 py-2 cursor-pointer ${
                            isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => {
                            setSelectedClient(client.id);
                            setClientSearch(client.name);
                            setShowClientDropdown(false);
                          }}
                        >
                          <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {client.name}
                          </div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                            {client.phone}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={`px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        No customers found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Date */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Order Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Delivery Date */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Delivery Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deliveryDate}
                  min={orderDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            {/* Order Status */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Order Status *
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Payment Status */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Payment Status *
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="paid">Paid</option>
                <option value="not_paid">Not Paid</option>
                <option value="partially_paid">Partially Paid</option>
              </select>
            </div>
            
            {/* Amount Paid (only shown if partially paid) */}
            {paymentStatus === 'partially_paid' && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount Paid *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    className={`block w-full pl-7 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>
            )}
            
            {/* Payment Method */}
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Section 2: Order Items */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-md font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Order Items
            </h3>
            <button
              onClick={addItemRow}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Item *
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Description
                  </th>
                  <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Quantity *
                  </th>
                  <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Unit Price *
                  </th>
                  <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Line Total
                  </th>
                  <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {orderItems.map((item, index) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItemName(item.id, e.target.value)}
                        placeholder="Enter item name..."
                        className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItemDescription(item.id, e.target.value)}
                        placeholder="Enter description..."
                        className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className={`p-1 rounded-full ${
                            isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                          }`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                          className={`mx-2 w-16 text-center rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <button
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          className={`p-1 rounded-full ${
                            isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                          className={`block w-full pl-7 text-right rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <input
                          type="text"
                          value={item.lineTotal.toFixed(2)}
                          readOnly
                          className={`block w-full pl-7 text-right rounded-md shadow-sm bg-gray-50 ${
                            isDarkMode ? 'bg-gray-600 border-gray-600 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-500'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => removeItemRow(item.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={orderItems.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Order Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal:</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Tax (20%):</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Grand Total:</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={cancelOrder}
            className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={saveOrder}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Order
          </button>
        </div>
      </div>

      {/* All Orders List with Filtering */}
      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            All Orders
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                value={orderListSearch}
                onChange={(e) => setOrderListSearch(e.target.value)}
                placeholder="Search orders..."
                className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`block rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            <thead>
              <tr>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Order #
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Customer
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Date
                </th>
                <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Status
                </th>
                <th className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const client = clients.find((c) => c.id === order.clientId);
                  return (
                    <tr 
                      key={order.id}
                      className={`hover:bg-gray-50 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}
                    >
                      <td className={`px-4 py-4 whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        #{order.id}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {client?.name || 'Unknown Client'}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'ready_for_pickup' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'ready_for_pickup' ? 'Ready for Pickup' : 
                           order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-right font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className={`px-4 py-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}