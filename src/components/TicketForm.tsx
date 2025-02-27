import React, { useState, useEffect } from 'react';
import { useThemeStore, useTicketsStore } from '../lib/store';
import { Plus } from 'lucide-react';

interface TicketFormProps {
  clientId?: string;
  onSubmit: (ticketNumber: string) => void;
  onCancel: () => void;
  editingTicket?: string | null;
  initialData?: {
    deviceType: string;
    brand: string;
    model: string;
    tasks: string[];
    issue: string;
    cost: number;
    passcode: string;
    status: 'pending' | 'in-progress' | 'completed';
  };
}

export default function TicketForm({ clientId, onSubmit, onCancel, editingTicket, initialData }: TicketFormProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { settings, addTicket, updateTicket, addDeviceType, addBrand, addModel, addTask } = useTicketsStore();

  const [deviceTypeSearch, setDeviceTypeSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [formData, setFormData] = useState({
    deviceType: initialData?.deviceType || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    tasks: initialData?.tasks || [],
    issue: initialData?.issue || '',
    cost: initialData?.cost || 0,
    passcode: initialData?.passcode || '',
    status: initialData?.status || 'pending' as const,
  });

  // Get most used tasks
  const [popularTasks, setPopularTasks] = useState<string[]>([]);
  useEffect(() => {
    const tickets = useTicketsStore.getState().tickets;
    const taskCounts = new Map<string, number>();
    tickets.forEach(ticket => {
      ticket.tasks.forEach(task => {
        taskCounts.set(task, (taskCounts.get(task) || 0) + 1);
      });
    });
    const sortedTasks = Array.from(taskCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([task]) => task)
      .slice(0, 6);
    setPopularTasks(sortedTasks);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTicket) {
      updateTicket(editingTicket, { ...formData, clientId });
      onSubmit('');
    } else {
      const ticket = { ...formData, clientId: clientId!, technicianId: '' };
      addTicket(ticket);
      const newTicket = useTicketsStore.getState().tickets[useTicketsStore.getState().tickets.length - 1];
      onSubmit(newTicket.ticketNumber);
    }
  };

  const handleTaskToggle = (task: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.includes(task)
        ? prev.tasks.filter(t => t !== task)
        : [...prev.tasks, task]
    }));
  };

  const handleDeviceTypeSelect = (type: string) => {
    if (!settings.deviceTypes.includes(type)) {
      addDeviceType(type);
    }
    setFormData({ ...formData, deviceType: type });
    setDeviceTypeSearch('');
  };

  const handleBrandSelect = (brand: string) => {
    if (!settings.brands.includes(brand)) {
      addBrand(brand);
    }
    setFormData({ ...formData, brand, model: '' });
    setBrandSearch('');
  };

  const handleAddNewModel = () => {
    if (newModelName.trim() && formData.brand) {
      addModel({ name: newModelName.trim(), brandId: formData.brand });
      setFormData({ ...formData, model: newModelName.trim() });
      setNewModelName('');
      setIsAddingModel(false);
    }
  };

  const filteredDeviceTypes = settings.deviceTypes.filter(type => 
    type.toLowerCase().includes(deviceTypeSearch.toLowerCase())
  );

  const filteredBrands = settings.brands.filter(brand => 
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const availableModels = settings.models.filter(model => 
    model.brandId === formData.brand
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Device Type
        </label>
        <div className="relative">
          <input
            type="text"
            value={deviceTypeSearch || formData.deviceType}
            onChange={(e) => {
              setDeviceTypeSearch(e.target.value);
              if (!e.target.value) {
                setFormData({ ...formData, deviceType: '' });
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search or add new device type"
            required
          />
          {deviceTypeSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
              {filteredDeviceTypes.map((type) => (
                <div
                  key={type}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDeviceTypeSelect(type)}
                >
                  {type}
                </div>
              ))}
              {!filteredDeviceTypes.includes(deviceTypeSearch) && (
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-indigo-600"
                  onClick={() => handleDeviceTypeSelect(deviceTypeSearch)}
                >
                  Add "{deviceTypeSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Brand
        </label>
        <div className="relative">
          <input
            type="text"
            value={brandSearch || formData.brand}
            onChange={(e) => {
              setBrandSearch(e.target.value);
              if (!e.target.value) {
                setFormData({ ...formData, brand: '', model: '' });
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search or add new brand"
            required
          />
          {brandSearch && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
              {filteredBrands.map((brand) => (
                <div
                  key={brand}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleBrandSelect(brand)}
                >
                  {brand}
                </div>
              ))}
              {!filteredBrands.includes(brandSearch) && (
                <div
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-indigo-600"
                  onClick={() => handleBrandSelect(brandSearch)}
                >
                  Add "{brandSearch}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Model
        </label>
        {isAddingModel ? (
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
              placeholder="Enter new model name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddNewModel}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingModel(false);
                setNewModelName('');
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mt-1">
            <select
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select a model</option>
              {availableModels.map((model) => (
                <option key={model.id} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
            {formData.brand && (
              <button
                type="button"
                onClick={() => setIsAddingModel(true)}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                New
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Tasks
        </label>
        <div className="mt-2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {popularTasks.map((task) => (
              <label key={task} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.tasks.includes(task)}
                  onChange={() => handleTaskToggle(task)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{task}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 items-center mt-2">
            <input
              type="text"
              placeholder="Add new task"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();
                  if (value && !formData.tasks.includes(value)) {
                    if (!settings.tasks.includes(value)) {
                      addTask(value);
                    }
                    handleTaskToggle(value);
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Passcode (Optional)
        </label>
        <input
          type="text"
          value={formData.passcode}
          onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Issue Description (Optional)
        </label>
        <textarea
          value={formData.issue}
          onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Estimated Cost
        </label>
        <input
          type="number"
          value={formData.cost}
          onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {editingTicket ? 'Update Ticket' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}