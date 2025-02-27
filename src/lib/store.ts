import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

interface UserState {
  language: 'en' | 'es' | 'fr';
  setLanguage: (language: 'en' | 'es' | 'fr') => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  language: 'en',
  setLanguage: (language) => set({ language }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

interface ClientsState {
  clients: Client[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
}

const fakeClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    address: '456 Elm St',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Robert Jones',
    email: 'robert.jones@example.com',
    phone: '555-123-4567',
    address: '789 Oak St',
    createdAt: new Date().toISOString(),
  },
];

export const useClientsStore = create<ClientsState>((set) => ({
  clients: fakeClients,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  addClient: (client) =>
    set((state) => ({
      clients: [
        ...state.clients,
        {
          ...client,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  updateClient: (id, updatedClient) =>
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updatedClient } : client
      ),
    })),
}));

interface Model {
  id: string;
  name: string;
  brandId: string;
}

interface TicketSettings {
  deviceTypes: string[];
  brands: string[];
  models: Model[];
  tasks: string[];
}

interface Ticket {
  id: string;
  ticketNumber: string;
  clientId: string;
  deviceType: string;
  brand: string;
  model: string;
  tasks: string[];
  issue?: string;
  status: 'pending' | 'in-progress' | 'completed';
  cost: number;
  technicianId: string;
  passcode?: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketsState {
  tickets: Ticket[];
  settings: TicketSettings;
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, ticket: Partial<Ticket>) => void;
  filterStatus: 'all' | 'pending' | 'in-progress' | 'completed';
  setFilterStatus: (status: 'all' | 'pending' | 'in-progress' | 'completed') => void;
  addDeviceType: (type: string) => void;
  removeDeviceType: (type: string) => void;
  updateDeviceType: (oldType: string, newType: string) => void;
  addBrand: (brand: string) => void;
  removeBrand: (brand: string) => void;
  updateBrand: (oldBrand: string, newBrand: string) => void;
  addModel: (model: { name: string; brandId: string }) => void;
  removeModel: (modelId: string) => void;
  updateModel: (modelId: string, name: string) => void;
  addTask: (task: string) => void;
  removeTask: (task: string) => void;
  updateTask: (oldTask: string, newTask: string) => void;
}

const generateTicketNumber = () => {
  const month = new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${month}${randomNum}`;
};

const fakeTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 'oct1234',
    clientId: '1',
    deviceType: 'Mobile',
    brand: 'Apple',
    model: 'iPhone 14',
    tasks: ['Screen Replacement'],
    issue: 'Cracked screen',
    status: 'in-progress',
    cost: 150,
    technicianId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    ticketNumber: 'oct5678',
    clientId: '2',
    deviceType: 'Tablet',
    brand: 'Samsung',
    model: 'Galaxy Tab S8',
    tasks: ['Battery Replacement'],
    issue: 'Battery draining quickly',
    status: 'pending',
    cost: 100,
    technicianId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    ticketNumber: 'oct9012',
    clientId: '3',
    deviceType: 'PC',
    brand: 'Dell',
    model: 'XPS 13',
    tasks: ['Software Installation'],
    issue: 'Operating system not booting',
    status: 'completed',
    cost: 50,
    technicianId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTicketsStore = create<TicketsState>((set) => ({
  tickets: fakeTickets,
  settings: {
    deviceTypes: ['Mobile', 'Tablet', 'PC', 'Console'],
    brands: ['Apple', 'Samsung', 'Huawei'],
    models: [
      { id: '1', name: 'iPhone 14', brandId: 'Apple' },
      { id: '2', name: 'Galaxy S23', brandId: 'Samsung' },
    ],
    tasks: ['Battery', 'Screen', 'Motherboard', 'Software', 'Camera', 'Speaker'],
  },
  filterStatus: 'all',
  setFilterStatus: (status) => set({ filterStatus: status }),
  addTicket: (ticket) =>
    set((state) => ({
      tickets: [
        ...state.tickets,
        {
          ...ticket,
          id: Math.random().toString(36).substr(2, 9),
          ticketNumber: generateTicketNumber(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateTicket: (id, updatedTicket) =>
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              ...updatedTicket,
              updatedAt: new Date().toISOString(),
            }
          : ticket
      ),
    })),
  addDeviceType: (type) =>
    set((state) => ({
      settings: {
        ...state.settings,
        deviceTypes: [...state.settings.deviceTypes, type],
      },
    })),
  removeDeviceType: (type) =>
    set((state) => ({
      settings: {
        ...state.settings,
        deviceTypes: state.settings.deviceTypes.filter((t) => t !== type),
      },
    })),
  updateDeviceType: (oldType, newType) =>
    set((state) => ({
      settings: {
        ...state.settings,
        deviceTypes: state.settings.deviceTypes.map((t) =>
          t === oldType ? newType : t
        ),
      },
    })),
  addBrand: (brand) =>
    set((state) => ({
      settings: {
        ...state.settings,
        brands: [...state.settings.brands, brand],
      },
    })),
  removeBrand: (brand) =>
    set((state) => ({
      settings: {
        ...state.settings,
        brands: state.settings.brands.filter((b) => b !== brand),
        models: state.settings.models.filter((m) => m.brandId !== brand),
      },
    })),
  updateBrand: (oldBrand, newBrand) =>
    set((state) => ({
      settings: {
        ...state.settings,
        brands: state.settings.brands.map((b) =>
          b === oldBrand ? newBrand : b
        ),
        models: state.settings.models.map((m) =>
          m.brandId === oldBrand ? { ...m, brandId: newBrand } : m
        ),
      },
    })),
  addModel: (model) =>
    set((state) => ({
      settings: {
        ...state.settings,
        models: [
          ...state.settings.models,
          { ...model, id: Math.random().toString(36).substr(2, 9) },
        ],
      },
    })),
  removeModel: (modelId) =>
    set((state) => ({
      settings: {
        ...state.settings,
        models: state.settings.models.filter((m) => m.id !== modelId),
      },
    })),
  updateModel: (modelId, name) =>
    set((state) => ({
      settings: {
        ...state.settings,
        models: state.settings.models.map((m) =>
          m.id === modelId ? { ...m, name } : m
        ),
      },
    })),
  addTask: (task) =>
    set((state) => ({
      settings: {
        ...state.settings,
        tasks: [...state.settings.tasks, task],
      },
    })),
  removeTask: (task) =>
    set((state) => ({
      settings: {
        ...state.settings,
        tasks: state.settings.tasks.filter((t) => t !== task),
      },
    })),
  updateTask: (oldTask, newTask) =>
    set((state) => ({
      settings: {
        ...state.settings,
        tasks: state.settings.tasks.map((t) =>
          t === oldTask ? newTask : t
        ),
      },
    })),
}));

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  imageUrl: string;
}

interface ProductsState {
  products: Product[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  updateStock: (id: string, quantity: number) => void;
}

const fakeProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 14',
    category: 'Phones',
    price: 999,
    stock: 10,
    sku: 'IP14-128',
    description: 'The latest iPhone with a stunning display and powerful camera.',
    imageUrl: 'https://example.com/iphone14.jpg',
  },
  {
    id: '2',
    name: 'Samsung Galaxy Tab S8',
    category: 'Tablets',
    price: 799,
    stock: 5,
    sku: 'SGT-S8',
    description: 'A powerful tablet for work and play.',
    imageUrl: 'https://example.com/galaxytabs8.jpg',
  },
  {
    id: '3',
    name: 'Dell XPS 13',
    category: 'Laptops',
    price: 1299,
    stock: 8,
    sku: 'DXPS13',
    description: 'A lightweight and powerful laptop for professionals.',
    imageUrl: 'https://example.com/dellxps13.jpg',
  },
];

export const useProductsStore = create<ProductsState>((set) => ({
  products: fakeProducts,
  categories: ['Phones', 'Tablets', 'Laptops', 'Accessories'],
  searchQuery: '',
  selectedCategory: 'all',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  addProduct: (product) =>
    set((state) => ({
      products: [
        ...state.products,
        {
          ...product,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    })),
  updateProduct: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    })),
  updateStock: (id, quantity) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, stock: product.stock + quantity }
          : product
      ),
    })),
}));

interface CartItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  clientId: string;
  createdAt: string;
}

interface OrdersState {
  orders: Order[];
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  createOrder: (clientId: string, total: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const fakeOrders: Order[] = [
  {
    id: '1',
    items: [{ productId: '1', quantity: 1 }],
    total: 999,
    status: 'completed',
    clientId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    items: [{ productId: '2', quantity: 1 }],
    total: 799,
    status: 'pending',
    clientId: '2',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    items: [{ productId: '3', quantity: 1 }],
    total: 1299,
    status: 'completed',
    clientId: '3',
    createdAt: new Date().toISOString(),
  },
];

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: fakeOrders,
  cart: [],
  addToCart: (productId, quantity) =>
    set((state) => ({
      cart: [
        ...state.cart.filter((item) => item.productId !== productId),
        { productId, quantity },
      ],
    })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    })),
  clearCart: () => set({ cart: [] }),
  createOrder: (clientId, total) =>
    set((state) => ({
      orders: [
        ...state.orders,
        {
          id: Math.random().toString(36).substr(2, 9),
          items: [...state.cart],
          total,
          status: 'pending',
          clientId,
          createdAt: new Date().toISOString(),
        },
      ],
      cart: [],
    })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),
}));