import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, PenTool as Tool, ShoppingCart, Wrench, Settings, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useThemeStore } from '../lib/store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Tickets', href: '/tickets', icon: Tool },
  { 
    name: 'POS',
    href: '/pos',
    icon: ShoppingCart,
    children: [
      { name: 'Point of Sale', href: '/pos' },
      { name: 'Products', href: '/pos/products' },
      { name: 'Orders', href: '/pos/orders' },
    ],
  },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'POS': true // Default expanded
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <div className="flex h-16 shrink-0 items-center px-6">
        <Wrench className="h-8 w-8 text-indigo-600" />
        {!isCollapsed && <span className="ml-4 text-xl font-semibold">TechFix Pro</span>}
      </div>

      <button 
        onClick={toggleSidebar}
        className={`absolute top-4 -right-4 p-1 rounded-full shadow-md ${
          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'
        }`}
      >
        {isCollapsed ? 
          <ChevronRight className="h-4 w-4" /> : 
          <ChevronLeft className="h-4 w-4" />
        }
      </button>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <div 
                  className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer ${
                    isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => toggleExpand(item.name)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {!isCollapsed && item.name}
                  </div>
                  {!isCollapsed && (
                    expandedItems[item.name] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </div>
                {expandedItems[item.name] && !isCollapsed && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                          }`
                        }
                        end
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                  }`
                }
                end
              >
                <item.icon className="h-5 w-5 mr-3" />
                {!isCollapsed && item.name}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}