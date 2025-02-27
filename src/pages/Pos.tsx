import React, { useState, useEffect } from 'react';
import { useThemeStore, useProductsStore, useClientsStore, useTicketsStore } from '../lib/store';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, FileText, Printer, X, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

// Payment methods
const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'card', name: 'Credit Card', icon: CreditCard },
  { id: 'transfer', name: 'Bank Transfer', icon: FileText },
  { id: 'digital', name: 'Digital Payment', icon: Smartphone },
];

export default function Pos() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { products, categories, searchQuery, selectedCategory, setSearchQuery, setSelectedCategory } = useProductsStore();
  const { clients } = useClientsStore();
  const { tickets } = useTicketsStore();
  
  // Cart state
  const [cart, setCart] = useState<Array<{ product: any; quantity: number }>>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [note, setNote] = useState('');
  const [quickSale, setQuickSale] = useState(false);
  
  // Filtered products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery 
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Filtered clients based on search
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.phone.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  // Filtered tickets based on search and selected client
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticketSearch 
      ? ticket.ticketNumber.toLowerCase().includes(ticketSearch.toLowerCase())
      : true;
    const matchesClient = selectedClient 
      ? ticket.clientId === selectedClient
      : true;
    return matchesSearch && matchesClient;
  });
  
  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const VAT_RATE = 0.20; // 20% VAT
  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount;
  
  // Add product to cart
  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };
  
  // Update cart item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    }
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
    setSelectedClient(null);
    setSelectedTicket(null);
    setClientSearch('');
    setTicketSearch('');
    setPaymentMethod(PAYMENT_METHODS[0].id);
    setNote('');
    setQuickSale(false);
  };
  
  // Generate invoice ID
  const generateInvoiceId = () => {
    const prefix = 'INV';
    const date = format(new Date(), 'yyMMdd');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${date}-${random}`;
  };
  
  // Create invoice
  const createInvoice = () => {
    if (cart.length === 0) return;
    
    // In a real app, you would save this to a database
    const newInvoiceId = generateInvoiceId();
    setInvoiceId(newInvoiceId);
    setShowInvoice(true);
    
    // Here you would typically save the sale to your database
    console.log('Sale created:', {
      invoiceId: newInvoiceId,
      items: cart,
      client: selectedClient ? clients.find(c => c.id === selectedClient) : null,
      ticket: selectedTicket ? tickets.find(t => t.id === selectedTicket) : null,
      subtotal,
      vat: vatAmount,
      total,
      paymentMethod,
      date: new Date().toISOString(),
      note
    });
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Point of Sale
        </h1>
      </div>
      
      {showInvoice ? (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50`}>
          <div className={`relative max-w-4xl w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Invoice
              </h2>
              <button
                onClick={() => {
                  setShowInvoice(false);
                  clearCart();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 receipt-content">
              <div className="flex justify-between mb-8">
                <div className="flex items-center">
                  <div className="mr-4">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 5.5C14 6.88071 12.8807 8 11.5 8C10.1193 8 9 6.88071 9 5.5C9 4.11929 10.1193 3 11.5 3C12.8807 3 14 4.11929 14 5.5Z" fill="#4F46E5"/>
                      <path d="M11.5 9C7.91015 9 5 11.9101 5 15.5C5 19.0899 7.91015 22 11.5 22C15.0899 22 18 19.0899 18 15.5C18 11.9101 15.0899 9 11.5 9Z" fill="#4F46E5"/>
                      <path d="M22 5.5C22 6.88071 20.8807 8 19.5 8C18.1193 8 17 6.88071 17 5.5C17 4.11929 18.1193 3 19.5 3C20.8807 3 22 4.11929 22 5.5Z" fill="#4F46E5"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">O'MEGA SERVICES</h1>
                    <p className="text-sm">400 Rue nationale, 69400 Villefranche s/s</p>
                    <p className="text-sm">Tel: 0986608980</p>
                    <p className="text-sm">Email: contact@omegaservices.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold mb-1">INVOICE</h2>
                  <p className="text-sm">#{invoiceId}</p>
                  <p className="text-sm">Date: {format(new Date(), 'dd/MM/yyyy')}</p>
                  <p className="text-sm">Time: {format(new Date(), 'HH:mm')}</p>
                </div>
              </div>
              
              {!quickSale && selectedClient && (
                <div className="mb-8">
                  <h3 className="font-bold mb-2">Bill To:</h3>
                  {selectedClient && (
                    <>
                      <p>{clients.find(c => c.id === selectedClient)?.name}</p>
                      <p>{clients.find(c => c.id === selectedClient)?.address}</p>
                      <p>Tel: {clients.find(c => c.id === selectedClient)?.phone}</p>
                      <p>{clients.find(c => c.id === selectedClient)?.email}</p>
                    </>
                  )}
                </div>
              )}
              
              {selectedTicket && (
                <div className="mb-8">
                  <h3 className="font-bold mb-2">Related Repair Ticket:</h3>
                  <p>Ticket #{tickets.find(t => t.id === selectedTicket)?.ticketNumber}</p>
                  <p>Device: {tickets.find(t => t.id === selectedTicket)?.deviceType} {tickets.find(t => t.id === selectedTicket)?.brand}</p>
                </div>
              )}
              
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product.id} className="border-b">
                      <td className="py-2">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">{item.product.sku}</p>
                      </td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-right py-2">${item.product.price.toFixed(2)}</td>
                      <td className="text-right py-2">${(item.product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-medium">Subtotal</td>
                    <td className="text-right py-2">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-medium">VAT (20%)</td>
                    <td className="text-right py-2">${vatAmount.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={3} className="text-right py-2 font-bold">Total</td>
                    <td className="text-right py-2 font-bold">${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="mb-8">
                <h3 className="font-bold mb-2">Payment Information:</h3>
                <p>Method: {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}</p>
                <p>Status: Paid</p>
              </div>
              
              {note && (
                <div className="mb-8">
                  <h3 className="font-bold mb-2">Notes:</h3>
                  <p>{note}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-600 border-t pt-4">
                <p className="text-center">Thank you for your business!</p>
                <p className="text-center">For any questions regarding this invoice, please contact us.</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 p-4 border-t">
              <button
                onClick={() => {
                  setShowInvoice(false);
                  clearCart();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Catalog */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700"
                          disabled={product.stock <= 0}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No products found. Try a different search or category.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Cart and Checkout */}
          <div className="space-y-6">
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <ShoppingCart className="h-5 w-5 inline mr-2" />
                  Cart
                </h2>
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-gray-500"
                  disabled={cart.length === 0}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto mb-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex-1">
                        <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.product.name}
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ${item.product.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Subtotal</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>VAT (20%)</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    ${vatAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Total</span>
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Checkout
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="quickSale"
                    checked={quickSale}
                    onChange={(e) => {
                      setQuickSale(e.target.checked);
                      if (e.target.checked) {
                        setSelectedClient(null);
                        setClientSearch('');
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="quickSale" className={`ml-2 block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Quick Sale (No Client Info)
                  </label>
                </div>
                
                {!quickSale && (
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Client
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value);
                          setSelectedClient(null);
                        }}
                        placeholder="Search for a client..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      {clientSearch && !selectedClient && filteredClients.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredClients.map((client) => (
                            <div
                              key={client.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedClient(client.id);
                                setClientSearch(client.name);
                              }}
                            >
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-gray-500">{client.phone}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedClient && (
                  <div>
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      Link to Repair Ticket (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={ticketSearch}
                        onChange={(e) => {
                          setTicketSearch(e.target.value);
                          setSelectedTicket(null);
                        }}
                        placeholder="Search for a ticket..."
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      {ticketSearch && !selectedTicket && filteredTickets.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredTickets.map((ticket) => (
                            <div
                              key={ticket.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedTicket(ticket.id);
                                setTicketSearch(ticket.ticketNumber);
                              }}
                            >
                              <div className="font-medium">#{ticket.ticketNumber}</div>
                              <div className="text-sm text-gray-500">
                                {ticket.deviceType} - {ticket.brand}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center justify-center gap-2 p-3 rounded-md ${
                          paymentMethod === method.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <method.icon className="h-5 w-5" />
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Add a note to this sale..."
                  />
                </div>
                
                <button
                  onClick={createInvoice}
                  disabled={cart.length === 0 || (!quickSale && !selectedClient)}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ArrowRight className="h-5 w-5" />
                  Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}