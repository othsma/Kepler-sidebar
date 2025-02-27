import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Tickets from './pages/Tickets';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Pos from './pages/Pos';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="pos" element={<Pos />} />
          <Route path="pos/products" element={<Products />} />
          <Route path="pos/orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App