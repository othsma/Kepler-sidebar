import React, { useState } from 'react';
import { useThemeStore, useTicketsStore } from '../lib/store';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Settings() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const {
    settings,
    addDeviceType,
    removeDeviceType,
    updateDeviceType,
    addBrand,
    removeBrand,
    updateBrand,
    addModel,
    removeModel,
    updateModel,
    addTask,
    removeTask,
    updateTask,
  } = useTicketsStore();

  const [newDeviceType, setNewDeviceType] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState({ name: '', brandId: '' });
  const [newTask, setNewTask] = useState('');
  const [editingItem, setEditingItem] = useState<{ type: string; value: string; id?: string }>({ type: '', value: '' });

  const handleSubmit = (type: string) => {
    switch (type) {
      case 'deviceType':
        if (newDeviceType.trim()) {
          addDeviceType(newDeviceType.trim());
          setNewDeviceType('');
        }
        break;
      case 'brand':
        if (newBrand.trim()) {
          addBrand(newBrand.trim());
          setNewBrand('');
        }
        break;
      case 'model':
        if (newModel.name.trim() && newModel.brandId) {
          addModel(newModel);
          setNewModel({ name: '', brandId: '' });
        }
        break;
      case 'task':
        if (newTask.trim()) {
          addTask(newTask.trim());
          setNewTask('');
        }
        break;
    }
  };

  const handleEdit = (type: string, value: string, id?: string) => {
    if (editingItem.type === type && editingItem.value === value) {
      setEditingItem({ type: '', value: '' });
      return;
    }
    setEditingItem({ type, value, id });
  };

  const handleUpdate = (type: string, oldValue: string, newValue: string, id?: string) => {
    switch (type) {
      case 'deviceType':
        updateDeviceType(oldValue, newValue);
        break;
      case 'brand':
        updateBrand(oldValue, newValue);
        break;
      case 'model':
        if (id) updateModel(id, newValue);
        break;
      case 'task':
        updateTask(oldValue, newValue);
        break;
    }
    setEditingItem({ type: '', value: '' });
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h1>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Device Types
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newDeviceType}
              onChange={(e) => setNewDeviceType(e.target.value)}
              placeholder="Add new device type"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSubmit('deviceType')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {settings.deviceTypes.map((type) => (
              <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                {editingItem.type === 'deviceType' && editingItem.value === type ? (
                  <input
                    type="text"
                    defaultValue={type}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate('deviceType', type, e.currentTarget.value);
                      }
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <span>{type}</span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit('deviceType', type)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeDeviceType(type)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Brands
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="Add new brand"
              className="flex-1 rounde d-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSubmit('brand')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {settings.brands.map((brand) => (
              <div key={brand} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                {editingItem.type === 'brand' && editingItem.value === brand ? (
                  <input
                    type="text"
                    defaultValue={brand}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate('brand', brand, e.currentTarget.value);
                      }
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <span>{brand}</span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit('brand', brand)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeBrand(brand)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Models
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <select
              value={newModel.brandId}
              onChange={(e) => setNewModel({ ...newModel, brandId: e.target.value })}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select brand</option>
              {settings.brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newModel.name}
              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              placeholder="Add new model"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSubmit('model')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {settings.models.map((model) => (
              <div key={model.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                {editingItem.type === 'model' && editingItem.id === model.id ? (
                  <input
                    type="text"
                    defaultValue={model.name}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate('model', model.name, e.currentTarget.value, model.id);
                      }
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <div>
                    <span>{model.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({model.brandId})</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit('model', model.name, model.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeModel(model.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Tasks
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add new task"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleSubmit('task')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-2">
            {settings.tasks.map((task) => (
              <div key={task} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                {editingItem.type === 'task' && editingItem.value === task ? (
                  <input
                    type="text"
                    defaultValue={task}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate('task', task, e.currentTarget.value);
                      }
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <span>{task}</span>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit('task', task)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeTask(task)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}